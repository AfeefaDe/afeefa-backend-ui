import DS from 'ember-data';
import entry from './entry';

export default entry.extend({
  parentOrga:     DS.belongsTo('orga', {inverse: 'subOrgas'}),
  subOrgas:       DS.hasMany('orga', {inverse: 'parentOrga'})
});
