import Ember from 'ember';

export default Ember.Component.extend({
  /*default sort order*/
  sortOrder: 'title',
  instances: null,
  sortedInstances: Ember.computed.sort('instances', 'sortDefinition'),
  sortDefinition: Ember.computed('sortOrder', function() {
    return [ this.get('sortOrder') ];
  }),
});
