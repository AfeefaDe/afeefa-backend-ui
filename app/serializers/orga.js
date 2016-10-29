import DS from 'ember-data'

import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    contactInfo: { embedded: 'always' },
    annotation: { embedded: 'always' },
    location: { embedded: 'always' }
  }
});
