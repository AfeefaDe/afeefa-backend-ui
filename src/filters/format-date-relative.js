import Timeago from 'timeago.js'
import moment from 'moment'
import german from 'timeago.js/locales/de' // todo: properly import locales
Timeago.register('german', german)

export default function (date) {
  if (!moment(date).isValid()) {
    return 'Invalid Date'
  }
  let tago = new Timeago()
  return tago.format(date, 'german')
}
