import DS from 'ember-data';
import entry from './entry';

export default entry.extend({
  title:        DS.attr('string'),
  state:        DS.attr('string'),
  description:  DS.attr('string'),
  created_at:   DS.attr('date'),
  updated_at:   DS.attr('date'),
  stateChangedAt: DS.attr('date'),
  parent_id:    DS.belongsTo('orga'),
  category:     DS.attr('string')
});
