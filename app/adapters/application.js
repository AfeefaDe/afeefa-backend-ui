import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
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
    if(headers && headers['access-token']) console.log("Response sent new access-token: ", headers['access-token']);
    return this._super(...arguments);
  }
});
