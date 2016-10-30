import DS from 'ember-data';
import entry from './entry';

export default entry.extend({
  title:          DS.attr('string'),
  state:          DS.attr('string'),
  stateTransition:DS.attr('string'),
  description:    DS.attr('string', {defaultValue: 'Description...'}),
  createdAt:      DS.attr('date'),
  updatedAt:      DS.attr('date'),
  stateChangedAt: DS.attr('date'),
  parentOrga:     DS.belongsTo('orga', {inverse: 'subOrgas'}),
  subOrgas:       DS.hasMany('orga', {inverse: 'parentOrga'}),
  category:       DS.attr('string')
});
