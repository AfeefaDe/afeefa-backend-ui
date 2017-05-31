import moment from 'moment'

function computeDateValue (event) {
  const today = moment().startOf('day')
  const start = moment(event.date_start).startOf('day')
  // take date start if start > today
  // else take date end if exist
  // else take date start
  if (event.date_end) {
    if (start.diff(today, 'days') < 0) { // start < today
      return event.date_end
    }
  }
  return event.date_start
}

// sort by date end for longtime events and sort by date start for singular events
export default function (items, order) {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    a = computeDateValue(a)
    b = computeDateValue(b)

    if (a === b) {
      return 0
    }
    let result = a > b ? 1 : -1
    if (order === 'DESC') {
      result = -1 * result
    }
    return result
  })
}
