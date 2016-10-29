import DS from 'ember-data';

export default DS.Model.extend({
  lat:        DS.attr('string'),
  lon:        DS.attr('string'),
  street:     DS.attr('string'),
  number:     DS.attr('string'),
  addition:   DS.attr('string'),
  zip:        DS.attr('string'),
  city:       DS.attr('string'),
  district:   DS.attr('string'),
  state:      DS.attr('string'),
  country:    DS.attr('string'),
  displayed:  DS.attr('boolean'),
  createdAt:  DS.attr('date'),
  updatedAt:  DS.attr('date')
});
