import express from 'express';
import remail from 'email-regex';
import { invite, lookupUser } from '../slack-invite';

var org = process.argv[2] || process.env.SLACK_SUBDOMAIN;
const token = process.argv[3] || process.env.SLACK_API_TOKEN;
const cmdToken = process.argv[4] || process.env.SLACK_COMMAND_TOKEN;

const router = express.Router();

router.post('/', (req, res) => {
  const email = req.body.text;
  const user_id = req.body.user_id;

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

  lookupUser({ org, token, user_id }, function(err, user){
    if (err) {
      return res
        .status(400)
        .end(err.message);
    }

    const userName = user.real_name || `@${user.name}`;
    const userEmail = user.profile.email ? ` (${user.profile.email})` : '';
    
    const message = `
      Hey there!

      ${userName}${userEmail} has requested that you be invited to join our slack team.

      Looking forward to seeing you soon :)
    `;

    invite({ org, token, email, message }, err => {
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
});

export default router;
