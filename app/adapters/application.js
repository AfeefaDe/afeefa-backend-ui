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
    console.log("[adapter] buildURL: "+url);
    return url;
  },
  updateRecord: function(store, type, snapshot) {
    //overwrite JSON API ADAPTER default for debugging purpose: https://github.com/emberjs/data/blob/v2.7.0/addon/adapters/json-api.js#L123
    var data = {};
    var serializer = store.serializerFor(type.modelName);

    serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

    var id = snapshot.id;
    var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');
    console.log('Update Record with URL: [PATCH]', url);
    console.log('Update Record with Data: ', data);
    return this.ajax(url, 'PATCH', { data: data });
  }
});
