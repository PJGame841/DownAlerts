import path from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import Settings from "./settings.js";

export interface DBType {
	checkList: {
		addr: string;
		port: number;
		timeout: number;
		alert: boolean;
	}[];
	settings: {
		DISCORD_WEBHOOK?: string;
		CHECK_INTERVAL?: string;
		CHECK_TIMEOUT?: string;
	};
}

class DB {
	private static db: Low<DBType>;
	public static async init() {
		if (DB.db) return;

		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		// Use JSON file for storageimport Settings from './settings';

		const file = path.resolve(__dirname, "../../db.json");
		const adapter = new JSONFile<DBType>(file);
		DB.db = new Low<DBType>(adapter);

		// Read data from JSON file, this will set db.data content
		await DB.db.read();

		DB.db.data = DB.db.data || {
			checkList: [],
			settings: {},
		};

		await DB.onLoad();
	}

	private static async onLoad() {
		console.log("Loaded DB");

		await Settings.init();

		for (const set in await Settings.getTable()) {
			let value = await Settings.get(set as keyof DBType["settings"]);
			if (!value) {
				value = Settings.getTable()[set].default;
				if (!value) continue;
				console.log("Setting default value for " + set);
			} else {
				console.log("Setting " + set + " from config");
			}

			process.env[set] = value;
		}
	}

	public static async getData(): Promise<DBType> {
		return DB.db.data;
	}
	public static async setData(data: DBType): Promise<void> {
		DB.db.data = data;
		await DB.db.write();
	}
}

export default DB;
