import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  title:            DS.attr('string'),
  active:           DS.attr('boolean', {hideInDetailView: true}),
  description:      DS.attr('string'),
  createdAt:        DS.attr('date', {hideInDetailView: true}),
  updatedAt:        DS.attr('date'),
  stateChangedAt:   DS.attr('date'),
  category:         DS.belongsTo('category'),
  subCategory:      DS.belongsTo('category'),
  contactInfos:     DS.hasMany('contact-info'),
  annotations:      DS.hasMany('annotation'),
  locations:        DS.hasMany('location'),
  //using an alias for the modelName allows us to access the modelName in proxied objects from belongsTo relationships
  //used to navigate toSingle in entry-list-item.js
  modelName: Ember.computed.alias('constructor.modelName'),

  // hack attribute to get track of annotations inserts/removes
  // attribute is set to true manually in entry-from (addAnnotation, removeAnnotation)
  hasAnnotationChanges: false,

  didUpdate: function() {
    // reset annotation change marker on each save operation
    this.set('hasAnnotationChanges', false);
  }
});
