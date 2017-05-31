// sort by date end for longtime events and sort by date start for singular events
export default function (items, order) {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    if (a.date_end) {
      a = a.date_end
    } else {
      a = a.date_start
    }
    if (b.date_end) {
      b = b.date_end
    } else {
      b = b.date_start
    }

    if (a === b) {
      return 0
    }
    let result = a > b ? 1 : -1
    if (order === 'DESC') {
      result = -1 * result
    }
    return result
  })
}
