import Timeago from 'timeago.js'
import moment from 'moment'
import german from 'timeago.js/locales/de' // todo: properly import locales
import english from 'timeago.js/locales/en' // todo: properly import locales

Timeago.register('de', german)
Timeago.register('en', english)

export default function (date, language = 'de') {
  if (!moment(date).isValid()) {
    return 'Invalid Date'
  }
  let tago = new Timeago()
  return tago.format(date, language)
}
