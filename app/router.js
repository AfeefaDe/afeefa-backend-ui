import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  /*
   * Main Routes
   */
  this.route('dashboard', {path: '/'});
  this.route('login');
  this.route('logout');
  this.route('search');
  this.route('todos');
  /*
   * Orga Routes
   */
  this.route('orgas');
  this.route('orga', { path: '/orgas/:orga_id' });
  this.route('editorga', { path: '/orgas/:orga_id/edit' });
  this.route('neworga', { path: '/orgas/new' });

});

export default Router;
