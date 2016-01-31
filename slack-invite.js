// This file is adapted from https://github.com/rauchg/slackin/blob/master/lib/slack-invite.js
import request from 'request-promise';

export function lookupUser({ org, token, user_id }) {

  const form = { user: user_id, token };

  return request
    .post(`https://${org}.slack.com/api/users.info`, { form, json: true })
    .then(res => {
      const { ok, error, user } = res;

      if (!ok) {
        throw new Error(error);
      }

      return user;
    });
}

export function invite({ org, token, email, channel, message }) {
  let form = { email, token };

  if (message) {
    form.extra_message = message;
  }

  if (channel) {
    form.channels = channel;
    form.ultra_restricted = 1;
    form.set_active = true;
  }

  return request
    .post(`https://${org}.slack.com/api/users.admin.invite`, { form, json: true })
    .then(res => {
      // If the account that owns the token is not admin, Slack will oddly
      // return `200 OK`, and provide other information in the body. So we
      // need to check for the correct account scope and call the callback
      // with an error if it's not high enough.
      let {ok, error, needed} = res;
      if (!ok) {
        if (error === 'missing_scope' && needed === 'admin') {
          throw new Error(`Missing admin scope: The token you provided is for an account that is not an admin. You must provide a token from an admin account in order to invite users through the Slack API.`);
        } else if (error === 'already_invited') {
          throw new Error(`"${email}" already has a pending invite to this team.`);
        } else if (error === 'already_in_team') {
          throw new Error(`"${email}" is already a member of this team`);
        } else {
          throw new Error(error);
        }
      }
    });
}