import express from "express";
import Deta from "deta";

const PORT = process.env.PORT ?? 3000;

const app = express();

app.get("/", (req, res) => res.send("ok"));

app.listen(PORT, () => console.log("App listening on", PORT));
