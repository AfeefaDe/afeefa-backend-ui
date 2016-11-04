import DeviseAuthenticator from 'ember-simple-auth/authenticators/devise';
import Ember from 'ember';
import ENV from 'afeefa-backend-ui/config/environment';
const { RSVP, isEmpty, run } = Ember;

export default DeviseAuthenticator.extend({
  serverTokenEndpoint: ENV.APP.API_HOST+'/api/v1/users/sign_in',
  restore(data){
    return new RSVP.Promise((resolve, reject) => {
      if (!isEmpty(data.accessToken) && !isEmpty(data.expiry) &&
          !isEmpty(data.tokenType) && !isEmpty(data.uid) && !isEmpty(data.client)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },
  authenticate(identification, password) {
    return new RSVP.Promise((resolve, reject) => {
      const { identificationAttributeName } = this.getProperties('identificationAttributeName');
      const data         = { password };
      data[identificationAttributeName] = identification;

      this.makeRequest(data).then(function(response, status, xhr) {
        //save the five headers needed to send to devise-token-auth
        //when making an authorized API call
        var result = {
          accessToken: xhr.getResponseHeader('access-token'),
          expiry: xhr.getResponseHeader('expiry'),
          tokenType: xhr.getResponseHeader('token-type'),
          uid: xhr.getResponseHeader('uid'),
          client: xhr.getResponseHeader('client'),
          id: xhr.responseJSON.data.id
        };
        run(null, resolve, result);
      }, function(xhr) {
        run(null, reject, xhr.responseJSON || xhr.responseText);
      });
    });
  },
});
