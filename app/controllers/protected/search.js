import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  actions: {
    search: function() {
      let searchTerm = this.get('term');
      this.set('status', 'Loading...');
      this.get('store').query('entry', {filter: {title: searchTerm}, include: 'annotations'}).then((result)=> {
        const length = result.get('length');
        if(length===0) this.set('status', '0 Ergebnisse');
        else this.set('status', null);

        this.set('searchResult', result);
      });
    }
  }
});
