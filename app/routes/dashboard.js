import Ember from 'ember';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
//import SessionService from 'ember-simple-auth/services/session';

//export default Ember.Route.extend(AuthenticatedRouteMixin);

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	//session: Ember.inject.service('session'),
//	session: Ember.inject.service(),

	// model() {
	// 	return [
	// 		{
	// 			title: 'Afeefa',
	// 			content: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. '
	// 		},
	// 		{
	// 			title: 'Dresden für Alle',
	// 			content: 'Nulla consequat massa quis enim.'
	// 		},
	// 		{
	// 			title: 'Stadtteilbündnis Gruna',
	// 			content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.'
	// 		},
	// 		{
	// 			title: 'Stadtfest',
	// 			content: 'Not much.'
	// 		},
	// 		{
	// 			title: 'Interaction Leipzig e.V.',
	// 			content: '2 neue Events.'
	// 		},
	// 		{
	// 			title: 'CABANA Migrationsberatung',
	// 			content: '3 neue Anfragen und 1 neues Event'
	// 		}
	// 	];
	// },

	model() {
		return this.store.findAll('orga');
	},

	actions: {
		logout() {
			this.get('session').invalidate();
		}
	}

	/*didInsertElement : function(){
    var that = this;
    Ember.run.next(function(){
		var pattern = new Trianglify({
	        width: window.innerWidth,
	        height: window.innerHeight
	    });
	    alert('hallo');
	    document.body.appendChild(pattern.canvas());
        // that.$('.navbar').affix({offset: -1000});
    });
  }*/
});
