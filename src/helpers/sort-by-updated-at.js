export default function (items) {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    if (a.updated_at === b.updated_at) {
      return 0
    }
    return a.updated_at < b.updated_at ? 1 : -1
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
