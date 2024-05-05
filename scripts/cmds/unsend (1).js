module.exports = {
	config: {
		name: "unsend",
		version: "1.2",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		longDescription: {
			en: "Unsend bot's message"
		},
		category: "box chat",
		guide: {
			en: "reply the message you want to unsend and call the command {pn}"
		}
	},

	langs: {
		en: {
			syntaxError: "⛔|𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗨𝘀𝗲\n━━━━━━━━━━━━\n\nPlease reply the message you want to unsend"
		}
	},

	onStart: async function ({ message, event, api, getLang }) {
		if (!event.messageReply || event.messageReply.senderID != api.getCurrentUserID())
			return message.reply(getLang("syntaxError"));
		message.unsend(event.messageReply.messageID);
	}
};