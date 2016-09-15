import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  queryParams: ['type'],
    //default orga
    type: "orga",
    outputType: Ember.computed('type', function(){
      if(this.get('type')==="orga") {
        return "Orga";
      }
      if(this.get('type')==="user") {
        return "User";
      }
      return "undefined";
    }),
    //ugly; better solution ?????
    isOrga: Ember.computed('type', function(){
      if(this.get('type')==='orga') return true;
      return false;
    }),
    actions: {
      create: function(orgaObject) {
        //Append Orga to Afeefa
        /*
        let parentOrga = this.get('store').peekRecord('orga', 1);
        let subOrga = this.get('store').createRecord('orga', {
          title: 'Test',
          description: 'Testbeschreibung',
          parentOrga: parentOrga
        });
        subOrga.save().catch((err)=>{console.log(err);});
        */
        this.get('store').findRecord('orga', 1).then(function(orga) {
          orga.get('title'); // => "Rails is Omakase"
          orga.set('title', 'A new Title for Afeefae');
          orga.save(); // => PATCH to '/posts/1'
        });
      }
    }
});
