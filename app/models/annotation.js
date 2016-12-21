import DS from 'ember-data';

export default DS.Model.extend({
  title:       DS.attr('string'),
  createdAt:   DS.attr('date', {hideInDetailView: true}),
  updatedAt:   DS.attr('date'),
});
