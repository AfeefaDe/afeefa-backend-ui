import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
  //@question better to make this a subroute of /orgas and simply filter the model
  console.log("Edit id: ", params.event_id);
    return this.get('store').findRecord('event', params.event_id);
  },
});
