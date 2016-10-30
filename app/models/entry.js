import DS from 'ember-data';

export default DS.Model.extend({
  title:            DS.attr('string'),
  state:            DS.attr('string'),
  stateTransition:  DS.attr('string'),
  description:      DS.attr('string'),
  createdAt:        DS.attr('date'),
  updatedAt:        DS.attr('date'),
  stateChangedAt:   DS.attr('date'),
  category:         DS.attr('string'),
  contactInfos:     DS.hasMany('contact-info'),
  annotations:      DS.hasMany('annotation'),
  locations:        DS.hasMany('location')
});
