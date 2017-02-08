import Ember from 'ember';

/*
 * helper to determine if a model has a single attribute
 * {{if model.state}} ist not working for boolean attributes
 * that means we have to test against undefined
 */
export function hasAttribute(attr) {
  if(attr[0] === undefined || attr[0] === null) return false;
  else return true;
}

/*
 * helper to determine if a model defines a single attribute.
 * cannot be used in handlebars right now :-)
 */
export function definesAttribute(model, attr) {
  let defines = false;
  model.eachAttribute(definedAttr => {
    if (attr === definedAttr) {
      defines = true;
    }
  });
  return defines;
}

export default Ember.Helper.helper(hasAttribute);
