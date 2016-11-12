import Ember from 'ember';

export default Ember.Component.extend({
  saving: false,
  attr: Ember.computed('model', function() {
    let model = this.get('model');
    var attributes = [];
    model.eachAttribute(function(name, meta) {
      let entry = {name: name, type: meta.type, hide: false};
      if(meta.options.hideInDetailView) entry.hide = true;
      attributes.push(entry);
    });
    return attributes;
  }),
  actions: {
    /*
     * change of entry status
     */
    setNewStateTransistion: function(newStateTransistion) {
      if(this.get('saving')===false) {
        this.set('saving', true);
        //get current model instance
        let ownInstance = this.get('model');
        //change status and save
        ownInstance.set('stateTransition', newStateTransistion);
        ownInstance.save().then(()=> {
          this.set('saving', false);
        });
      }
    }
  }
});
