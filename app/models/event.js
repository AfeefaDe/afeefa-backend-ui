import DS from 'ember-data';
import entry from './entry';

export default entry.extend({
  date_start:     DS.attr('date', {de: 'Datum'}),
  date_end:       DS.attr('date', {de: 'Datum'}),
  has_time_start: DS.attr('boolean'),
  has_time_end:   DS.attr('boolean'),
  orga:           DS.belongsTo('orga'),
  parentOrga:     Ember.computed.alias('orga'),
  /*this computed property allows us to access the parent of events and orgas with .parentOrga
  parentOrga: Ember.computed('orga', function() {
    return this.get('orga');
  })*/
});
