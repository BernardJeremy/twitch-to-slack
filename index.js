const fs = require('fs');

const request = require('request');
const Slack = require('slack-node');

// Retrieve config
let twitchAPILink = require('./config.json').twitchAPILink;
let channelID = require('./config.json').chaineID;
let clientToken = require('./config.json').clientToken;
let notificationOnStatusChange = require('./config.json').notificationOnStatusChange;
let notificationOnGoingOffline = require('./config.json').notificationOnGoingOffline;
let slackUrl = require('./config.json').slackHookUrl;
let slackName = require('./config.json').slackHookName;

// Return if parameter is an array
function isArray(a) {
    return (!!a) && (a.constructor === Array);
};

// return filename for a given channelID
function getSaveFilename(targetChannelID) {
  return 'last_stream_' + targetChannelID + '.json'
}

// Perform update of the last stream ID file
function updateSavedData(targetChannelID, newData, savedData) {

  if (fs.existsSync(getSaveFilename(targetChannelID))) {
    fs.unlinkSync(getSaveFilename(targetChannelID));
  }

  if (typeof savedData[targetChannelID] === 'undefined') {
    savedData[targetChannelID] = {};
  }

  if (newData.stream) {
    savedData[targetChannelID].id = newData.stream._id
    savedData[targetChannelID].status = newData.stream.channel.status
    if (fs.existsSync(getSaveFilename(targetChannelID))) {
      fs.unlinkSync(getSaveFilename(targetChannelID));
    }
    fs.writeFileSync(getSaveFilename(targetChannelID), JSON.stringify(savedData));
  }

}

// Send the slack message to the config's webhook
function sendSlackMessage(targetChannelID, data, baseText) {
  let msgParameters = {};
  if (data.stream) {
    let text = '*' + data.stream.channel.display_name + '*' + baseText;
    text += data.stream.channel.status + ' (' + data.stream.channel.game + ')' + '\n';
    text += '<' + data.stream.channel.url + '>';
    msgParameters = {
      username: slackName,
      icon_emoji: data.stream.channel.logo,
      text: text,
    };
  } else {
      let text = '*' + targetChannelID + '*' + baseText;
      msgParameters = {
	  username: slackName,
	  text: text,
      };
  }
  let slack = new Slack();
  slack.setWebhook(slackUrl);
  slack.webhook(msgParameters, function (err, response) {
    if (response.statusCode != 200) {
      console.log(err, response);
    }
  });
}

// Retrieve full Twich API link for a given channelID
function retrieveApiLink(targetChannelID) {
  return twitchAPILink + targetChannelID + '?client_id=' + clientToken;
}

// Check if the given stream is online or not.
function performOnlineCheck(targetChannelID) {
  request(retrieveApiLink(targetChannelID), function (err, resp, html) {
    if (err) return console.error(err);

    let data = JSON.parse(html);

    let savedData = {};
    let saveFileExists = 0;
    if (fs.existsSync(getSaveFilename(targetChannelID))) {
      savedData = JSON.parse(fs.readFileSync(getSaveFilename(targetChannelID), 'utf8'))
      saveFileExists = 1;
    }

    if (data.stream == null) {
      if (notificationOnGoingOffline && saveFileExists ) {
        updateSavedData(targetChannelID, data, savedData);
        sendSlackMessage(targetChannelID, data, ' stopped streaming');
      }
    } else {
      if (savedData.length === 0 || typeof savedData[targetChannelID] === 'undefined' || savedData[targetChannelID].id !== data.stream._id) {
        updateSavedData(targetChannelID, data, savedData);
        sendSlackMessage(targetChannelID, data, ' started to stream : ');
      } else if (notificationOnStatusChange && savedData[targetChannelID].status !== data.stream.channel.status) {
        updateSavedData(targetChannelID, data, savedData);
        sendSlackMessage(targetChannelID, data, ' changed its status : ');
      }
    };
  });
}

// If channelID is an array, iterate over it.
if (isArray(channelID)) {
  channelID.forEach(function(id){
    performOnlineCheck(id);
  });
} else {
  performOnlineCheck(channelID);
}
