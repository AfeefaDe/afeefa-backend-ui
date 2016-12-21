import Ember from 'ember';

/*
 * handlebar helper to output date using timeago.js
 */
export function formatDateRelative(params) {
  if(params && params[0]) {
    let date = params[0];
    /*jshint newcap: false */
    let timeagoInstance = new timeago();
    return timeagoInstance.format(date);
  }
  else return params;
}

export default Ember.Helper.helper(formatDateRelative);
