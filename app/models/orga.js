import DS from 'ember-data';

export default DS.Model.extend({
  title:          DS.attr('string'),
  state:          DS.attr('string'),
  description:    DS.attr('string', {defaultValue: 'Description...'}),
  users:          DS.hasMany('user', { async: true }),
  createdAt:      DS.attr('date'),
  updatedAt:      DS.attr('date'),
  parentOrga:     DS.belongsTo('orga'),
  subOrgas:       DS.hasMany('orga', {inverse: 'parentOrga', async: true}),
  category:       DS.attr('string')
});
