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
    this.route('orgas');
    this.route('orga', { path: '/orgas/:orga_id' });
    this.route('editorga', { path: '/orgas/:orga_id/edit' });
    this.route('neworga', { path: '/orgas/new' });
    /*
    * Event Routes
    */
    this.route('events');
    this.route('event', { path: '/events/:event_id'});
    this.route('editevent', { path: '/events/:event_id/edit'});
    this.route('newevent', { path: '/events/new'});

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
