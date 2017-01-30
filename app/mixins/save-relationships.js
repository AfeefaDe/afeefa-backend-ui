import Ember from 'ember';
import { parseDate } from "ember-data/-private/ext/date";

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

  updateRecordAttribtutes(store, record, json) {
    if (json.attributes) {
      record.eachAttribute((name, meta) => {
        const jsonKey = this.keyForAttribute(name);
        if (json.attributes.hasOwnProperty(jsonKey)) {
          let value = json.attributes[jsonKey];
          if (meta.type === 'number') {
            value = parseFloat(value);
          }
          if (meta.type === 'date') {
            value = new Date(parseDate(value));
          }
          if (meta.type === 'boolean') {
            value = JSON.parse(value);
          }
          record.set(name, value);
        }
      });
    }
    record._internalModel.flushChangedAttributes();
    record._internalModel.adapterWillCommit();
    store.didSaveRecord(record._internalModel);
  },

  updateRecord(json, store) {
    // an id should always be given, try to find the asscociated recoord
    // if found --> it's an update
    let record = store.peekRecord(json.type, json.id);

    if (record) {
      this.updateRecordAttribtutes(store, record, json);
    }

    // if there is no record and an internal id is given
    // try to find a created record for that internal id
    if (!record && json.attributes && json.attributes.__id__) {
      // update created records
      const record = store.peekAll(json.type)
        .filterBy('currentState.stateName', "root.loaded.created.uncommitted")
        .findBy('_internalModel.' + Ember.GUID_KEY, json.attributes.__id__);
      if (record) {
        record.set('id', json.id);
        this.updateRecordAttribtutes(store, record, json);
      }
    }

    return json;
  },

  normalizeSaveResponse(store, modelClass, response) {
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
      // belongsTo e.g. label: { data: { ... } }
      } else {
        // belongsTo
        relationshipData.type = Ember.String.singularize(relationshipData.type);
        this.updateRecord(relationshipData, store);
      }
    });

    response.data.type = Ember.String.singularize(response.data.type);
    this.updateRecord(response.data, store);

    return this._super(store, modelClass, response);
  }

});
