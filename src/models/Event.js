import Entry from './base/Entry'
import Orga from './Orga'
import moment from 'moment'

export default class Event extends Entry {
  init () {
    super.init()

    this.type = 'events'
    this.date_start = moment(new Date()).startOf('day').toDate()
    this.has_time_start = false
    this.date_end = moment(new Date()).startOf('day').toDate()
    this.has_time_end = false
  }

  isUpcoming () {
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

  deserialize (json) {
    super.deserialize(json)

    this.date_start = (json.attributes.date_start === null) ? null : new Date(json.attributes.date_start)
    this.has_time_start = json.attributes.has_time_start === true
    this.date_end = json.attributes.date_end ? new Date(json.attributes.date_end) : this.date_start
    this.has_time_end = json.attributes.has_time_end === true

    const rels = json.relationships

    if (rels.orga && rels.orga.data) {
      const parentOrga = new Orga()
      parentOrga.deserialize(rels.orga.data)
      this.parent_orga = parentOrga

      this.relation('parentOrga').id = rels.orga.data.id
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

    data.relationships.orga = this.parent_orga
      ? { data: {id: this.parent_orga.id, type: 'orgas'} }
      : null

    return data
  }

  clone () {
    const clone = super.clone(this)
    clone.parent_orga = this.parent_orga
    return clone
  }
}
