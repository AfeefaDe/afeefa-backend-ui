import JSONAPIAdapter from 'ember-data/adapters/json-api';

export default JSONAPIAdapter.extend({
	host: 'http://api.afeefa.fx',
	namespace: 'api/v1	'
});