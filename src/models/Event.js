import Entry from './base/Entry'

export default class Event extends Entry {
  init () {
    super.init()

    this.type = 'events'
    this.date_start = new Date()
    this.has_time_start = false
    this.date_end = new Date()
    this.has_time_end = false
  }

  deserialize (json) {
    super.deserialize(json)

    this.date_start = new Date(json.attributes.date_start)
    this.has_time_start = json.attributes.has_time_start === true
    this.date_end = new Date(json.attributes.date_end)
    this.has_time_end = json.attributes.has_time_end === true
  }

  serialize () {
    const data = super.serialize()

    data.attributes = {
      ...data.attributes,
      date_start: this.date_start,
      has_time_start: this.has_time_start,
      date_end: this.date_end,
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

    return event
  }
}
