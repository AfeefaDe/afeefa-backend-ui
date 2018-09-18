export default function textEllipsize (text, length = 300) {
  if (text.length > length) {
    text = text.substring(0, length) + '...'
  }
  return text
}
