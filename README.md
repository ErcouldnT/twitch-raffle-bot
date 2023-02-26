# Twitch Raffle BOT

- Listens to Twitch chat and auto-writes the commonly typing word for auto-joining the raffles on your behalf.
- Tracks your winnings and writes a message to the chat that you'd like to.

## Used techs

> [tmi.js](https://tmijs.com) - _connecting twitch chat_ \
> [dotenv](https://www.npmjs.com/package/dotenv) - _hiding your login credentials_ \
> [prisma](https://www.prisma.io) - _database connection_

## Start the bot

- Clone the repo and install dependencies via

```js
npm i
```

- Take your [Twitch Chat OAuth Password](https://twitchapps.com/tmi/)
- Set your login credentials in your ENV then
- Apply database schema `npx prisma db push`

```js
npm run bot
```

- Open web interface

```js
npm run web
```

## Can be added

- [x] Prisma ORM to save wins to database.
- [x] Add some logic to avoid multiple joining.
- [ ] Send an email that includes you won a prize.
- [ ] Desktop notification when joined raffle and won.
- [x] Give feedback to streamer if you won in 5 seconds.
- [ ] Act like a real person while hanging around in chat.
- [x] Listen and join multiple twitch channels at the same time.

## Deployment

> [AWS EC2](https://aws.amazon.com/ec2) - _running 24/7_
