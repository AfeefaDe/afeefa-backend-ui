import Ember from 'ember';
import DS from 'ember-data';
import entry from './entry';

export default entry.extend({
  date_start: DS.attr('date', {
    defaultValue() {
      var dateStart = new Date();
      dateStart.setHours(0);
      dateStart.setMinutes(0);
      dateStart.setSeconds(0);
      return dateStart;
    }
  }),
  date_end: DS.attr('date', {
    defaultValue() {
      return null;
    }
  }),
  // date_end:       DS.attr('date', {de: 'Datum'}),
  has_time_start: DS.attr('boolean', {hideInDetailView: true}),
  has_time_end:   DS.attr('boolean', {hideInDetailView: true}),
  orga:           DS.belongsTo('orga'),
  parentOrga:     Ember.computed.alias('orga'),
  /*this computed property allows us to access the parent of events and orgas with .parentOrga
  parentOrga: Ember.computed('orga', function() {
    return this.get('orga');
  })*/
});
