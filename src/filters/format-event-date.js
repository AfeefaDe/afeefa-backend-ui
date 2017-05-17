import moment from 'moment'

export default function (event) {
  moment.locale('de')
  moment.updateLocale('de', {
    monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    weekdaysShort: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  })

  const currentYear = moment().year()

  let isSameDay = false
  if (event.date_end) {
    const sD = moment(event.date_start).startOf('day')
    const eD = moment(event.date_end).startOf('day')
    isSameDay = sD.isSame(eD)
  }

  let format = 'dddd DD. MMMM'
  const startYear = moment(event.date_start).year()
  if (currentYear !== startYear) {
    format += ' YYYY'
  }
  let dateString = moment(event.date_start).format(format)

  if (event.has_time_start) {
    dateString += moment(event.date_start).format(' HH:mm')
    if (!isSameDay) {
      dateString += ' Uhr'
    }
  }

  if (event.date_end) {
    if (!isSameDay || event.has_time_end) {
      dateString += ' - '
    }

    if (!isSameDay) {
      format = 'dddd DD. MMMM'
      const endYear = moment(event.date_end).year()
      if (currentYear !== endYear) {
        format += ' YYYY'
      }
      dateString += moment(event.date_end).format(format)
    }

    if (event.has_time_end) {
      dateString += moment(event.date_end).format(' HH:mm') + ' Uhr'
    }
  }

  return `${dateString}`
}
