import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return [
			{
				title: 'Afeefa',
				content: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. '
			},
			{
				title: 'Dresden für Alle',
				content: 'Nulla consequat massa quis enim.'
			},
			{
				title: 'Stadtteilbündnis Gruna',
				content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.'
			},
			{
				title: 'Stadtfest',
				content: 'Not much.'
			}
		];
	}
});
