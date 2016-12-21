import Ember from 'ember';

/*
 * helper to determine if a model as a single attribute
 * {{if model.state}} ist not working for boolean attributes
 * that means we have to test against undefined
 */
export function hasAttribute(attr) {
  if(attr[0] === undefined || attr[0] === null) return false;
  else return true;
}

export default Ember.Helper.helper(hasAttribute);
