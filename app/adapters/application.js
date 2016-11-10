import Ember from 'ember';
import ENV from 'afeefa-backend-ui/config/environment';
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  session: Ember.inject.service('session'),
	namespace: 'api/v1',
  host: ENV.APP.API_HOST,
	authorizer: 'authorizer:devise',
  /*
   * Debug helper: print URL for every API requst running through this adapter
   */
  buildURL: function() {
    let url = this._super(...arguments);
    console.log("make API request to: "+url);
    return url;
  },
  pathForType(modelName) {
    let underscore = Ember.String.underscore(modelName);
    return Ember.String.pluralize(underscore);
  },
  urlForRequest(params) {
    let url = this._super(...arguments);
    return url;
  },
  handleResponse: function(status, headers, payload, requestData) {
    //new token from API is present: update session
    if(headers && headers['access-token'] && headers['expiry'] && headers['client']) {
      this.get('session').set('data.authenticated.accessToken', headers['access-token']);
      this.get('session').set('data.authenticated.expiry', headers['expiry']);
      this.get('session').set('data.authenticated.client', headers['client']);
      this.get('session').set('data.foo', 'bar'); //Hack from: https://github.com/simplabs/ember-simple-auth/issues/926
    }
    return this._super(...arguments);
  }
});
