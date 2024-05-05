const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');

const LimitsFilePath = path.join(__dirname, 'userdata.json');

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
    name: "imgbb",
    version: "1.0",
    author: "ArYAN",
    countDown: 1,
    role: 0,
    longDescription: {
      en: "Upload image to imgbb by replying to photo"
    },
    category: "tools",
    guide: {
      en: ".imgur reply with image"
    }
  },

  onStart: async function ({ api, event }) {
    const imgbbApiKey = "1b4d99fa0c3195efe42ceb62670f2a25"; // Replace "YOUR_API_KEY_HERE" with your actual API key
    const linkanh = event.messageReply?.attachments[0]?.url;
    if (!linkanh) {
      return api.sendMessage('⛔ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗨𝘀𝗲\n━━━━━━━━━━━━━━━━━━━━\n\nPlease reply to an image.', event.threadID, event.messageID);
    }

    try {
      // Check user's daily limits
      const userId = event.senderID;
      const userLimit = UserLimits.get(userId) || 0;
      if (userLimit >= 10) {
        await api.sendMessage("You have reached your daily limits.", event.threadID);
        return;
      }

      const response = await axios.get(linkanh, { responseType: 'arraybuffer' });
      const formData = new FormData();
      formData.append('image', Buffer.from(response.data, 'binary'), { filename: 'image.png' });
      const res = await axios.post('https://api.imgbb.com/1/upload', formData, {
        headers: formData.getHeaders(),
        params: {
          key: imgbbApiKey
        }
      });
      const imageLink = res.data.data.url;
      await api.sendMessage(`⛔|𝗜𝗺𝗴𝗯𝗯 ( ${userLimit}/10 )\n━━━━━━━━━━━━━━━━━━\n\nHere is your image imgbb link created\n\n🖇️𝗟𝗶𝗻𝗸\n➤ ${imageLink}`, event.threadID, event.messageID);

      // Increment user's daily limit
      UserLimits.set(userId, userLimit + 1);

      // Save user limits to the JSON file
      fs.writeFileSync(LimitsFilePath, JSON.stringify([...UserLimits]), 'utf8');
    } catch (error) {
      console.error(error);
      return api.sendMessage('Failed to upload image to imgbb.', event.threadID, event.messageID);
    }
  }
};