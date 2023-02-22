const delay = require("delay");
const tmi = require("tmi.js");

require("dotenv").config();

// add channels here
const channels = ["Kozbishoww", "Ercouldnt"];
const count = 3; // last messages you want to track for detecting raffle command
const debug = true;

const areEqual = (arr) => new Set(arr).size === 1;

// const config = {
//   onJoinedRaffle: {
//     SEND_AN_EMAIL_WHEN_JOINED: true,
//     SAVE_ALL_JOINED_RAFFLES_TO_DATABASE: true,
//   },
//   onWon: {
//     SEND_AN_EMAIL_WHEN_WON: true,
//     SAVE_TO_DATABASE_WHEN_WON: true,
//   },
// };

// login credentials
const client = new tmi.Client({
  options: { debug },
  identity: {
    username: process.env.username,
    password: process.env.password,
  },
  channels,
});

client.connect();

const trackingChannels = {};

for (let i = 0; i < channels.length; i++) {
  const channel = channels[i];
  const channelObject = {
    channel,
    messages: [],
    raffleCommand: "",
    raffleStarted: false,
    raffleWon: false,
  };
  trackingChannels[channel] = channelObject;
}
// console.log(trackingChannels);

// clear the list after an amount of time
// once you won set a variable can_be_joined = false and make it true after a certain of time
// check the win message maybe from @yourusername or if msg.includes(yourusername) true
// if(won) write something to chat in 10 sec and send an email to owner
// say something to chat in a long period of time to act like a real person

client.on("message", async (channel, tags, message, self) => {
  if (self) return; // doesn't care about your own msg
  // if you want to read !... starting messages only, use || !message.startsWith('!') above.
  // console.log(`${tags.username}: ${message}`); // to see what messages bot reading

  // check message includes your name (--Win Condition--)
  if (
    // tags.username === "nightbot" &&
    message.toLowerCase().includes(process.env.username.toLowerCase())
  ) {
    console.log("********** YOU WON! **********", process.env.username);
    trackingChannels[channel].raffleWon = true; // make it false when it saved to db or emailed
    trackingChannels[channel].raffleStarted = false;

    // say something to chat in 5 sec
    // or a random sentence from an array
    await delay(5000);
    client.say(channel, "yeassssss!");

    // 1. send an email to yourself
    // 2. or write a .json file
    // 3. prisma to db

    // saves win to db
    // const win = new Win({
    //   message,
    //   // from: tags.username,
    //   // channel,  // watch channel object?
    //   command,
    //   // winner: process.env.username,  // watch client object?
    //   // res: win response to streamer
    // });
    // win.save().then(() => console.log("********** WIN SAVED! **********"));
  }

  trackingChannels[channel].messages.push(message.trim());

  if (trackingChannels[channel].messages.length > count) {
    // if the list exceeds the limit, delete the first msg.
    trackingChannels[channel].messages.shift();
  }

  if (
    trackingChannels[channel].messages.length === count &&
    areEqual(trackingChannels[channel].messages)
  ) {
    // checks all messages in the list are equal
    trackingChannels[channel].raffleCommand =
      trackingChannels[channel].messages[0]; // raffle command
    console.log(
      "********* RAFFLE STARTED *********:",
      trackingChannels[channel].raffleCommand
    );
    client.say(channel, trackingChannels[channel].raffleCommand); // joins the raffle
    trackingChannels[channel].raffleStarted = true;
    trackingChannels[channel].messages = []; // clear the list

    // saves raffle to db
    // const raffle = new Raffle({
    //   command,
    //   // channel,
    //   // username
    // });
    // raffle
    //   .save()
    //   .then(() => console.log("********** JOINED A RAFFLE! **********"));
  }
  // console.log(trackingChannels);
});
