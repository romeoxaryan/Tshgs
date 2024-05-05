module.exports = {
  config: {
    name: "tid",
    version: "1.0",
    author: "ArYAN",
    countDown: 0,
    role: 0,
    longDescription: {
      en: "View threadID of your group chat"
    },
    category: "info",
    guide: {
      en: "{p}{n}"
    }
  },

  onStart: async function ({ message, event }) {
    message.reply(`🔎 𝗜𝗻𝗳𝗼\n━━━━━━━━━━\n\n➤  ${event.threadID.toString()}`);
  }
};