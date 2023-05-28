import { Router, Request, Response } from "express";
import DB, { DBType } from "./../lib/db.js";
import Checker from "./../lib/checker.js";

const router = Router();

const getChecks = async () => {
	const checks = (await DB.getData()).checkList || ({} as DBType["checkList"]);

	const promises = checks.map(async ({ addr, port, timeout, alert }) => {
		const { status, ping, reason } = await Checker.isUp(addr, port, timeout);
		return { addr, port, timeout, alert, status, ping, reason };
	});
	return await Promise.all(promises);
};

router.get("/", async (_req: Request, res: Response) => {
	res.json({ valid: true, data: await getChecks() });
});

router.post("/new", async (req: Request, res: Response) => {
	const { addr, port, timeout, alert } = req.body;
	if (!addr || !parseInt(port)) {
		res.json({ valid: false, error: "addr and port are required" });
		return;
	}

	const data = await DB.getData();
	data.checkList = data.checkList || [];
	data.checkList.push({ addr, port, timeout, alert: alert == 1 });
	await DB.setData(data);
	res.json({ valid: true, data: await getChecks() });
});

router.put("/", async (req: Request, res: Response) => {
	const id = req.query.id as string;
	const newAlert = req.body.alert;

	if (!id)
		return res.status(400).json({ valid: false, error: "id is required" });
	if (newAlert !== true && newAlert !== false)
		return res.status(400).json({ valid: false, error: "alert is required" });

	const infos = id.split(":");

	const data = await DB.getData();
	data.checkList = data.checkList || [];
	data.checkList = data.checkList.map(({ addr, port, timeout, alert }) => ({
		addr,
		port,
		timeout,
		alert: addr == infos[0] && port == parseInt(infos[1]) ? newAlert : alert,
	}));
	await DB.setData(data);

	res.json({ valid: true, data: await getChecks() });
});

router.delete("/", async (req: Request, res: Response) => {
	const id = req.query.id as string;
	if (!id)
		return res.status(400).json({ valid: false, error: "id is required" });

	const infos = id.split(":");

	const data = await DB.getData();
	data.checkList = data.checkList || [];
	data.checkList = data.checkList.filter(
		({ addr, port }) => addr != infos[0] || port != parseInt(infos[1])
	);
	await DB.setData(data);

	res.json({ valid: true, data: await getChecks() });
});

export default router;
