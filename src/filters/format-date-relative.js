import Timeago from 'timeago.js'
import german from 'timeago.js/locales/de' // todo: properly import locales
Timeago.register('german', german)

export default function (date) {
  let tago = new Timeago()
  return tago.format(date, 'german')
}
