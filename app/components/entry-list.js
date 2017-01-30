import Ember from 'ember';
import PaginatedListMixin from 'afeefa-backend-ui/mixins/paginated-list';

export default Ember.Component.extend(PaginatedListMixin, {
  /*default sort order*/
  sortOrder: 'title',
  instances: null,

  sortedInstances: Ember.computed.sort('instances', 'sortDefinition'),

  sortDefinition: Ember.computed('sortOrder', function() {
    return [ this.get('sortOrder') ];
  }),

  // paginated list properties
  pageSize: 5,

  getAllItems () {
    return this.get('sortedInstances');
  }
});
