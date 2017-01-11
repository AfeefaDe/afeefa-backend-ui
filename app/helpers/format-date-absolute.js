import Ember from 'ember';

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

export function formatDateAbsolute(params/*, hash*/) {
  if(params && params[0]) {
    let date = params[0];
    var month = addZero(date.getMonth() + 1);
    var day = addZero(date.getDate());
    var year = date.getFullYear();
    const hour = addZero(date.getHours());
    const minutes = addZero(date.getMinutes());
    /*jshint newcap: false */
    return `${day}.${month}.${year} um ${hour}:${minutes} Uhr`;
  }
  else return params;
}

export default Ember.Helper.helper(formatDateAbsolute);
