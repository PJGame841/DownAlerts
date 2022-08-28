import axios from "axios";

class Discord {
	static send(message: string) {
		if (!process.env.DISCORD_WEBHOOK) {
			throw new Error("DISCORD_WEBHOOK is not set");
		}

		axios
			.post(process.env.DISCORD_WEBHOOK, { content: message })
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log("Unable to fetch discord webhook: ", err);
			});
	}
}

export default Discord;
