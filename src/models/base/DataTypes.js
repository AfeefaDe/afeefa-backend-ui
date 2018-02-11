export default class DataTypes {
  static Boolean = {
    value (value) {
      return !!value
    }
  }

  static String = {
    value (value) {
      return value || ''
    }
  }

  static Date = {
    value (value) {
      return value ? new Date(value) : null
    }
  }

  static Int = {
    value (value) {
      return value ? parseInt(value) : 0
    }
  }

  static Number = {
    value (value) {
      return value ? parseFloat(value) : 0
    }
  }

  static Custom = {
    value (value) {
      return value
    }
  }
}
