const tmi = require('tmi.js');
require('dotenv').config();

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
const areEqual = arr => new Set(arr).size === 1;

// clear the list after an amount of time
// once you won set a variable can_be_joined = false and make it true after a certain of time
// check the win message maybe from @yourusername or if msg.includes(yourusername) true
// if(won) write something to chat in 10 sec and send an email to owner

client.on('message', (channel, tags, message, self) => {
	if(self) return;  // doesn't care about your own msg
	
	// check message includes your name (win condition?)
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
		const command = raffle[0];  // raffle command
		console.log('********* RAFFLE STARTED *********:', command);
		client.say(channel, command);  // joins the raffle
		raffle = [];  // clear the list
	};
});

