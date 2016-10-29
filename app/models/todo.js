import DS from 'ember-data';

export default DS.Model.extend({
  orgas:    DS.hasMany('orga'),
  events:   DS.hasMany('event')
});
