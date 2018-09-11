export default function (items, order = 'ASC') {
  if (!items) {
    return []
  }
  return items.sort((a, b) => {
    return compareTitles(a, b, order)
  })
}

export function compareTitles (a, b, order) {
  const ta = replaceUmlauts(a.title.toLowerCase()).replace(/[^\w]/, '')
  const tb = replaceUmlauts(b.title.toLowerCase()).replace(/[^\w]/, '')
  if (ta === tb) {
    return 0
  }
  let result = ta < tb ? -1 : 1
  if (order === 'DESC') {
    result = -1 * result
  }
  return result
}

export function replaceUmlauts (value) {
  value = value.replace(/ä/g, 'ae')
  value = value.replace(/ö/g, 'oe')
  value = value.replace(/ü/g, 'ue')
  value = value.replace(/ß/g, 'ss')
  return value
}
