import Ember from 'ember';
let timeagoInstance = new timeago();

/*
 * handlebar helper to output date using timeago.js
 */
export function formatDate(params) {
  if(params && params[0]) {
    let date = params[0];
    return timeagoInstance.format(date);
  }
  else return params;
}

export default Ember.Helper.helper(formatDate);
