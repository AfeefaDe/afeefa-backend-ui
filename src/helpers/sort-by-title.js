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

function replaceUmlauts (value) {
  value = value.replace(/ä/g, 'a')
  value = value.replace(/ö/g, 'o')
  value = value.replace(/ü/g, 'u')
  value = value.replace(/ß/g, 'ss')
  return value
}
