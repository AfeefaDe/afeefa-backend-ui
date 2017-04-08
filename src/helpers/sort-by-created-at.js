export default function (items) {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    if (a.created_at === b.created_at) {
      return 0
    }
    return a.created_at < b.created_at ? 1 : -1
  })
}
