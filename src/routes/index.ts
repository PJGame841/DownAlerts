import { Application } from "express";
import check from "./check.js";
import settings from "./settings.js";

export default function (app: Application) {
	app.use("/api/check", check);
	app.use("/api/settings", settings);
}
