import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  forename: attr('string'),
  surname: attr('string'),
  email: attr('string'),
  orgas: hasMany('orga', { async: true })
});
