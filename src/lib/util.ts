export const textNormalizer = (text: string, limit: number): string => {
  if (text.length <= limit)
    return text
  return text.substring(0, limit) + '...'
}

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}