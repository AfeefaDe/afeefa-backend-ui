import DS from 'ember-data';

export default DS.Model.extend({
  mail:        DS.attr('string'),
  phone:        DS.attr('string'),
  contactPerson: DS.attr('string')
});
