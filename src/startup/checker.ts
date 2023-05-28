import Checker from "../lib/checker.js";
import Discord from "../lib/discord.js";

export default function () {
	const checker = new Checker();
	checker.onError(
		(addr: string, port: number, alert: boolean, reason: string) => {
			if (alert) Discord.send(addr, port, reason);
		}
	);
}
