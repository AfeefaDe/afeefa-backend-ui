import moment from 'moment'

export default function (event) {
  moment.locale('de')
  moment.updateLocale('de', {
    monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    weekdaysShort: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  })

  let dateString
  const currentYear = moment().year()

  // check if same day
  let isSameDay = false
  if (event.date_end) {
    const sD = moment(event.date_start).startOf('day')
    const eD = moment(event.date_end).startOf('day')
    isSameDay = sD.isSame(eD)
  }

  // create date start string
  let format = 'ddd DD. MMM'
  const startYear = moment(event.date_start).year()
  if (currentYear !== startYear) {
    format += ' YYYY'
  }
  const dateStart = moment(event.date_start).format(format)

  // create date end string
  let dateEnd
  if (event.date_end) {
    format = 'ddd DD. MMM'
    const endYear = moment(event.date_end).year()
    if (currentYear !== endYear) {
      format += ' YYYY'
    }
    dateEnd = moment(event.date_end).format(format)
  }

  // create time start string
  let timeStart
  if (event.has_time_start) {
    timeStart = moment(event.date_start).format(' HH:mm') + ' Uhr'
  }

  // create time end string
  let timeEnd
  if (event.has_time_end) {
    timeEnd = moment(event.date_end).format(' HH:mm') + ' Uhr'
  }

  // build date string depending on date
  dateString = dateStart
  // same day
  if (isSameDay) {
    if (event.has_time_start && event.has_time_end) {
      dateString += ' von ' + timeStart
      dateString += ' bis ' + timeEnd
    } else if (event.has_time_start) {
      dateString += ' um ' + timeStart
    } else if (event.has_time_end) {
      dateString += ' bis ' + timeEnd
    }
  // different date
  } else {
    if (event.has_time_start) {
      dateString += timeStart
    }
    dateString += ' bis ' + dateEnd
    if (event.has_time_end) {
      dateString += timeEnd
    }
  }

  return `${dateString}`
}
