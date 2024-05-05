module.exports = {
  config: {
    name: "sicbo",
    version: "1.0",
    author: "ArYAN",
    countDown: 0,
    role: 0,
    longDescription: {
      en: "Play Sicbo, the oldest gambling game, and earn money",
    },
    category: "game",
    guide: {
      en: ".sicbo [ Small / Big ] [ amount of money ]"
    }
  },

  onStart: async function ({ args, message, usersData, event }) {
    const betType = args[0];
    const betAmount = parseInt(args[1]);
    const user = event.senderID;
    const userData = await usersData.get(event.senderID);

    if (!["small", "big"].includes(betType)) {
      return message.reply("🔎|𝗦𝗶𝗰𝗯𝗼\n━━━━━━━━━━━━\n\nPlease choose 'small' or 'big'.");
    }

    if (isNaN(betAmount) || betAmount < 50) {
      return message.reply("🔎|𝗦𝗶𝗰𝗯𝗼\n━━━━━━━━━━━━\n\nPlease bet an amount of 50 or more.");
    }

    if (betAmount > userData.money) {
      return message.reply("🔎|𝗦𝗶𝗰𝗯𝗼\n━━━━━━━━━━━━\n\nYou don't have enough money to make that bet.");
    }

    const dice = [1, 2, 3, 4, 5, 6];
    const results = [];

    for (let i = 0; i < 3; i++) {
      const result = dice[Math.floor(Math.random() * dice.length)];
      results.push(result);
    }

    const sum = results.reduce((acc, curr) => acc + curr, 0);

    const winConditions = {
      small: sum >= 4 && sum <= 10,
      big: sum >= 11 && sum <= 17,
    };

    const resultString = results.join(" | ");

    if ((winConditions[betType] && Math.random() <= 0.4) || (!winConditions[betType] && Math.random() > 0.4)) {
      const winAmount = 1 * betAmount;
      userData.money += winAmount;
      await usersData.set(event.senderID, userData);
      return message.reply(`🔎|𝗦𝗶𝗰𝗯𝗼\n━━━━━━━━━━━━\n\n(\\_/)\n( •_•)\n// >[ ${resultString} ]\n\n🎉 | Congratulations! You won ${winAmount}!`);
    } else {
      userData.money -= betAmount;
      await usersData.set(event.senderID, userData);
      return message.reply(`🔎|𝗦𝗶𝗰𝗯𝗼\n━━━━━━━━━━━━\n\n(\\_/)\n( •_•)\n// >[ ${resultString} ]\n\n😿 | You lost ${betAmount}.`);
    }
  }
};