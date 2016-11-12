import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  title:            DS.attr('string'),
  state:            DS.attr('string', {hideInDetailView: true}),
  stateTransition:  DS.attr('string', {hideInDetailView: true}),
  description:      DS.attr('string'),
  createdAt:        DS.attr('date', {hideInDetailView: true}),
  updatedAt:        DS.attr('date'),
  stateChangedAt:   DS.attr('date'),
  category:         DS.attr('string'),
  contactInfos:     DS.hasMany('contact-info'),
  annotations:      DS.hasMany('annotation'),
  locations:        DS.hasMany('location'),
  //using an alias for the modelName allows us to access the modelName in proxied objects from belongsTo relationships
  //used to navigate toSingle in entry-list-item.js
  modelName: Ember.computed.alias('constructor.modelName')
});
