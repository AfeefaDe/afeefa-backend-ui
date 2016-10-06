import DS from 'ember-data';

export default DS.Model.extend({
  orgas:    DS.hasMany('orga', { async: true }),
  events:   DS.hasMany('event', { async: true })
});
