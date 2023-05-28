import checker from "./checker.js";
import app from "./app.js";
import DB from "../lib/db.js";

export default async function () {
	await DB.init();
	checker();
	app();
}
