import Ember from 'ember';
import RSVP from 'rsvp';


import RouteHelper from '../mixins/route-helper';


export default Ember.Component.extend(RouteHelper, {
  store: Ember.inject.service(),
  /* determine if the entryInstance has attribute model*/
  showDate: Ember.computed('model', function() {
    const entry = this.get('model.entryInstance');
    return entry.date || entry.date === null;
  }),
  didReceiveAttrs() {
    this._super(...arguments);
    /*
     * workaround to cut off time from date object and pass it into input[type="date"]
     * not proud at all :(
     */
    const date = this.get('model.entryInstance.date');
    if(date && date.getYear()) {
      const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      this.set('model.entryInstance.date', dateString);
    }
  },
	actions: {
    /*
     * Save Entry with meta models
     */
		save: function() {
      let entry = this.get('model.entryInstance');
      //case:edit
      if (entry.get('id')) {
        const save = entry.save();
        const annotations = entry.get('annotations').then((annotation) => {
          annotation.save();
        });
        const contactInfos = entry.get('contactInfos').then((contactInfo) => {
          contactInfo.save();
        });
        const locations = entry.get('locations').then((location) => {
          location.save();
        });

        const diff = RSVP.hash({
          save,
          annotations,
          contactInfos,
          locations,
        });

        diff.then(()=>{
          history.back();
        });
      } else { //case new
        entry.get('contactInfos').pushObject(this.get('model.contactInfoInstance'));
        entry.get('locations').pushObject(this.get('model.locationInstance'));
        entry.get('annotations').pushObject(this.get('model.annotationInstance'));
        entry.save().then((savedEntry)=> {
          console.log('Saved entry - the hacky way');
        }, (reason)=> {
            this.EventBus.publish('showAlert', this.handleError(reason));
          })
      }
		},
    /*
     * Input type select for setting parent orga
     */
    selectParent: function(parentOrgaID) {
      const entry = this.get('model.entryInstance');
      // @hack
      const orgaProp = entry.parentOrga || entry.parentOrga === null ? 'parentOrga' : 'orga';
      if(parentOrgaID === -1) {
          this.set(`model.entryInstance.${orgaProp}`, null);
      }
      else {
        let parentOrga = this.get('store').peekRecord('orga', parentOrgaID);
        this.set(`model.entryInstance.${orgaProp}`, parentOrga);
      }
    }
	},
  /*
   * function that creates the alertData object
   * @todo: I want to call this.EventBus.publish('showAlert',...)from here. But this is undefined!
   */
  handleError(reason) {
      if(reason && reason.errors) {
        const errorTitle = "Fehler beim Speichern";
        let errorDetail = '';
        for (var singleError of reason.errors) {
          errorDetail = errorDetail + ' ' + singleError.detail + '\n';
        }
        const alertData = {title: errorTitle, description: errorDetail, isError: true, autoHide: false};
        return alertData;
      }
  }
});
