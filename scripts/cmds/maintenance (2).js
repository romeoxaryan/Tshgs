const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
  config: {
    name: "maintenance",
    aliases: [`maintain`, `maintenace`],
    version: "1.3",
    author: "ArYAN",
    countDown: 0,
    role: 2,
    longDescription: {
      en: "turns on maintenance mode to avoid issues"
    },
    category: "Config",
    guide: {
      en: "   {pn} [on | off]: turn on/off the maintenance mode"
        + "\n   {pn} noti [on | off]: turn on/off the notification when maintenance mode"
    }
  },

  langs: {
    en: {
      turnedOn: "✅ | Maintenance mode is on",
      turnedOff: "✅ | Maintenance mode is off",
      turnedOnNoti: "✅ | Maintenance mode notfication is on",
      turnedOffNoti: "✅ | Maintenance mode notfication is off"
    }
  },

  onStart: function ({ args, message, getLang }) {
    let isSetNoti = false;
    let value;
    let indexGetVal = 0;

    if (args[0] == "noti") {
      isSetNoti = true;
      indexGetVal = 1;
    }

    if (args[indexGetVal] == "on")
      value = true;
    else if (args[indexGetVal] == "off")
      value = false;
    else
      return message.SyntaxError();

    if (isSetNoti) {
      config.adminOnly.hideNotiMessage = !value;
      message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
    }
    else {
      config.adminOnly.enable = value;
      message.reply(getLang(value ? "turnedOn" : "turnedOff"));
    }

    fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
  }
};