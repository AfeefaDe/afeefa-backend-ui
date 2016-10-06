import Ember from 'ember';


export default Ember.Route.extend({
  model(params) {
  //@question better to make this a subroute of /orgas and simply filter the model
    return this.get('store').findRecord('orga', params.orga_id);
  },
});
