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

    const event = store.createRecord('event');
    const location = store.createRecord('location');
    const contactInfo = store.createRecord('contactInfo');
    event.get('locations').addObject(location);
    event.get('contactInfos').addObject(contactInfo);

    const model = {
      orgas: store.peekAll('orga'),
      entryInstance: event,
      contactInfoInstance: contactInfo,
      locationInstance: location,
    };
    return model;
  }

  setupEvent (store) {
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
        type: 'event',
        attributes: {
          title: 'Event1',
          date_start: new Date(2017, 1, 28)
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
    const orga = store.peekRecord('orga', 1);
    const annotation = store.peekRecord('annotation', 1);
    const location = store.peekRecord('location', 1);
    const contactInfo = store.peekRecord('contact-info', 1);
    event.set('orga', orga);
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

  setupCategories(store) {
    store.push({
    data: [{
        id: 1,
        type: 'category',
        attributes: {
          title: 'Level 1 Category A'
        }
      },{
        id: 2,
        type: 'category',
        attributes: {
          title: 'Level 1 Category B'
        }
      },{
        id: 3,
        type: 'category',
        attributes: {
          title: 'Level 2 Category A'
        }
      },{
        id: 4,
        type: 'category',
        attributes: {
          title: 'Level 2 Category B'
        }
      },{
        id: 5,
        type: 'category',
        attributes: {
          title: 'Level 2 Category C'
        }
      }]
    });
    const l1A = store.peekRecord('category', 1);
    const l1B = store.peekRecord('category', 2);

    const l2A = store.peekRecord('category', 3);
    const l2B = store.peekRecord('category', 4);
    const l2C = store.peekRecord('category', 5);

    l2A.set('parentCategory', l1A);
    l2B.set('parentCategory', l1A);
    l2C.set('parentCategory', l1B);
    const model = {
      categories: store.peekAll('category'),
    };
    return model;
  }
}

export default new Fixtures();
