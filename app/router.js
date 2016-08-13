import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('dashboard', function() {});
  this.route('pingpong');
  this.route('login');
  this.route('logout');
  this.route('new');
  this.route('orgas');
  this.route('orga',{ path: '/orgas/:orga_id' });
});

export default Router;
