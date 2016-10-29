import Ember from 'ember';

export function add(params) {
  if(params.length==2) return params[0]+params[1];
  else return params;
}
export default Ember.Helper.helper(add);
