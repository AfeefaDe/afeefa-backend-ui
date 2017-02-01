import DS from 'ember-data';

export default DS.Model.extend({
  title:          DS.attr('string'),
  type:           DS.attr('string'),
  parentCategory: DS.belongsTo('category')
});
