export default function() {
  // this.namespace = 'api/v1';

  this.patch('/api/v1/events/1', (/*schema, request*/) => {
    return {
       "data":{
          "id":"1",
          "type":"events",
          "attributes":{
             "title":"Fahrradkurs für Migrantinnens",
          },
          "relationships":{
             "annotations":{
                "data":[
                   {
                      "type":"annotations",
                      "id":"1"
                   }
                ]
             },
             "locations":{
                "data":[
                   {
                      "type":"locations",
                      "id":"1"
                   }
                ]
             },
             "contact_infos":{
                "data":[
                   {
                      "type":"contact_infos",
                      "id":"1"
                   }
                ]
             }
          }
       }
    };
  });


  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.2.x/shorthands/
  */
}
