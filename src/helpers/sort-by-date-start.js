export default function (items) {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    if (a.date_start === b.date_start) {
      return 0
    }
    return a.date_start > b.date_start ? 1 : -1
  })
}
