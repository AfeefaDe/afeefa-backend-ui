import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  session: Ember.inject.service('session'),
	namespace: 'api/v1',
	authorizer: 'authorizer:devise',
  /*
   * Debug helper: print URL for every API requst running through this adapter
   */
  buildURL: function(modelName, id, snapshot, requestType, query) {
    let url = this._super(...arguments);
    console.log("make API request to: "+url);
    return url;
  },
  handleResponse: function(status, headers, payload, requestData) {
    console.log("[raw response]: ", payload);
    //new token from API is present: update session
    if(headers && headers['access-token']) {
      this.get('session').set('data.authenticated.accessToken', headers['access-token']);
      this.get('session').set('data.authenticated.expiry', headers['expiry']);
      this.get('session').set('data.authenticated.client', headers['client']);
    }
    return this._super(...arguments);
  }
});
