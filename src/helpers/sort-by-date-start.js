export default function (items, order) {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    if (a.date_start === b.date_start) {
      return 0
    }
    if (order === 'past') {
      return a.date_start < b.date_start ? 1 : -1
    }
    // order === upcoming
    return a.date_start > b.date_start ? 1 : -1
  })
}
