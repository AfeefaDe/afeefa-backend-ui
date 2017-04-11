import { Validator } from 'vee-validate'
import moment from 'moment'

let rule = {
  getMessage (field, params, data) {
    return 'Die Endzeit liegt vor der Anfangszeit.'
  },
  validate ({dateStart, dateEnd, hasTimeStart, hasTimeEnd}) {
    const endDayIsBefore = moment(dateEnd).startOf('day')
      .isBefore(moment(dateStart).startOf('day'))
    if (endDayIsBefore) {
      return false
    }

    const endDayIsSame = moment(dateStart).startOf('day')
      .isSame(moment(dateEnd).startOf('day'))
    if (endDayIsSame) {
      if (hasTimeEnd) {
        const endTimeIsBefore = moment(dateEnd).isBefore(moment(dateStart))
        if (endTimeIsBefore) {
          return false
        }
      }
    }

    return true
  }
}
Validator.extend('date-end-not-before-start', rule)


rule = {
  getMessage (field, params, data) {
    return 'Die Endzeit ist gleich der Anfangszeit.'
  },
  validate ({dateStart, dateEnd, hasTimeStart, hasTimeEnd}) {
    if (hasTimeEnd && moment(dateStart).isSame(moment(dateEnd))) {
      return false
    }
    return true
  }
}
Validator.extend('date-end-not-start', rule)
