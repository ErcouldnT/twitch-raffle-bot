# Twitch Raffle BOT
- *Listens to Twitch chat and auto-writes the commonly typing word for auto-joins the raffles on your behalf.*
- *Tracks your winnings and writes a message to the chat that you'd like to.*

## Used techs
> [tmi.js](https://tmijs.com) - connecting twitch chat \
> [dotenv](https://www.npmjs.com/package/dotenv) - hiding your login credentials

## Start the bot
- Take your [Twitch Chat OAuth Password](https://twitchapps.com/tmi/)
- Set your login credentials in your ENV variables then
```js
npm run start
```

### Can be added
* [ ] Give feedback to streamer if you won.
* [ ] Use JS timers to avoid multiple joining.
* [ ] Send an email that includes you won a prize.

## Deployment
> [AWS EC2](https://aws.amazon.com/ec2) - running 24/7

