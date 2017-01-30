import Ember from 'ember';
import QUnit from 'qunit';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import DS from 'ember-data';
import SaveRelationshipsMixin from 'afeefa-backend-ui/mixins/save-relationships';

let owner, store, Artist;

QUnit.dump.maxDepth = 8;

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

    Artist = DS.Model.extend({
      name: DS.attr('string'),
      numAwards: DS.attr('number'),
      label: DS.belongsTo('label'),
      albums: DS.hasMany('album')
    });
    owner.register('model:artist', Artist);

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
    const appSerializer = DS.JSONAPISerializer.extend({
      keyForAttribute: function(key) {
        return Ember.String.underscore(key);
      },
    });
    owner.register('serializer:application', appSerializer);

    owner.register('serializer:artist', appSerializer.extend(SaveRelationshipsMixin, {
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
          'num_awards': null
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
          'num_awards': null
        },
        relationships: {
          albums: {
            data: [
              {
                type: 'albums',
                attributes: {
                  __id__: getInternalId(album1),
                  title: 'Amnesiac',
                  num_tracks: null
                }
              },
              {
                type: 'albums',
                attributes: {
                  __id__: getInternalId(album2),
                  title: 'The King of Limbs',
                  num_tracks: null
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
    const artist = createRecord('artist', { name: 'Radiohead', numAwards: 3 });
    const album1 = createRecord('album', { title: 'Amnesiac', numTracks: 5 }, 1);
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
          'num_awards': 3
        },
        relationships: {
          albums: {
            data: [
              {
                id: '1',
                type: 'albums',
                attributes: {
                  title: 'Amnesiac',
                  num_tracks: 5
                }
              },
              {
                id: '2',
                type: 'albums',
                attributes: {
                  title: 'The King of Limbs',
                  num_tracks: null
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
          'num_awards': null
        },
        relationships: {
          albums: {
            data: [
              {
                id: '1',
                type: 'albums',
                attributes: {
                  title: 'Amnesiac',
                  num_tracks: 10
                }
              },
              {
                type: 'albums',
                attributes: {
                  __id__: getInternalId(album2),
                  title: 'The King of Limbs',
                  num_tracks: null
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


test("serialize different attribute types", function(assert) {
  owner.register('model:user', DS.Model.extend({
    name: DS.attr('string'),
    active: DS.attr('boolean'),
    age: DS.attr('number'),
    date: DS.attr('date'),
    friend: DS.belongsTo('user', { inverse: null }),
  }));

  owner.register('serializer:user', DS.JSONAPISerializer.extend(SaveRelationshipsMixin, {
    attrs: {
      friend: { serialize: true }
    }
  }));

  Ember.run(function() {
    const user = store.createRecord('user');
    user.set('name', 'User');
    user.set('active', true);
    user.set('age', 24);
    user.set('date', new Date(2017, 1, 28));

    const friend = store.createRecord('user');
    friend.set('name', 'Friend');
    friend.set('active', false);
    friend.set('age', 52);
    friend.set('date', new Date(2017, 6, 1));

    user.set('friend', friend);

    const serializer = store.serializerFor("user");
    const json = serializer.serialize(user._createSnapshot());

    assert.deepEqual(json, { data: {
      type: 'users',
      attributes: {
        name: 'User',
        active: true,
        age: 24,
        date: new Date(2017, 1, 28).toISOString()
      },
      relationships: {
        friend: {
          data: {
            type: 'users',
            attributes: {
              name: 'Friend',
              active: false,
              age: 52,
              date: new Date(2017, 6, 1).toISOString(),
              __id__: getInternalId(friend)
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
          'num_awards': null
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
                  num_tracks: 2
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
    createRecord('artist', { name: 'Radiohead' }, 1);

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

    serializer.normalizeResponse(store, Artist, serverJSON, '1', 'createRecord');

    assert.equal(store.peekAll('album').get('length'), 0);
    assert.equal(store.peekAll('label').get('length'), 0);
  });
});


test("normalize artist with missing attributes", function(assert) {
  Ember.run(function() {
    let artist = createRecord('artist', { name: 'Radiohead' }, 34);
    let album1 = createRecord('album', { title: 'Amnesiac' }, 56);
    let album2 = createRecord('album', { title: 'The King of Limbs' });
    let album3 = createRecord('album', { title: 'Creep' });
    artist.get('albums').pushObjects([album1, album2, album3]);

    artist.set('name', 'Wham!');
    album1.set('title', 'Last Christmas I gave you my heart');
    album2.set('title', 'Wake Me Up Before You Go-Go');
    album3.set('title', 'The Edge of Heaven');

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: '34',
        type: 'artists',
        relationships: {
          albums: {
            data: [
              {
                id: "56",
                type: 'albums'
              },
              {
                id: "57",
                type: 'albums'
              },
              {
                id: "58",
                type: 'albums',
                attributes: {}
              }
            ]
          }
        }
      }
    };

    assert.deepEqual(Object.keys(artist.changedAttributes()), ['name']);
    assert.deepEqual(Object.keys(album1.changedAttributes()), ['title']);
    assert.deepEqual(Object.keys(album2.changedAttributes()), ['title']);
    assert.deepEqual(Object.keys(album3.changedAttributes()), ['title']);

    serializer.normalizeResponse(store, Artist, serverJSON, '1', 'createRecord');

    assert.equal(store.peekAll('artist').get('length'), 1);
    artist = store.peekAll('artist').findBy("name", "Wham!");
    assert.deepEqual(Object.keys(artist.changedAttributes()), []);
    assert.equal(artist.get('currentState.stateName'), "root.loaded.saved");
    assert.equal(artist.get('id'), "34");

    assert.equal(store.peekAll('album').get('length'), 3);

    album1 = store.peekAll('album').findBy("title", "Last Christmas I gave you my heart");
    assert.deepEqual(Object.keys(album1.changedAttributes()), []);
    assert.equal(album1.get('currentState.stateName'), "root.loaded.saved");
    assert.equal(album1.get('id'), "56");

    album2 = store.peekAll('album').findBy("title", "Wake Me Up Before You Go-Go");
    assert.deepEqual(Object.keys(album2.changedAttributes()), ['title']);
    assert.equal(album2.get('currentState.stateName'), "root.loaded.created.uncommitted");
    assert.equal(album2.get('id'), null);

    album3 = store.peekAll('album').findBy("title", "The Edge of Heaven");
    assert.deepEqual(Object.keys(album3.changedAttributes()), ['title']);
    assert.equal(album3.get('currentState.stateName'), "root.loaded.created.uncommitted");
    assert.equal(album3.get('id'), null);
  });
});


test("normalize new artist", function(assert) {
  Ember.run(function() {
    let artist = createRecord('artist', { name: 'Radiohead' });
    let album1 = createRecord('album', { title: 'Amnesiac', numTracks: 10 });
    artist.get('albums').pushObject(album1);

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: '1487',
        type: 'artists',
        attributes: {
          name: 'Radiohead22',
          __id__: getInternalId(artist)
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

    serializer.normalizeResponse(store, Artist, serverJSON, '1', 'createRecord');

    assert.equal(store.peekAll('artist').get('length'), 1);
    artist = store.peekAll('artist').findBy("name", "Radiohead22");
    assert.deepEqual(Object.keys(artist.changedAttributes()), []);
    assert.equal(artist.get('currentState.stateName'), "root.loaded.saved");
    assert.equal(artist.get('id'), "1487");

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

    serializer.normalizeResponse(store, Artist, serverJSON, '1', 'createRecord');

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

    serializer.normalizeResponse(store, Artist, serverJSON, '1', 'createRecord');

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

    serializer.normalizeResponse(store, Artist, serverJSON, '1', 'createRecord');

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


test("normalize artist and album and update to server data", function(assert) {
  Ember.run(function() {
    let artist = createRecord('artist', { name: 'Radiohead', numAwards: 2 }, 1);
    let album1 = createRecord('album', { title: 'Amnesiac', numTracks: 10 });
    artist.get('albums').pushObject(album1);

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: '1',
        type: 'artists',
        attributes: {
          name: 'Pixies'
        },
        relationships: {
          albums: {
            data: [
              {
                id: "89329",
                type: 'albums',
                attributes: {
                  title: "Amnesiac New Version",
                  num_tracks: 5,
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

    serializer.normalizeResponse(store, Artist, serverJSON, '1', 'createRecord');

    assert.equal(artist.get('name'), 'Pixies');
    assert.equal(artist.get('numAwards'), 2);

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
    let artist = createRecord('artist', { name: 'Radiohead' }, 1);
    let album1 = createRecord('album', { title: 'Amnesiac', numTracks: 10 });
    artist.get('albums').pushObject(album1);

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: '1',
        type: 'artists',
        attributes: {
          name: 'Radiohead',
          num_awards: 5
        },
        relationships: {
          albums: {
            data: [
              {
                id: "2211",
                type: 'albums',
                attributes: {
                  num_tracks: 5,
                  __id__: getInternalId(album1)
                }
              }
            ]
          }
        }
      }
    };

    serializer.normalizeResponse(store, Artist, serverJSON, '1', 'createRecord');

    assert.equal(artist.get('name'), 'Radiohead');
    assert.equal(artist.get('numAwards'), 5);

    album1 = artist.get('albums.firstObject');
    assert.equal(album1.get('id'), "2211");
    assert.equal(album1.get("title"), "Amnesiac");
    assert.equal(album1.get("numTracks"), 5);
  });
});


test("normalize different attribute types", function(assert) {
  const User = DS.Model.extend({
    name: DS.attr('string'),
    active: DS.attr('boolean'),
    age: DS.attr('number'),
    date: DS.attr('date'),
    friend: DS.belongsTo('user', { inverse: null }),
  });
  owner.register('model:user', User);

  Ember.run(function() {
    let user = createRecord('user', {}, 1);
    let friend = createRecord('user', {}, 2);

    const serializer = store.serializerFor("artist");

    const serverJSON = {
      data: {
        id: 1,
        type: 'users',
        attributes: {
          name: 'User',
          active: true,
          age: 24,
          date: new Date(2017, 1, 28).toISOString()
        },
        relationships: {
          friend: {
            data: {
              id: 2,
              type: 'users',
              attributes: {
                name: 'Friend',
                active: 'false',
                age: '52.5',
                date: new Date(2017, 6, 1).toISOString()
              }
            }
          }
        }
      }
    };

    serializer.normalizeResponse(store, User, serverJSON, '1', 'createRecord');

    assert.equal(store.peekAll('user').get('length'), 2);

    user = store.peekRecord('user', 1);
    assert.equal(user.get('name'), 'User');
    assert.strictEqual(user.get('active'), true);
    // assert.ok(10 instanceof Number);
    assert.strictEqual(user.get('age'), 24);
    assert.ok(user.get('date') instanceof Date);
    assert.deepEqual(user.get('date'), new Date(2017, 1, 28));

    friend = store.peekRecord('user', 2);
    assert.equal(friend.get('name'), 'Friend');
    assert.strictEqual(friend.get('active'), false);
    assert.strictEqual(friend.get('age'), 52.5);
    assert.ok(friend.get('date') instanceof Date);
    assert.deepEqual(friend.get('date'), new Date(2017, 6, 1));
  });
});
