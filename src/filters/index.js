import formatDateAbsolute from './format-date-absolute'
import formatDateRelative from './format-date-relative'
import formatEventDate from './format-event-date'
import textEllipsize from './text-ellipsize'

export default {
  install (Vue) {
    Vue.filter('formatDateAbsolute', formatDateAbsolute)
    Vue.filter('formatDateRelative', formatDateRelative)
    Vue.filter('formatEventDate', formatEventDate)
    Vue.filter('textEllipsize', textEllipsize)
  }
}
