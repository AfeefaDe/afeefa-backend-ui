import Ember from 'ember';

export function limitArray(params) {
  if(params.length===2) {
    let arr = params[0];
    let limit = params[1];
    if(limit && limit>0) return arr.slice(0, limit);
    else return arr;
  }
  else return params;
}

export default Ember.Helper.helper(limitArray);
