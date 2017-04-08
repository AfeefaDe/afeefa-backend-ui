export default function (date) {
  function addZero (i) {
    if (i < 10) {
      i = '0' + i
    }
    return i
  }

  var month = addZero(date.getMonth() + 1)
  var day = addZero(date.getDate())
  var year = date.getFullYear()
  const hour = addZero(date.getHours())
  const minutes = addZero(date.getMinutes())
  return `${day}.${month}.${year} um ${hour}:${minutes} Uhr`
}
