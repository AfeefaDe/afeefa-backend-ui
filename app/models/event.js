import DS from 'ember-data';
import entry from './entry';

export default entry.extend({
  date:   DS.attr('date'),
  orga:   DS.belongsTo('orga'),
  /*this computed property allows us to access the parent of events and orgas with .parentOrga*/
  parentOrga: Ember.computed('orga', function() {
    return this.get('orga');
  })
});
