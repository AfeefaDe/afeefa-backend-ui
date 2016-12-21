import Ember from 'ember';

export function formatDateAbsolute(params/*, hash*/) {
  if(params && params[0]) {
    let date = params[0];
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    /*jshint newcap: false */
    return `${day}.${month}.${year}`;
  }
  else return params;
}

export default Ember.Helper.helper(formatDateAbsolute);
