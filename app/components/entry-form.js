import Ember from 'ember';
import RSVP from 'rsvp';


export default Ember.Component.extend({
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

        diff.then(()=> {
          this.EventBus.publish('showAlert', {title: 'Erfolgreich gespeichert', description: 'Deine Änderungen wurden erfolgreich gespeichert', isError: false, autoHide: 2000});
          history.back();
        }, (reason)=> {
            this.EventBus.publish('showAlert', this.handleError(reason));
        });

      } else { //case new
        entry.save().then((savedEntry)=> {
          /*set contactable*/
          this.get('model.contactInfoInstance').set('contactable', savedEntry);
          this.get('model.locationInstance').set('locatable', savedEntry);
          this.get('model.annotationInstance').set('annotatable', savedEntry);
          const saveMeta = RSVP.hash({
            contact: this.get('model.contactInfoInstance').save(),
            location: this.get('model.locationInstance').save(),
            annotation: this.get('model.annotationInstance').save()
          });
          saveMeta.then(() => {
            this.EventBus.publish('showAlert', {title: 'Erfolgreich angelegt', description: 'Der Eintrag wurde erfolgreich angelegt', isError: false, autoHide: 2000});
            history.back();
          }, (reason)=> {
            this.EventBus.publish('showAlert', this.handleError(reason));
          })
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
        const alertData = {title: errorTitle, description: errorDetail, isError: true};
        return alertData;
      }
  }
});
