import DS from 'ember-data';

export default DS.Model.extend({
  title:       DS.attr('string'),
  createdAt:   DS.attr('date'),
  updatedAt:   DS.attr('date'),
  annotatable: DS.belongsTo('entry', {polymorphic: true})
});
