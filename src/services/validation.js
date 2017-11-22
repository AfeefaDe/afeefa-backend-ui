import { Validator } from 'vee-validate'
import de from 'vee-validate/dist/locale/de'
import moment from 'moment'

Validator.addLocale(de)

let rule = {
  messages: {
    en: (field, args) => {
      return 'End time is earlier than start time.'
    },
    de: (field, args) => {
      return 'Die Endzeit liegt vor der Anfangszeit.'
    }
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
  messages: {
    en: (field, args) => {
      return 'End time and start time are equal.'
    },
    de: (field, args) => {
      return 'Die Endzeit ist gleich der Anfangszeit.'
    }
  },
  validate ({dateStart, dateEnd, hasTimeStart, hasTimeEnd}) {
    if (hasTimeEnd && moment(dateStart).isSame(moment(dateEnd))) {
      return false
    }
    return true
  }
}
Validator.extend('date-end-not-start', rule)


rule = {
  messages: {
    en: (field, args) => {
      return `${field} – The URL is not valid. (http:// is needed)`
    },
    de: (field, args) => {
      return `${field} – Die eingegebene URL ist nicht gültig. (http:// wird gefordert)`
    }
  },
  validate (value) {
    // from http://stackoverflow.com/a/15855457
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
  }
}
Validator.extend('url-with-protocol', rule)


rule = {
  messages: {
    en: (field, args) => {
      return `Passwords don't match.`
    },
    de: (field, args) => {
      return `Passwörter stimmen nicht überein.`
    }
  },
  validate (value, args) {
    const otherValue = document.querySelector(args[0]).value
    return value === otherValue
  }
}
Validator.extend('password-confirm', rule)
