export const cookieValue = (key) => (
  document.cookie
    .split('; ')
    .find(row => row.startsWith(key))
    .split('=')[1]
)
