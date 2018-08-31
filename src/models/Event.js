import Orga from '@/models/Orga'
import EventsResource from '@/resources/Events'
import EventHostsResource from '@/resources/relations/EventHosts'
import moment from 'moment'
import DataTypes from 'uidata/model/DataTypes'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

import Entry from './base/Entry'

class Event extends Entry {
  static type = 'events'

  static Resource = EventsResource

  static attributes () {
    return {
      date_start: {
        type: DataTypes.Date,
        default: moment(new Date()).startOf('day').toDate()
      },

      has_time_start: DataTypes.Boolean,

      date_end: {
        type: DataTypes.Date,
        default: moment(new Date()).startOf('day').toDate()
      },

      has_time_end: DataTypes.Boolean
    }
  }

  static relations () {
    return {
      hosts: {
        type: Relation.HAS_MANY,
        Model: Orga,
        Resource: EventHostsResource,
        reverseName: event => {
          return event.isUpcoming ? 'upcoming_events' : 'past_events'
        }
      }
    }
  }

  init () {
    this.facetOwnerType = 'Event'
  }

  afterDeserializeAttributes () {
    if (!this.date_end) {
      this.date_end = this.date_start
    }
  }

  serialize () {
    const data = super.serialize()

    let dateEnd = this.date_end
    const dayStart = moment(this.date_end).startOf('day')
    const dayEnd = moment(this.date_start).startOf('day')
    if (!this.has_time_end && dayStart.isSame(dayEnd)) {
      dateEnd = null
    }

    data.attributes = {
      ...data.attributes,
      date_start: this.date_start,
      has_time_start: this.has_time_start,
      date_end: dateEnd,
      has_time_end: this.has_time_end
    }

    if (!this.id && this.hosts.length) {
      data.relationships.hosts = this.hosts.map(h => h.id)
    }

    return data
  }

  get isUpcoming () {
    const today = moment().startOf('day')
    const start = moment(this.date_start).startOf('day')
    if (start.diff(today, 'days') >= 0) { // start >= today
      return true
    }
    if (this.date_end) {
      const end = moment(this.date_end).startOf('day')
      if (end.diff(today, 'days') >= 0) { // end >= today
        return true
      }
    }
    return false
  }
}

export default Registry.add(Event)
