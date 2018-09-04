export default function (items, order = 'DESC') {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    if (a.updated_at === b.updated_at) {
      return 0
    }
    let result = a.updated_at > b.updated_at ? -1 : 1
    if (order === 'ASC') {
      result = -1 * result
    }
    return result
  })
}

export function sortByAnnotationsUpdatedAt (items) {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    a = a.annotations[0]
    b = b.annotations[0]
    if (a.updated_at === b.updated_at) {
      return 0
    }
    return a.updated_at < b.updated_at ? 1 : -1
  })
}
