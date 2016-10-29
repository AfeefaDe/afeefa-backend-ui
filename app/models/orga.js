import DS from 'ember-data';

export default DS.Model.extend({
  title:          DS.attr('string'),
  state:          DS.attr('string'),
  description:    DS.attr('string', {defaultValue: 'Description...'}),
  createdAt:      DS.attr('date'),
  updatedAt:      DS.attr('date'),
  stateChangedAt: DS.attr('date'),
  parentOrga:     DS.belongsTo('orga', {inverse: 'subOrgas'}),
  subOrgas:       DS.hasMany('orga', {inverse: 'parentOrga'}),
  category:       DS.attr('string'),
  contactInfos:   DS.hasMany('contact-info'),
  annotations:    DS.hasMany('annotation'),
  locations:      DS.hasMany('location'),
});
