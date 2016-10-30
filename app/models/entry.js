import DS from 'ember-data';

export default DS.Model.extend({
  contactInfos:   DS.hasMany('contact-info'),
  annotations:    DS.hasMany('annotation'),
  locations:      DS.hasMany('location')
});
