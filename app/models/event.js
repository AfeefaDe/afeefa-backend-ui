import DS from 'ember-data';
import entry from './entry';

export default entry.extend({
  date:   DS.attr('date'),
  orga:   DS.belongsTo('orga')
});
