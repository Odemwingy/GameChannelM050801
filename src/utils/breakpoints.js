export const breakpoints = [0, 656, 980, 1304]
export const arrangements = ['small', 'medium', 'large', 'xlarge']

export function getArrangement(width = window.innerWidth) {
  for (let index = breakpoints.length - 1; index >= 0; index -= 1) {
    if (width >= breakpoints[index]) return arrangements[index]
  }

  return arrangements[0]
}
