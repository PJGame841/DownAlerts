import bodyParser from "body-parser";
import express from "express";
import routes from "../routes/index.js";

export default function () {
	const app = express();

	app.use(bodyParser.json());

	routes(app);

	const port = process.env.PORT || 5000;
	app.listen(port, () => console.log(`Listening on port ${port}`));
}
