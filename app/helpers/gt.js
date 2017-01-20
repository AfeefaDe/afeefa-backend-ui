import Ember from 'ember';

export const gt = (params) => params[0] > params[1];

export default Ember.Helper.helper(gt);
