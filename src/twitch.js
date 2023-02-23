const tmi = require("tmi.js");
const delay = require("delay");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config();
const username = process.env.USERNAME.toLowerCase().trim();
const password = process.env.PASSWORD.toLowerCase().trim();

// add channels here
const channels = ["ercodelabs", "kozbishoww", "targetlocated"];
const count = 5; // last messages you want to track for detecting raffle command
const timer = 1000 * 60 * 2; // to avoid joining to same raffle for 2 minutes
const debug = true;
const prisma = new PrismaClient();

const areEqual = (arr) => new Set(arr).size === 1;

// login credentials
const client = new tmi.Client({
  options: { debug },
  identity: {
    username,
    password,
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
    raffleId: "",
    raffleTime: "",
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
    message.toLowerCase().includes(username) &&
    // and if the raffleStarted is true
    trackingChannels[channel].raffleStarted
  ) {
    console.log("********** YOU WON! **********", username);
    trackingChannels[channel].raffleWon = true; // make it false when it saved to db or emailed
    trackingChannels[channel].raffleStarted = false;

    // 1. send an email to yourself
    // 2. or write a .json file
    // 3. prisma to db
    const raffle = await prisma.raffle.update({
      include: {
        win: {
          include: {
            username: true,
            channel: true,
            raffle: true,
          },
        },
      },
      where: {
        id: trackingChannels[channel].raffleId,
      },
      data: {
        win: {
          create: {
            winMsg: message,
            from: tags.username,
            yourMsg: "yeassssss!", // TODO: create random message
            username: {
              connectOrCreate: {
                where: { username },
                create: { username },
              },
            },
            channel: {
              connectOrCreate: {
                where: { channel },
                create: { channel },
              },
            },
          },
        },
      },
    });
    console.log(raffle.win);
    trackingChannels[channel].raffleId = "";
    trackingChannels[channel].raffleTime = "";
    trackingChannels[channel].raffleWon = false;

    // say something to chat in 5 sec
    // or a random sentence from an array
    await delay(5000);
    client.say(channel, "yeassssss!");
  }

  // (--Trying to detect Raffle Command--)
  trackingChannels[channel].messages.push(message.trim());

  if (trackingChannels[channel].messages.length > count) {
    // if the list exceeds the limit, delete the first msg.
    trackingChannels[channel].messages.shift();
  }

  // (--Join Condition--)
  if (
    trackingChannels[channel].messages.length === count &&
    // checks all messages in the list are equal
    areEqual(trackingChannels[channel].messages) &&
    // raffleTime check to avoid multiple joining for same raffle
    Date.now() - trackingChannels[channel].raffleTime > timer
  ) {
    trackingChannels[channel].raffleCommand =
      trackingChannels[channel].messages[0]; // raffle command
    // Use raffleTime otherwise raffleStarted won't be false again (never win)
    client.say(channel, trackingChannels[channel].raffleCommand); // joins the raffle
    trackingChannels[channel].raffleStarted = true;
    trackingChannels[channel].raffleTime = Date.now();
    trackingChannels[channel].messages = []; // clear the list
    console.log(
      "********* RAFFLE STARTED *********:",
      trackingChannels[channel].raffleCommand
    );

    // saves raffle to db
    const raffle = await prisma.raffle.create({
      include: {
        username: true,
        channel: true,
      },
      data: {
        raffleCmd: trackingChannels[channel].raffleCommand,
        username: {
          connectOrCreate: {
            where: { username },
            create: { username },
          },
        },
        channel: {
          connectOrCreate: {
            where: { channel },
            create: { channel },
          },
        },
      },
    });
    console.log(raffle);
    trackingChannels[channel].raffleId = raffle.id;
  }
});
