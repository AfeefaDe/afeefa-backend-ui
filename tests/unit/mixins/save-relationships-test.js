import Ember from 'ember';
import QUnit from 'qunit';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import DS from 'ember-data';
import SaveRelationshipsMixin from 'afeefa-backend-ui/mixins/save-relationships';

let owner, store;

QUnit.dump.maxDepth = 2;

function getInternalId(model) {
  return model.get('_internalModel')[Ember.GUID_KEY];
}

function createRecord(type, attr, id) {
  if (id) {
    attr.id = id;
  }
  return store.createRecord(type, attr);
}

moduleFor('mixin:save-relationships', 'Unit | Mixin | save relationships', {

  beforeEach() {
    owner = Ember.getOwner(this);
    store = owner.lookup('service:store');

    // define models

    owner.register('model:artist', DS.Model.extend({
      name: DS.attr('string'),
      numAwards: DS.attr('number'),
      label: DS.belongsTo('label'),
      albums: DS.hasMany('album')
    }));

    owner.register('model:album', DS.Model.extend({
      title: DS.attr('string'),
      numTracks: DS.attr('number'),
      artist: DS.belongsTo('artist')
    }));

    owner.register('model:label', DS.Model.extend({
      name: DS.attr('string'),
      city: DS.attr('string'),
      artists: DS.hasMany('artist')
    }));

    // define serializers
    owner.register('serializer:artist', DS.JSONAPISerializer.extend(SaveRelationshipsMixin, {
      attrs: {
        albums: { serialize: true },
        label: { serialize: true }
      }
    }));

  },

  afterEach() {
    Ember.run(store, 'destroy');
  }

});


test("serialize artist with missing relations", function(assert) {
  Ember.run(function() {
    const artist = createRecord('artist', { name: 'Radiohead' });

    const serializer = store.serializerFor("artist");
    const artistJSON = serializer.serialize(artist._createSnapshot());

    assert.deepEqual(artistJSON, {
      data: {
        type: 'artists',
        attributes: {
          name: 'Radiohead',
          'num-awards': null
        },
        relationships: {
          albums: {
            data: []
          },
          label: {
            data: null
          }
        },
      }
    });
  });
});


test("serialize artist with new albums and label", function(assert) {
  Ember.run(function() {
    const artist = createRecord('artist', { name: 'Radiohead' });
    const album1 = createRecord('album', { title: 'Amnesiac' });
    const album2 = createRecord('album', { title: 'The King of Limbs' });
    const label = createRecord('label', { name: 'Capitol Records', city: 'Hollywood' });
    artist.get('albums').pushObjects([album1, album2]);
    artist.set('label', label);

    const serializer = store.serializerFor("artist");
    const artistJSON = serializer.serialize(artist._createSnapshot());

    assert.deepEqual(artistJSON, {
      data: {
        type: 'artists',
        attributes: {
          name: 'Radiohead',
          'num-awards': null
        },
        relationships: {
          albums: {
            data: [
              {
                type: 'albums',
                attributes: {
                  __id__: getInternalId(album1),
                  title: 'Amnesiac',
                  'num-tracks': null
                }
              },
              {
                type: 'albums',
                attributes: {
                  __id__: getInternalId(album2),
                  title: 'The King of Limbs',
                  'num-tracks': null
                }
              }
            ]
          },
          label: {
            data: {
              type: 'labels',
              attributes: {
                __id__: getInternalId(label),
                name: 'Capitol Records',
                city: 'Hollywood'
              }
            }
          }
        },
      }
    });
  });
});


test("serialize artist with existing albums and label", function(assert) {
  Ember.run(function() {
    const artist = createRecord('artist', { name: 'Radiohead' });
    const album1 = createRecord('album', { title: 'Amnesiac' }, 1);
    const album2 = createRecord('album', { title: 'The King of Limbs' }, 2);
    const label = createRecord('label', { name: 'Capitol Records' }, 1);
    artist.get('albums').pushObjects([album1, album2]);
    artist.set('label', label);

    const serializer = store.serializerFor("artist");
    const artistJSON = serializer.serialize(artist._createSnapshot());

    assert.deepEqual(artistJSON, {
      data: {
        type: 'artists',
        attributes: {
          name: 'Radiohead',
          'num-awards': null
        },
        relationships: {
          albums: {
            data: [
              {
                id: '1',
                type: 'albums',
                attributes: {
                  title: 'Amnesiac',
                  'num-tracks': null
                }
              },
              {
                id: '2',
                type: 'albums',
                attributes: {
                  title: 'The King of Limbs',
                  'num-tracks': null
                }
              }
            ]
          },
          label: {
            data: {
              id: '1',
              type: 'labels',
              attributes: {
                name: 'Capitol Records',
                city: null
              }
            }
          }
        },
      }
    });
  });
});


test("serialize artist with existing and new albums", function(assert) {
  Ember.run(function() {
    const artist = createRecord('artist', { name: 'Radiohead' });
    const album1 = createRecord('album', { title: 'Amnesiac', numTracks: 10 }, 1);
    const album2 = createRecord('album', { title: 'The King of Limbs' });
    artist.get('albums').pushObjects([album1, album2]);

    const serializer = store.serializerFor("artist");
    const artistJSON = serializer.serialize(artist._createSnapshot());

    assert.deepEqual(artistJSON, {
      data: {
        type: 'artists',
        attributes: {
          name: 'Radiohead',
          'num-awards': null
        },
        relationships: {
          albums: {
            data: [
              {
                id: '1',
                type: 'albums',
                attributes: {
                  title: 'Amnesiac',
                  'num-tracks': 10
                }
              },
              {
                type: 'albums',
                attributes: {
                  __id__: getInternalId(album2),
                  title: 'The King of Limbs',
                  'num-tracks': null
                }
              }
            ]
          },
          label: {
            data: null
          }
        },
      }
    });
  });
});


test("serialize relationship with no attributes", function(assert) {
  owner.register('model:simple-model', DS.Model.extend({}));

  owner.register('model:simple-model-container', DS.Model.extend({
    model: DS.belongsTo('simple-model'),
  }));

  owner.register('serializer:simple-model-container', DS.JSONAPISerializer.extend(SaveRelationshipsMixin, {
    attrs: {
      model: { serialize: true }
    }
  }));

  Ember.run(function() {
    const model = store.createRecord('simple-model');
    const container = store.createRecord('simple-model-container');
    container.set('model', model);

    const serializer = store.serializerFor("simple-model-container");
    const simpleModelContainerJSON = serializer.serialize(container._createSnapshot());

    assert.deepEqual(simpleModelContainerJSON, { data: {
      type: 'simple-model-containers',
      relationships: {
        model: {
          data: {
            type: 'simple-models',
            attributes: {
              __id__: getInternalId(model)
            }
          }
        }
      }
    }});
  });
});


test("serialize artist with label wich has many artists", function(assert) {
  Ember.run(function() {
    const artist = createRecord('artist', { name: 'Radiohead' }, 1);
    const artist2 = createRecord('artist', { name: 'Kylie Minogue' }, 2);
    const label = createRecord('label', { name: 'Capitol Records' }, 1);
    artist.set('label', label);
    artist2.set('label', label);

    assert.equal(label.get('artists.length'), 2);

    const serializer = store.serializerFor("artist");
    const artistJSON = serializer.serialize(artist._createSnapshot());

    assert.deepEqual(artistJSON, {
      data: {
        type: 'artists',
        attributes: {
          name: 'Radiohead',
          'num-awards': null
        },
        relationships: {
          albums: {
            data: []
          },
          label: {
            data: {
              id: '1',
              type: 'labels',
              attributes: {
                name: 'Capitol Records',
                city: null
              }
            }
          }
        },
      }
    });
  });
});


test("serialize artist with relation to another artist", function(assert) {
  Ember.run(function() {
    owner.register('model:artist', DS.Model.extend({
      name: DS.attr('string'),
      albums: DS.hasMany('album'),
      partners: DS.hasMany('artist', { inverse: 'partners' })
    }));

    const artist = createRecord('artist', { name: 'Radiohead' }, 1);
    const album1 = createRecord('album', { title: 'Amnesiac', numTracks: 2 }, 1);
    const artist2 = createRecord('artist', { name: 'Kylie Minogue' }, 2);
    artist.get('albums').pushObject(album1);
    artist.get('partners').pushObject(artist2);

    assert.equal(artist.get('partners.length'), 1);

    const serializer = store.serializerFor("artist");
    const artistJSON = serializer.serialize(artist._createSnapshot());

    assert.deepEqual(artistJSON, {
      data: {
        type: 'artists',
        attributes: {
          name: 'Radiohead'
        },
        relationships: {
          albums: {
            data: [
              {
                id: '1',
                type: 'albums',
                attributes: {
                  title: 'Amnesiac',
                  'num-tracks': 2
                }
              }
            ]
          },
          partners: {
            data: [
              {
                id: '2',
                type: 'artists'
              }
            ]
          }
        }
      }
    });
  });
});


test("normalize artist with missing relations", function(assert) {
  Ember.run(function() {
    let artist = createRecord('artist', { name: 'Radiohead' });

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: '1',
        type: 'artists',
        attributes: {
          name: 'Radiohead'
        },
        relationships: {
          albums: {
            data: []
          },
          label: {}
        }
      }
    };

    serializer.normalizeResponse(store, artist, serverJSON, '1', 'createRecord');

    assert.equal(store.peekAll('album').get('length'), 0);
    assert.equal(store.peekAll('label').get('length'), 0);
  });
});


test("normalize artist with new album", function(assert) {
  Ember.run(function() {
    let artist = createRecord('artist', { name: 'Radiohead' });
    let album1 = createRecord('album', { title: 'Amnesiac', numTracks: 10 });
    artist.get('albums').pushObject(album1);

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: '1',
        type: 'artists',
        attributes: {
          name: 'Radiohead'
        },
        relationships: {
          albums: {
            data: [
              {
                id: "89329",
                type: 'albums',
                attributes: {
                  name: "Amnesiac",
                  __id__: getInternalId(album1)
                }
              }
            ]
          }
        }
      }
    };

    assert.deepEqual(Object.keys(album1.changedAttributes()), ['title', 'numTracks']);

    serializer.normalizeResponse(store, artist, serverJSON, '1', 'createRecord');

    assert.equal(store.peekAll('album').get('length'), 1);
    album1 = store.peekAll('album').findBy("title", "Amnesiac");
    assert.deepEqual(Object.keys(album1.changedAttributes()), []);
    assert.equal(album1.get('currentState.stateName'), "root.loaded.saved");
    assert.equal(album1.get('id'), "89329");
  });
});


test("normalize artist with new label", function(assert) {
  Ember.run(function() {
    let artist = createRecord('artist', { name: 'Radiohead' });
    let label = createRecord('label', { name: 'Cool Music Label' });
    artist.set('label', label);

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: '1',
        type: 'artists',
        attributes: {
          name: 'Radiohead'
        },
        relationships: {
          label: {
            data: {
              id: "4444",
              type: 'labels',
              attributes: {
                name: "Cool Music Label",
                city: 'Dortmund',
                __id__: getInternalId(label)
              }
            }
          }
        }
      }
    };

    assert.deepEqual(Object.keys(label.changedAttributes()), ['name']);
    assert.equal(label.get('currentState.stateName'), "root.loaded.created.uncommitted");

    serializer.normalizeResponse(store, artist, serverJSON, '1', 'createRecord');

    assert.equal(store.peekAll('label').get('length'), 1);
    label = store.peekAll('label').findBy("name", "Cool Music Label");
    assert.equal(label.get('city'), "Dortmund");
    assert.equal(label.get('id'), "4444");
    assert.deepEqual(Object.keys(label.changedAttributes()), []);

    assert.equal(artist.get('label')['_internalModel.' + Ember.GUID_KEY], label['_internalModel.' + Ember.GUID_KEY]);
  });
});


test("normalize artist with existing label", function(assert) {
  Ember.run(function() {
    let artist = createRecord('artist', { name: 'Radiohead' });
    let label = createRecord('label', { name: 'Cool Music Label' }, 543);
    artist.set('label', label);

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: '1',
        type: 'artists',
        attributes: {
          name: 'Radiohead'
        },
        relationships: {
          label: {
            data: {
              id: "543",
              type: 'labels',
              attributes: {
                name: "Brands for Jens",
                city: 'KLOTZSCHE',
              }
            }
          }
        }
      }
    };

    assert.deepEqual(Object.keys(label.changedAttributes()), ['name']);
    assert.equal(label.get('currentState.stateName'), "root.loaded.created.uncommitted");

    serializer.normalizeResponse(store, artist, serverJSON, '1', 'createRecord');

    assert.equal(store.peekAll('label').get('length'), 1);
    label = store.peekRecord('label', 543);
    assert.equal(label.get('city'), "KLOTZSCHE");
    assert.equal(label.get('id'), "543");

    assert.deepEqual(Object.keys(label.changedAttributes()), []);
    assert.equal(artist.get('label')['_internalModel.' + Ember.GUID_KEY], label['_internalModel.' + Ember.GUID_KEY]);
  });
});


test("normalize artist with new and existing album", function(assert) {
  Ember.run(function() {
    let artist = createRecord('artist', { name: 'Radiohead' });
    let album1 = createRecord('album', { title: 'Amnesiac', numTracks: 10 });
    let album2 = createRecord('album', { title: 'The King of Limbs', numTracks: 5 }, 456);
    album2.send('pushedData');
    artist.get('albums').pushObjects([album1, album2]);

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: '1',
        type: 'artists',
        attributes: {
          name: 'Radiohead'
        },
        relationships: {
          albums: {
            data: [
              {
                id: "89329",
                type: 'albums',
                attributes: {
                  title: "Amnesiac",
                  __id__: getInternalId(album1)
                }
              },
              {
                id: "456",
                type: 'albums',
                attributes: {
                  title: "The King of Limbs"
                }
              }
            ]
          }
        }
      }
    };

    assert.equal(album1.get('currentState.stateName'), "root.loaded.created.uncommitted");
    assert.deepEqual(Object.keys(album1.changedAttributes()), ['title', 'numTracks']);
    assert.equal(album2.get('currentState.stateName'), "root.loaded.updated.uncommitted");
    assert.deepEqual(Object.keys(album2.changedAttributes()), ['title', 'numTracks']);

    serializer.normalizeResponse(store, artist, serverJSON, '1', 'createRecord');

    assert.equal(store.peekAll('album').get('length'), 2);
    album1 = store.peekAll('album').findBy("title", "Amnesiac");
    assert.equal(album1.get('currentState.stateName'), "root.loaded.saved");
    assert.equal(album1.get('id'), "89329");
    assert.deepEqual(Object.keys(album1.changedAttributes()), []);

    album2 = store.peekAll('album').findBy("title", "The King of Limbs");
    assert.equal(album2.get('currentState.stateName'), "root.loaded.saved");
    assert.equal(album2.get('id'), "456");
    assert.deepEqual(Object.keys(album2.changedAttributes()), []);

    assert.deepEqual(artist.get('albums').toArray(), [album1, album2]);
  });
});


test("normalize artist album and update to server data", function(assert) {
  Ember.run(function() {
    let artist = createRecord('artist', { name: 'Radiohead' });
    let album1 = createRecord('album', { title: 'Amnesiac', numTracks: 10 });
    artist.get('albums').pushObject(album1);

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: '1',
        type: 'artists',
        attributes: {
          name: 'Radiohead'
        },
        relationships: {
          albums: {
            data: [
              {
                id: "89329",
                type: 'albums',
                attributes: {
                  title: "Amnesiac New Version",
                  'num-tracks': 5,
                  __id__: getInternalId(album1)
                }
              },
              {
                id: "456",
                type: 'albums',
                attributes: {
                  title: "The King of Limbs"
                }
              }
            ]
          }
        }
      }
    };

    assert.deepEqual(Object.keys(album1.changedAttributes()), ['title', 'numTracks']);
    assert.equal(album1.get('currentState.stateName'), "root.loaded.created.uncommitted");

    serializer.normalizeResponse(store, artist, serverJSON, '1', 'createRecord');

    assert.equal(store.peekAll('album').get('length'), 1);
    album1 = store.peekAll('album').get('firstObject');
    assert.equal(album1.get("title"), "Amnesiac New Version");
    assert.equal(album1.get("numTracks"), 5);
    assert.equal(album1.get('currentState.stateName'), "root.loaded.saved");
    assert.equal(album1.get('id'), "89329");
    assert.deepEqual(Object.keys(album1.changedAttributes()), []);

    assert.equal(artist.get('albums.length'), 1);
    assert.deepEqual(artist.get('albums').toArray(), [album1]);
  });
});


test("normalize artist album updates to server data (dasherized attribute)", function(assert) {
  Ember.run(function() {
    let artist = createRecord('artist', { name: 'Radiohead' });
    let album1 = createRecord('album', { title: 'Amnesiac', numTracks: 10 });
    artist.get('albums').pushObject(album1);

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: '1',
        type: 'artists',
        attributes: {
          name: 'Radiohead'
        },
        relationships: {
          albums: {
            data: [
              {
                id: "2211",
                type: 'albums',
                attributes: {
                  'num-tracks': 5,
                  __id__: getInternalId(album1)
                }
              }
            ]
          }
        }
      }
    };

    serializer.normalizeResponse(store, artist, serverJSON, '1', 'createRecord');

    album1 = artist.get('albums.firstObject');
    assert.equal(album1.get('id'), "2211");
    assert.equal(album1.get("title"), "Amnesiac");
    assert.equal(album1.get("numTracks"), 5);
  });
});


test("normalize artist does only set defined attributes", function(assert) {
  Ember.run(function() {
    let artist = createRecord('artist', { name: 'Radiohead' });
    let album1 = createRecord('album', { title: 'Amnesiac' });
    let album2 = createRecord('album', { title: 'The King of Limbs', numTracks: 5 }, 456);
    album2.send('pushedData');
    artist.get('albums').pushObjects([album1, album2]);

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: '1',
        type: 'artists',
        attributes: {
          name: 'Radiohead'
        },
        relationships: {
          albums: {
            data: [
              {
                id: "89329",
                type: 'albums',
                attributes: {
                  'num-tracks': 9,
                  year: 2004,
                  __id__: getInternalId(album1)
                }
              },
              {
                id: "456",
                type: 'albums',
                attributes: {
                  title: "The King of Limbs Remix"
                }
              }
            ]
          }
        }
      }
    };

    serializer.normalizeResponse(store, artist, serverJSON, '1', 'createRecord');

    assert.equal(store.peekAll('album').get('length'), 2);

    album1 = store.peekAll('album').get('firstObject');
    assert.equal(album1.get('id'), "89329");
    assert.equal(album1.get("title"), "Amnesiac");
    assert.equal(album1.get("numTracks"), "9");
    assert.equal(album1.get("year"), undefined);

    album2 = store.peekAll('album').objectAt(1);
    assert.equal(album2.get('id'), "456");
    assert.equal(album2.get("title"), "The King of Limbs Remix");
    assert.equal(album2.get("numTracks"), "5");
    assert.equal(album2.get("year"), undefined);
  });
});


test("normalize album belongs-to artist", function(assert) {

  owner.register('serializer:artist', DS.JSONAPISerializer.extend(SaveRelationshipsMixin, {
    attrs: {
      albums: { serialize: false }
    }
  }));

  owner.register('serializer:album', DS.JSONAPISerializer.extend(SaveRelationshipsMixin, {
    attrs: {
      artist: { serialize: true }
    }
  }));

  const serializer = store.serializerFor("album");
  let albumJSON;

  Ember.run(function() {

    const artist = store.createRecord('artist', { name: "Radiohead" });
    const album = store.createRecord('album', { name: "Kid A", artist });

    albumJSON = serializer.serialize(album._createSnapshot());

    const internalId = albumJSON.data.relationships.artist.data.attributes.__id__;

    const serverJSON = { data:
      {
        id: "1",
        type: 'albums',
        attributes: { name: "Kid A"},
        relationships: {
          artists: {
            data: {
              id: "1",
              type: "artists",
              attributes: {
                name: "Radiohead XXXX",
                __id__: internalId
              }
            }
          }
        }
      }
    };

    serializer.normalizeResponse(store, album, serverJSON, '1', 'createRecord');

  });

  // should NOT update name
  const firstAlbum = store.peekAll('album').findBy("name", "Kid A");
  assert.equal(firstAlbum.get('artist.name'), "Radiohead XXXX");

});
