import moment from 'moment'

export default function (date) {
  function addZero (i) {
    if (i < 10) {
      i = '0' + i
    }
    return i
  }

  if (!moment(date).isValid()) {
    return 'Invalid Date'
  }

  return addZero(date.getMinutes())
}
