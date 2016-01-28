import express from 'express';
import remail from 'email-regex';
import slackInvite from '../slack-invite';

var org = process.argv[2] || process.env.SLACK_SUBDOMAIN;
const token = process.argv[3] || process.env.SLACK_API_TOKEN
const cmdToken = process.argv[4] || process.env.SLACK_COMMAND_TOKEN

const router = express.Router();

router.post('/', (req, res) => {
  const email = req.body.text;

  if (cmdToken !== req.body.token) {
    return res
      .status(400)
      .end('Invalid Token')
  }

  if (!email) {
    return res
      .status(400)
      .end('No email provided');
  }

  if (!remail().test(email)) {
    return res
      .status(400)
      .end('Invalid email');
  }

  slackInvite({ org, token, email }, err => {
    if (err) {
      return res
        .status(400)
        .end(err.message);
    }

    res
      .status(200)
      .end(`WOOT. "${email}" should receive an invite shortly!`);
  });
});

export default router;
