import dotenv from "dotenv";
import Checker from "./checker";
import Discord from "./discord";

dotenv.config();

const envs: { [key: string]: string | undefined } = {
	DISCORD_WEBHOOK: "",
	CHECK_INTERVAL: "10000",
	CHECK_ADDR: null,
	CHECK_PORT: null,
	CHECK_TIMEOUT: "2500",
	CHECK_NOTIFY: "0",
};

for (const key of Object.keys(envs)) {
	if (process.env[key]) {
		continue;
	}
	const value = envs[key];
	if (!value) {
		throw new Error(`${key} is not set`);
	}

	console.log(`${key} is not set, using default value: ${value}`);
	process.env[key] = value;
}

const checker = new Checker();
checker.onError(() => {
	if (!parseInt(process.env.CHECK_NOTIFY)) {
		return console.log("Discord notification is disabled");
	}

	Discord.send("Down detected !");
});
