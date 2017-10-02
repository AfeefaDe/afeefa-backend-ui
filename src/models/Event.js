import Entry from './base/Entry'
import moment from 'moment'

export default class Event extends Entry {
  init () {
    super.init()

    this.type = 'events'
    this.date_start = moment(new Date()).startOf('day').toDate()
    this.has_time_start = false
    this.date_end = moment(new Date()).startOf('day').toDate()
    this.has_time_end = false
    this.upcoming = false
  }

  deserialize (json) {
    super.deserialize(json)

    this.date_start = (json.attributes.date_start === null) ? null : new Date(json.attributes.date_start)
    this.has_time_start = json.attributes.has_time_start === true
    this.date_end = json.attributes.date_end ? new Date(json.attributes.date_end) : this.date_start
    this.has_time_end = json.attributes.has_time_end === true
    this.upcoming = json.attributes.upcoming
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

    data.relationships.orga = this.parent_orga
      ? { data: {id: this.parent_orga.id, type: 'orgas'} }
      : null

    return data
  }

  clone () {
    const event = super.clone(new Event())

    event.date_start = this.date_start
    event.has_time_start = this.has_time_start
    event.date_end = this.date_end
    event.has_time_end = this.has_time_end
    event.upcoming = this.upcoming
    return event
  }
}
