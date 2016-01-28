import request from 'superagent';

export function lookupUser({ org, token, user_id }, fn) {

  const data = { user: user_id, token };

  request
  .post(`https://${org}.slack.com/api/users.info`)
  .type('form')
  .send(data)
  .end(function(err, res){
    if (err) { return fn(err); }
    if (200 != res.status) {
      fn(new Error(`Invalid response ${res.status}.`));
      return;
    }
    console.log(`https://${org}.slack.com/api/users.info`, res.body);

    const { ok, error: providedError, user } = res.body;

    if (!ok) {
      fn(new Error(providedError));
    }

    fn(null, user);

  })

}

export function invite({ org, token, email, channel, message }, fn) {
  let data = { email, token };

  if (message) {
    data.extra_message = message;
  }

  if (channel) {
    data.channels = channel;
    data.ultra_restricted = 1;
    data.set_active = true;
  }

  request
  .post(`https://${org}.slack.com/api/users.admin.invite`)
  .type('form')
  .send(data)
  .end(function(err, res){
    if (err) { return fn(err); }
    if (200 != res.status) {
      fn(new Error(`Invalid response ${res.status}.`));
      return;
    }

    // If the account that owns the token is not admin, Slack will oddly
    // return `200 OK`, and provide other information in the body. So we
    // need to check for the correct account scope and call the callback
    // with an error if it's not high enough.
    let {ok, error: providedError, needed} = res.body;
    if (!ok) {
      if (providedError === 'missing_scope' && needed === 'admin') {
        fn(new Error(`Missing admin scope: The token you provided is for an account that is not an admin. You must provide a token from an admin account in order to invite users through the Slack API.`));
      } else if (providedError === 'already_invited') {
        fn(new Error(`"${email}" already has a pending invite to this team.`));
      } else if (providedError === 'already_in_team') {
        fn(new Error(`"${email}" is already a member of this team`));
      } else {
        fn(new Error(providedError));
      }
      return;
    }

    fn(null);
  });
}