import axios from "axios";

class Discord {
	static send(address: string, port: number, reason: string) {
		if (!process.env.DISCORD_WEBHOOK) {
			throw new Error("DISCORD_WEBHOOK is not set");
		}

		axios
			.post(process.env.DISCORD_WEBHOOK, {
				embeds: [
					{
						title: "Service down",
						type: "rich",
						description: "",
						color: 0xd40000,
						provider: {
							name: "Down Alerts Provider",
							url: "https://google.com/",
						},
						fields: [
							{
								name: "Address",
								value: address,
								inline: true,
							},
							{
								name: "Port",
								value: port,
								inline: true,
							},
							{
								name: "Reason",
								value: "Connection " + reason,
								inline: true,
							},
						],
						author: {
							name: "Down Alerts",
							url: "https://github.com/PJGame841/DownAlerts",
							icon_url:
								"https://cdn.discordapp.com/avatars/264026681931464704/6cfa1e21765140e9f7edfca5fb54cd85.webp?size=40",
						},
					},
				],
			})
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log("Unable to fetch discord webhook: ", err.response);
			});
	}
}

export default Discord;
