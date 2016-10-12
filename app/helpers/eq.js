import Ember from 'ember';
/*
 * handlebar helper for value comparison
 */
const eq = (params) => params[0] === params[1];
export default Ember.Helper.helper(eq);
