import DS from 'ember-data';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default DS.Model.extend({
  title:        DS.attr('string'),
  description:  DS.attr('string', {defaultValue: 'Description...'}),
  users:        DS.hasMany('user', { async: true }),
  created_at:   DS.attr('date'),
  updated_at:   DS.attr('date'),
  parentOrga:   DS.belongsTo('orga')
});
