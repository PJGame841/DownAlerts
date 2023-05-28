import net from "node:net";
import DB from "./db.js";
import { performance } from "perf_hooks";

class Checker {
	private static interval: NodeJS.Timer;
	private static errorFunction: (
		addr: string,
		port: number,
		alert: boolean,
		reason: string
	) => void;
	constructor() {
		if (Checker.interval) {
			return null;
		}

		Checker.interval = setInterval(() => {
			this.check();
		}, parseInt(process.env.CHECK_INTERVAL));
	}

	static async isUp(addr: string, port: number, timeout?: number) {
		return new Promise<{ status: boolean; ping: number; reason?: string }>(
			(resolve) => {
				const sock = new net.Socket();
				const startTime = performance.now();
				const timer = setTimeout(() => {
					resolve({
						status: false,
						ping: performance.now() - startTime,
						reason: "timeout",
					});
					sock.destroy();
				}, timeout || parseInt(process.env.CHECK_TIMEOUT));

				sock
					.on("connect", function () {
						resolve({ status: true, ping: performance.now() - startTime });
						sock.destroy();
						clearTimeout(timer);
					})
					.on("error", function (e) {
						resolve({
							status: false,
							ping: performance.now() - startTime,
							reason: e.message,
						});
						clearTimeout(timer);
					})
					.connect(port, addr);
			}
		);
	}

	private async check() {
		console.log("Checking...");

		const checks = (await DB.getData()).checkList;
		if (!checks) {
			return;
		}

		for (const check of checks) {
			const { addr, port, timeout, alert } = check;

			const { status, ping, reason } = await Checker.isUp(addr, port, timeout);

			if (!status) {
				console.log(`${addr}:${port} is down: ${reason}`);
				Checker.errorFunction(addr, port, alert, reason);
			} else {
				console.log(`${addr}:${port} is up - ${ping}`);
			}
		}
	}

	public onError(func: typeof Checker.errorFunction) {
		Checker.errorFunction = func;
	}
}

export default Checker;
