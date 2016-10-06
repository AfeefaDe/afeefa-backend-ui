import Ember from 'ember';

import Devise from 'ember-simple-auth/authorizers/devise';

export default Devise.extend({
  tokenAttributeName: 'accessToken',
  identificationAttributeName: 'uid',

  authorize(data, header) {
    // probably unnecessary
    // this._super(data, header);
    const { tokenAttributeName, identificationAttributeName } = this.getProperties('tokenAttributeName', 'identificationAttributeName');
    const userToken          = data[tokenAttributeName];
    const userIdentification = data[identificationAttributeName];
    const userTokenType      = data['tokenType'];
    const userClient         = data['client'];
    const userExpire         = data['expiry'];
    if (!Ember.isEmpty(userToken) && !Ember.isEmpty(userIdentification)) {
      header('access-token', userToken);
      header('token-type', userTokenType);
      header('client', userClient);
      header('expiry', userExpire);
      header('uid', userIdentification);
    }
  }
});
