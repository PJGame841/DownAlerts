import DB, { DBType } from "./db.js";

export default class Settings {
	static getTable = (): {
		[key: string]: {
			description: string;
			default: string;
			protected?: boolean;
		};
	} => {
		return {
			DISCORD_WEBHOOK: {
				description: "Discord Webhook URL",
				default: "",
				protected: true,
			},
			CHECK_INTERVAL: {
				description: "Check Interval timer in ms",
				default: "10000",
			},
			CHECK_TIMEOUT: {
				description: "Check Timeout in ms",
				default: "50000",
			},
		};
	};

	static async getAll() {
		return (await DB.getData()).settings;
	}

	static async init() {
		const data = await DB.getData();
		data.settings = data.settings || {
			DISCORD_WEBHOOK: "",
			CHECK_INTERVAL: "",
			CHECK_TIMEOUT: "",
		};
		await DB.setData(data);
	}

	static async get(key: keyof DBType["settings"]) {
		return (await DB.getData()).settings[key];
	}

	static async set(key: keyof DBType["settings"], value: never) {
		const data = await DB.getData();
		data.settings[key] = value;
		await DB.setData(data);
	}
}
