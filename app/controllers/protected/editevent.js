import Ember from 'ember';
import RouteHelper from '../../mixins/route-helper';

export default Ember.Controller.extend(RouteHelper, {
  titleCached: Ember.computed('model', function() {
    return this.get('model.entryInstance.title');
  })
});
