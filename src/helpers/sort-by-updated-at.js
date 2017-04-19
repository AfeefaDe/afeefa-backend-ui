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
