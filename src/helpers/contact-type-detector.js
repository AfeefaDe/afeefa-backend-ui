export default {
  isMail: function (contactString) {
    return (contactString.indexOf('@') > -1)
  },
  isPhone: function (contactString) {
    return (contactString.indexOf('@') < 0)
  }
}
