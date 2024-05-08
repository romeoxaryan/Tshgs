const axios = require('axios');
const path = require('path');
const fs = require('fs');

const LimitsFilePath = path.join(__dirname, 'usbvfgokerdata.json');

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
    name: "animegen",
    aliases: [`anigen`],
    version: "1.1",
    author: "ArYAN",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: 'Generate anime images based on user inputs.'
    },
    longDescription: {
      en: "Text to image"
    },
    category: "media",
    guide: {
      en: ".anigen < prompt >"
    }
  },

  onStart: async function({ message, args, event }) {
    const text = args.join(" ");
    if (!text) {
      return message.reply("⛔ Invalid Usage ( ${userLimit}/10 )\n━━━━━━━━━━━━━━━\n\nPlease provide a prompt.");
    }

    let prompt = text;

    try {
      // Check user's daily limits
      const userId = event.senderID;
      const userLimit = UserLimits.get(userId) || 0;
      if (userLimit >= 50) {
        await message.reply("You have reached your daily limits.");
        return;
      }

      message.reply("✅| Creating your Imagination...").then((info) => { id = info.messageID });

      const API = `https://aryan-apis.onrender.com/api/anigen?prompt=${encodeURIComponent(prompt)}&apikey=aryan`;
      const imageStream = await global.utils.getStreamFromURL(API);

      // Increment user's daily limit
      UserLimits.set(userId, userLimit + 1);

      // Save user limits to the JSON file
      fs.writeFileSync(LimitsFilePath, JSON.stringify([...UserLimits]), 'utf8');

      return message.reply({
        body: `🖼️ 𝗔𝗻𝗶𝗚𝗲𝗻 ( ${userLimit}/10 )\n━━━━━━━━━━━━━━━\n\nHere is your created image.`,
        attachment: imageStream
      });
    } catch (error) {
      console.error(error);
      message.reply("Failed to generate your imagination.");
    }
  }
};
