export const StringUtils = {
  capitalize: function (text: string, delimiter = ' ') {
    // First split words into collection after '-'
    // Then transform first character of each word to uppercase
    // And then slice word from second to its length and append with their first character
    // Finally join all those words with ' ' into a sentence to display like 'product-delivery' to 'Product Delivery'
    return text
      .split(delimiter)
      .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(' ');
  },
  ellipsis: function (text: string, length: number) {
    return text.length > length ? `${text.slice(0, length)}...` : text;
  },
};
