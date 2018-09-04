export default function (items, order = 'DESC') {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    if (a.created_at === b.created_at) {
      return 0
    }
    let result = a.created_at > b.created_at ? -1 : 1
    if (order === 'ASC') {
      result = -1 * result
    }
    return result
  })
}
