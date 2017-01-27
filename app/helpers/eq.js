import Ember from 'ember';
/*
 * handlebar helper for value comparison
 */
export const eq = (params) => params[0] === params[1];

export default Ember.Helper.helper(eq);
