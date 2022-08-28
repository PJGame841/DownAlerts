import net from "node:net";

class Checker {
	private static interval: NodeJS.Timer;
	private static errorFunction: () => void;
	constructor() {
		if (Checker.interval) {
			return null;
		}

		Checker.interval = setInterval(() => {
			this.check();
		}, parseInt(process.env.CHECK_INTERVAL));
	}

	private check() {
		console.log("Checking...");

		const addr = "google.com";
		const port = 80;

		const sock = new net.Socket();
		const timer = setTimeout(() => {
			console.log(addr + ":" + port + " is down: timeout");
			Checker.errorFunction();
			sock.destroy();
		}, parseInt(process.env.CHECK_TIMEOUT));

		sock
			.on("connect", function () {
				console.log(addr + ":" + port + " is up.");
				sock.destroy();
				clearTimeout(timer);
			})
			.on("error", function (e) {
				console.log(addr + ":" + port + " is down: " + e.message);
				Checker.errorFunction();
				clearTimeout(timer);
			})
			.connect(port, addr);
	}

	public onError(func: () => void) {
		Checker.errorFunction = func;
	}
}

export default Checker;
