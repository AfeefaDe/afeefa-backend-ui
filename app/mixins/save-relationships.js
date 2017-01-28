import Ember from 'ember';

export default Ember.Mixin.create({

  serializeRelationship(snapshot, data, rel) {
    const relKind = rel.kind;
    const relKey = rel.key;

    if (data && this.get(`attrs.${relKey}.serialize`) === true) {
      data.relationships = data.relationships || {};
      const key = this.keyForRelationship(relKey, relKind, 'serialize');
      data.relationships[key] = data.relationships[key] || {};

      if (relKind === "belongsTo") {
        data.relationships[key].data = this.serializeRecord(snapshot.belongsTo(relKey));
      }

      if (relKind === "hasMany") {
        data.relationships[key].data = snapshot.hasMany(relKey).map(this.serializeRecord);
      }
    }
  },

  serializeRecord(obj) {

    if (!obj) {
      return null;
    }

    const serialized = obj.serialize();

    if (obj.id) {
      serialized.data.id = obj.id;
    } else {
      if (!serialized.data.attributes)
      {
        serialized.data.attributes = {};
      }
      serialized.data.attributes.__id__ = obj.record.get('_internalModel')[Ember.GUID_KEY];
    }

    // do not allow embedded relationships
    delete serialized.data.relationships;

    return serialized.data;

  },

  serializeHasMany() {
    this._super(...arguments);
    this.serializeRelationship(...arguments);
  },

  serializeBelongsTo() {
    this._super(...arguments);
    this.serializeRelationship(...arguments);
  },

  updateRecord(json, store) {
    if (!json.attributes) {
      // return non-attribute (id/type only) JSON intact
      return json;
    }

    function updateWithServerResponse(record, json) {
      record.eachAttribute(function(name, meta) {
        const jsonKey = Ember.String.dasherize(name);
        if (json.attributes.hasOwnProperty(jsonKey)) {
          record.set(name, json.attributes[jsonKey]);
        }
      });
    }

    // update created records
    if (json.attributes.__id__) {
      const record = store.peekAll(json.type)
      .filterBy('currentState.stateName', "root.loaded.created.uncommitted")
      .findBy('_internalModel.' + Ember.GUID_KEY, json.attributes.__id__);

      if (record) {
        record.set('id', json.id);
        updateWithServerResponse(record, json);
        record._internalModel.flushChangedAttributes();
        record._internalModel.adapterWillCommit();
        store.didSaveRecord(record._internalModel);
      }

    // update updated records
    } else {
      const record = store.peekRecord(json.type, json.id);

      if (record) {
        updateWithServerResponse(record, json);
        record._internalModel.flushChangedAttributes();
        record._internalModel.adapterWillCommit();
        store.didSaveRecord(record._internalModel);
      }
    }

    return json;
  },

  normalizeSaveResponse(store, model, response) {
    const relationships = response.data.relationships || [];

    Object.keys(relationships).forEach(relKey => {
      // filter out empty relationships e.g. label: null, label: {}
      if (!relationships[relKey] || !relationships[relKey].data) {
        return;
      }

      let relationshipData = relationships[relKey].data;
      // has many e.g. albums: { data: [...] }
      if (Array.isArray(relationshipData)) {
        relationshipData = relationshipData.map(json => {
          json.type = Ember.String.singularize(json.type);
          this.updateRecord(json, store);
        });
      // filter out empty relationships e.g. label: {}
      // belongsTo e.g. label: { data: { ... } }
      } else {
        // belongsTo
        relationshipData.type = Ember.String.singularize(relationshipData.type);
        relationshipData = this.updateRecord(relationshipData, store);
      }
    });

    return this._super(store, model, response);
  }

});
