export default function (items, keyword) {
  if (!items) {
    return []
  }

  const itemsWithIndex = items.map((item, index) => {
    return { item, index }
  })

  return itemsWithIndex.sort((a, b) => {
    return compareTitles(a, b, keyword)
  }).map(itemWithIndex => itemWithIndex.item)
}

export function compareTitles (a, b, keyword) {
  const ta = replaceUmlauts(a.item.title.toLowerCase()).replace(/[^\w]/, '')
  const tb = replaceUmlauts(b.item.title.toLowerCase()).replace(/[^\w]/, '')

  let result = 0

  keyword = keyword.toLowerCase().replace(/[^\w]/, '')

  if (keyword) {
    if (ta.indexOf(keyword) === 0) {
      if (tb.indexOf(keyword) !== 0) {
        result = -1
      }
    } else if (tb.indexOf(keyword) === 0) {
      if (ta.indexOf(keyword) !== 0) {
        result = 1
      }
    }
  }

  if (!result) {
    result = a.index < b.index ? -1 : 1
  }

  return result
}

function replaceUmlauts (value) {
  value = value.replace(/ä/g, 'ae')
  value = value.replace(/ö/g, 'oe')
  value = value.replace(/ü/g, 'ue')
  value = value.replace(/ß/g, 'ss')
  return value
}
