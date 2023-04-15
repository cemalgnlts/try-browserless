import puppeteer from "puppeteer-core/lib/esm/puppeteer/web";
import "./detaCollection";

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const WSS_BASE = "wss://chrome.browserless.io";

let perfStart = 0;

const logger = new Proxy(
  {},
  {
    get(_, fun) {
      return (...args) =>
        self.postMessage({
          type: "log",
          data: { fun, args }
        });
    }
  }
);

console.log("worker ready.");

self.addEventListener("message", async (message) => {
  const { type, data } = message.data;

  switch (type) {
    case "run":
      perfStart = performance.now();
      startBrowser(data);
      break;
  }
});

async function startBrowser({ code, options }) {
  const browserWSEndpoint = new URL(WSS_BASE);
  browserWSEndpoint.searchParams.set("headless", options.headless);
  browserWSEndpoint.searchParams.set("stealth", options.stealth);
  browserWSEndpoint.searchParams.set("blockAds", options.blockAds);

  const browser = await puppeteer.connect({ browserWSEndpoint }).catch((err) => {
    console.error(err);
    logger.error(err);
    return null;
  });

  if (!browser) {
    logger.error("Browser start failed");
    throw new Error("Browser start failed");
  }

  const page = await browser.newPage();
  page._screenshot = page.screenshot;
  page.screenshot = (args) => page._screenshot({ ...args, fullPage: false, encoding: "base64" });

  let client = null;
  if (options.livePreview) client = await initLivePreview(page);

  const device = puppeteer.devices[options.emulation];
  if (device) {
    await page.emulate(device);
  } else {
    await page.setViewport({
      width: 1280,
      height: 720
    });
  }

  try {
    const compileFun = new AsyncFunction("page,console", code);
    await compileFun(page, logger);
  } catch (err) {
    console.error(err);
    logger.error(err);
  }

  if (client) await client.send("Page.stopScreencast");
  await browser.close();

  const perfEnd = performance.now();

  self.postMessage({
    type: "browserClosed",
    data: perfEnd - perfStart
  });
}

async function initLivePreview(page) {
  const client = await page.target().createCDPSession();
  client.on("Page.screencastFrame", (frame) => {
    self.postMessage({
      type: "frame",
      data: {
        img: frame.data
      }
    });
    client.send("Page.screencastFrameAck", {
      sessionId: frame.sessionId
    });
  });

  await client.send("Page.startScreencast", {
    format: "jpeg",
    quality: 10,
    everyNthFrame: 1
  });

  return client;
}
