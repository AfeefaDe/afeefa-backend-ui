import Ember from 'ember';

export default Ember.Component.extend({

	actions: {
		loadItem: function(entryItem) {
		  alert("load view to work on " + entryItem.title);
		},

		loadOptionsMenu: function(entryItem) {
		  alert("load options menu for " + entryItem.title);
		}
	}

});
