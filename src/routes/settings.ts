import { Router, Request, Response } from "express";
import Settings from "./../lib/settings.js";
import { DBType } from "./../lib/db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
	const settingsTbl = Settings.getTable();
	const settings = await Settings.getAll();

	const data: { [key: string]: (typeof settingsTbl)[0] & { value: string } } =
		{};
	for (const set in settingsTbl) {
		data[set as keyof typeof settingsTbl] = {
			description: settingsTbl[set].description,
			default: settingsTbl[set].default,
			protected: settingsTbl[set].protected,
			value: !settingsTbl[set].protected
				? settings[set as keyof DBType["settings"]]
				: undefined,
		};
	}

	res.json({
		valid: true,
		data,
	});
});

export default router;
