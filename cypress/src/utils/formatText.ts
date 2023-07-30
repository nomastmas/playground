/**
 * Formats text by replacing '_' with a space, and ':' with ': '
 *
 * @param text - The input text
 * @returns The formatted text after replacing characters
 */
const formatText = (text: string): string => {
  const regexUnderscore = /_/g;
  const regexColon = /:/g;

  return text.replace(regexUnderscore, ' ').replace(regexColon, ': ');
}

export default formatText;