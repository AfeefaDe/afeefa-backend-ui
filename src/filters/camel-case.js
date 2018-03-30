export default function toCamelCase (str, options = {toUpper: true}) {
  // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case/32604073#32604073
  return str
    // first char to upper
    .replace(/^(.)/, $1 => (options.toUpper ? $1.toUpperCase() : $1.toLowerCase()))
    // Replaces any - or _ characters with a space
    .replace(/[-_]+/g, ' ')
    // Removes any non alphanumeric characters
    .replace(/[^\w\s]/g, '')
    // Uppercases the first character in each group immediately following a space
    // (delimited by spaces)
    .replace(/ (.)/g, $1 => $1.toUpperCase())
    // Removes spaces
    .replace(/ /g, '')
}
