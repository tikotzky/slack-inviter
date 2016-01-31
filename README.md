
# slackin

A little server that enables existing slack team members
to invite new members to a Slack server via a slash command.

## How to use

### Server

#### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/tikotzky/slack-inviter/)

#### Custom

Install it and launch it on your server:

```bash
$ git clone git@github.com:tikotzky/slack-inviter.git
$ cd slack-inviter
$ npm install
$ npm start --  "your-team-id" "your-slack-token" "slash-command-token"
```

Your team id is what you use to access your login page on Slack (eg: https://**{this}**.slack.com).

You can find your slack API token at [api.slack.com/web](https://api.slack.com/web) – note that the user you use to generate the token must be an admin. It's best to create a dedicated `@invitebot` user (or similar), mark that user an admin, and use a token from that dedicated admin user.

You'll get a slash command token when you create a slash command [here](https://slack.com/apps/A0F82E8CA-slash-commands)

## API

Requiring `slack-inviter` as a module will return
an express `Router` that can be mounted at 
any route in an existing express app.

For example to mount it at `/slack-invite` in an existing express app
you would use it like this.
```js
import inviteRoute from 'slack-inviter';
app.use('/slack-invite', inviteRoute);
```

## Credits

- The invite code was taken from [rauchg/slackin](https://github.com/rauchg/slackin)

## License

MIT