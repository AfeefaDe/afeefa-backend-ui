import DS from 'ember-data';

export default DS.Model.extend({
  forename: DS.attr('string'),
  surname: DS.attr('string'),
  email: DS.attr('string'),
  orgas: DS.hasMany('orga', { async: true })
});
