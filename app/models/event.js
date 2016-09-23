import DS from 'ember-data';
import { belongsTo } from 'ember-data/relationships';

export default DS.Model.extend({
  title:        DS.attr('string'),
  description:  DS.attr('string'),
  created_at:   DS.attr('date'),
  updated_at:   DS.attr('date'),
  parent_id:    DS.belongsTo('orga')
});
