const axios = require('axios');
const fs = require('fs');
const path = require('path');

const prefix = '.'; // Define the command prefix

const LimitsFilePath = path.join(__dirname, 'userdagdsgta.json');

let UserLimits = new Map();

// Load user limits from the JSON file
try {
  const limitsData = fs.readFileSync(LimitsFilePath, 'utf8');
  UserLimits = new Map(JSON.parse(limitsData));
} catch (error) {
  console.error("Error loading user limits:", error.message);
}

module.exports = {
  config: {
    name: "chatgpt",
    aliases: [`ai`],
    version: 1.0,
    author: "ArYAN",
    longDescription: {
      en: "Ask an questions from Ai based on Advanced model ( GPT-3 )"
    },
    category: "ai",
    guide: {
      en: ".ai [ questions ]",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      // Check user's daily limits
      const userId = event.senderID;
      let userLimit = UserLimits.get(userId) || 0;
      if (userLimit >= 30) {
        await message.reply("You have reached your daily limits.");
        return;
      }

      const prompt = event.body.substring(prefix.length).trim();
      if (!prompt) {
        await message.reply(`💬 𝗖𝗵𝗮𝘁𝗚𝗣𝗧 ( ${userLimit}/30 )\n\nHello! How can I assist you today?`);
        return;
      }

      api.setMessageReaction("⏰", event.messageID, (err) => {}, true);

      const response = await axios.get(`https://aryan-apis.onrender.com/ask/gpt?prompt=${encodeURIComponent(prompt)}&key=loveyou`);
      const answer = response.data.answer;

      api.setMessageReaction("⏰", event.messageID, (err) => {}, true);

      await message.reply(`💬 𝗖𝗵𝗮𝘁𝗚𝗣𝗧 ( ${userLimit}/30 )\n\n${answer}`);

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);

      // Increment user's daily limit
      userLimit++;
      UserLimits.set(userId, userLimit);

      // Save user limits to the JSON file
      fs.writeFileSync(LimitsFilePath, JSON.stringify([...UserLimits]), 'utf8');

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};