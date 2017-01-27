class Fixtures {
  setupNewEvent (store) {
    store.push({
      data: [{
        id: 1,
        type: 'orga',
        attributes: {
          title: 'Orga1'
        }
      },{
        id: 2,
        type: 'orga',
        attributes: {
          title: 'Orga2'
        }
      },{
        id: 1,
        type: 'annotation',
        attributes: {
          title: 'Annotation1'
        }
      },{
        id: 2,
        type: 'annotation',
        attributes: {
          title: 'Annotation2'
        }
      }]
    });

    const model = {
      orgas: store.peekAll('orga'),
      entryInstance: store.createRecord('event'),
      contactInfoInstance: store.createRecord('contactInfo'),
      locationInstance: store.createRecord('location'),
    };
    return model;
  }

  setupEvent (store) {
    store.push({
      data: [{
        id: 1,
        type: 'event',
        attributes: {
          title: 'Event1'
        }
      },{
        id: 1,
        type: 'annotation',
        attributes: {
          title: 'Annotation1'
        }
      },{
        id: 2,
        type: 'annotation',
        attributes: {
          title: 'Annotation2'
        }
      },{
        id: 1,
        type: 'contact-info',
        attributes: {
          contactPerson: 'Contactinfo1'
        }
      },{
        id: 1,
        type: 'location',
        attributes: {
          city: 'Location1'
        }
      }]
    });
    const event = store.peekRecord('event', 1);
    const annotation = store.peekRecord('annotation', 1);
    const location = store.peekRecord('location', 1);
    const contactInfo = store.peekRecord('contact-info', 1);
    event.get('annotations').addObject(annotation);
    event.get('locations').addObject(location);
    event.get('contactInfos').addObject(contactInfo);
    const model = {
      entryInstance: event,
      contactInfoInstance: contactInfo,
      locationInstance: location
    };
    return model;
  }
}

export default new Fixtures();
