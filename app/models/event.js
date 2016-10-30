import DS from 'ember-data';
import entry from './entry';

export default entry.extend({
  title:              DS.attr('string'),
  description:        DS.attr('string'),
  category:           DS.attr('string'),
  state:              DS.attr('string'),
  stateTransition:    DS.attr('string'),
  stateChangedAt:     DS.attr('date'),
  created_at:         DS.attr('date'),
  updated_at:         DS.attr('date'),
  date:               DS.attr('date'),
  orga:               DS.belongsTo('orga')
});
