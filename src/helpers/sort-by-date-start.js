export default function (items, order) {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    if (a.date_start === b.date_start) {
      return 0
    }
    let result = a.date_start > b.date_start ? 1 : -1
    if (order === 'DESC') {
      result = -1 * result
    }
    return result
  })
}
