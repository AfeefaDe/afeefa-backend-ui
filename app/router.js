import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  /*
   * Main Routes
   */
  this.route('login');
  this.route('logout');

  this.route('protected', {path: '/'}, function() {
    this.route('dashboard', {path: '/'});
    this.route('search');
    this.route('todos');
    /*
    * Orga Routes
    */
    this.route('orgas', {path: '/orgas'}, function() {
      this.route('list', {path: '/'});
      this.route('show', { path: '/:orga_id' });
      this.route('edit', { path: '/:orga_id/edit' });
      this.route('new', { path: '/new' });
    });
    /*
    * Event Routes
    */
    this.route('events', {path: '/events'}, function() {
      this.route('list', {path: '/'});
      this.route('show', { path: '/:event_id' });
      this.route('edit', { path: '/:event_id/edit' });
      this.route('new', { path: '/new' });
    });

    /*
    * User Routes
    */
    this.route('user', { path: '/user/:user_id'});

    /*
     * catch undefined routes
     */
    this.route('undefined', { path: '*path'});
  });
});

export default Router;
