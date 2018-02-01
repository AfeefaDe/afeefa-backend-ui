export default function (items, fieldName = 'title') {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    const ta = a[fieldName].toLowerCase().replace(/[^\w]/, '')
    const tb = b[fieldName].toLowerCase().replace(/[^\w]/, '')
    if (ta === tb) {
      return 0
    }
    return (ta > tb) ? 1 : -1
  })
}
