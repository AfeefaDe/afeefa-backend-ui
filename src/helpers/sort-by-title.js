export default function (items) {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    const ta = a.title.toLowerCase().replace(/[^\w]/, '')
    const tb = b.title.toLowerCase().replace(/[^\w]/, '')
    if (ta === tb) {
      return 0
    }
    return (ta > tb) ? 1 : -1
  })
}
