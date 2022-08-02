export function author(playlist) {
  const arr = []
  let name = ''
  playlist.forEach((item, index) => {
    name = ''
    if (item.song) {
      item.song.artists.forEach(item1 => {
        name += item1.name + '/'
      })
      name = name.slice(0, name.length - 1)
      arr[index] = name
    } else {
      item.ar.forEach(item2 => {
        name += item2.name + '/'
      })
      name = name.slice(0, name.length - 1)
      arr[index] = name
    }
  })
  return arr
}
