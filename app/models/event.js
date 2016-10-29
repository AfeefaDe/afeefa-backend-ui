import DS from 'ember-data';

export default DS.Model.extend({
  title:        DS.attr('string'),
  state:          DS.attr('string'),
  description:  DS.attr('string'),
  created_at:   DS.attr('date'),
  updated_at:   DS.attr('date'),
  parent_id:    DS.belongsTo('orga')
});
