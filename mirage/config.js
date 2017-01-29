export default function() {

  this.patch('/api/v1/events/1', (/*schema, request*/) => {
    // var body = JSON.parse(request.requestBody).data;
    return {
       "data":{
          "id":"1",
          "type":"events",
          "attributes":{
             "title": 'title from server',
          },
          "relationships":{
             "annotations":{
                "data":[
                   {
                     "id":"1",
                     "type":"annotations"
                   }
                ]
             },
             "locations":{
                "data":[
                   {
                     "id":"1",
                      "type":"locations",
                      "attributes":{
                        "city": "city from server"
                      },
                   }
                ]
             },
             "contact_infos":{
                "data":[
                   {
                     "id":"1",
                      "type":"contact_infos",
                      "attributes":{
                        "contact_person": 'person from server',
                      },
                   }
                ]
             }
          }
       }
    };
  });
}
