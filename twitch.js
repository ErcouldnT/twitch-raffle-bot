const mongoose = require('mongoose');
const tmi = require('tmi.js');
require('dotenv').config();

const Win = require('./model/Win');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log('Mongo connected!');
});

// login credentials
const client = new tmi.Client({
	options: { debug: false },
	identity: {
		username: process.env.username,
		password: process.env.password
	},
	channels: [ process.env.channel ]
});

client.connect();

let raffle = [];  // to collect last messages
let count = 5;    // last messages you want to count
let command = '';
const areEqual = arr => new Set(arr).size === 1;

// clear the list after an amount of time
// once you won set a variable can_be_joined = false and make it true after a certain of time
// check the win message maybe from @yourusername or if msg.includes(yourusername) true
// if(won) write something to chat in 10 sec and send an email to owner
// say something to chat in a long period of time to act like a real person

client.on('message', (channel, tags, message, self) => {
	if(self) return;  // doesn't care about your own msg
	
	// check message includes your name (win condition?)
	if (tags.username === 'nightbot' && message.toLowerCase().includes(process.env.username.toLowerCase())) {
		console.log('********** YOU WON! **********', process.env.username);

		// say something to chat in 5 sec
		// or a random sentence from an array
		client.say(channel, "yeassssss");  // for now

		// 1. send an email to urself
		// 2. write a .json file
		// 3. mongodb
		const win = new Win({
			message,
			// from: tags.username
			// channel  // watch channel object?
			command,
			// winner: process.env.username  // watch client object?
			// res: win response to streamer
		});
		win.save().then(() => console.log('********** WIN SAVED! **********'));
	};
	
	// if you want to read !... starting messages only use || !message.startsWith('!') above
	console.log(`${tags.username}: ${message}`);  // to see what messages bot reading

	const msg = message.trim();
	raffle.push(msg);

	if (raffle.length > count) {
		// if the list exceeds the limit, delete the first msg.
		raffle.shift();
	};

	if (raffle.length === count && areEqual(raffle)) {
		// checks all messages in the list are equal
		console.log(raffle);
		command = raffle[0];  // raffle command
		console.log('********* RAFFLE STARTED *********:', command);
		client.say(channel, command);  // joins the raffle
		raffle = [];  // clear the list
	};
});

