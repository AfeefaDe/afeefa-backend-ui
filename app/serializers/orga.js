import DS from 'ember-data'

import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    contactInfos: { embedded: 'always' },
    annotations: { embedded: 'always' },
    locations: { embedded: 'always' }
  }
});
