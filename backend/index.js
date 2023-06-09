import express from "express";
import { Deta } from "deta";

const PORT = process.env.PORT ?? 3000;

const deta = Deta();
const drive = deta.Drive("uploads");
const base = deta.Base("share");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.get("/", (req, res) => res.send("ok"));

app.get("/share/:key", async (req, res) => {
	let item = null;

	try {
		// Delete after one day.
		item = await base.get(req.params.key);
		if (item === null) throw Error("Incorrect shortcode or shortcode expired.");
	} catch (err) {
		res.status(500).send(err.toString());
		return;
	}

	res.send(item);
});

app.post("/share", async (req, res) => {
	let item;
	try {
		// Delete after one day.
		item = await base.put({
			value: req.body,
			name: req.query.name
		}, null, { expireIn: 86400 });
	} catch (err) {
		res.status(500).send(err.toString());
		return;
	}

	res.send(item.key);
});

// ToDo: Upload files?
/*
app.get("/files/:file", async (req, res) => {
	const file = null;

	const blob = await drive.get(req.params.file);
	const arrayBuffer = await blob.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	console.log(blob);

	res.writeHead(200, {
		"Content-Type": blob.type,
		"Content-Length": blob.size,
		"Content-Disposition": `attachment; filename="${req.params.file}"`
	});
	res.end(buffer);
});

app.post("/upload", async (req, res) => {
	let data = null;

	const {
		file,
		name
	} = req.body;

	data = await drive.put(name, {
		data: file,
	});

	res.send(data);
});
*/

app.listen(PORT, () => console.log("App listening on", PORT));
