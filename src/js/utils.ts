export function timeStringToSeconds(time: string) {
  const split = time.split(':')
  const hour = Number(split[0])
  const minute = Number(split[1])
  const seconds = Number(split[2])

  return (
    hour * 60 * 60 + // hour to seconds
    minute * 60 + // minute to seconds
    seconds
  )
}
