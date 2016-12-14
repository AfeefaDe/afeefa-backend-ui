import DS from 'ember-data';

export default DS.Model.extend({
  title:          DS.attr('string'),
  type:           DS.attr('string'),
  isSubCategory:  DS.attr('boolean')
});
