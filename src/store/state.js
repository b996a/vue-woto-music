const state = {
  isLogin: localStorage.getItem('isLogin') ? JSON.parse(localStorage.getItem('isLogin')) : false,
  // 用户信息 如果缓存中有就取出来，没有则为空
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  // 音乐播放
  curtime: localStorage.getItem('curtime') ? JSON.parse(localStorage.getItem('curtime')) : 0,
  // 音乐播放状态
  isPlaying: false,
  // 当前下载音乐信息
  downloadMusicInfo: {},
  // 是否显示当前歌曲详情页
  isShowSongDetail: false,
  // 是否显示当歌曲列表
  isShowPlaylist: false,
  // 当前播放歌曲歌词
  currentLyric: [],
  MiniPlayState: true,
  isLoop: false,
  playModel: localStorage.getItem('playModel') ? parseInt(JSON.parse(localStorage.getItem('playModel'))) : 0,
  // 当前歌曲url
  songUrl: localStorage.getItem('songUrl') ? JSON.parse(localStorage.getItem('songUrl')) : '',
  // 当前歌曲详情
  nowSongDetail: localStorage.getItem('nowSongDetail') ? JSON.parse(localStorage.getItem('nowSongDetail')) : {},
  // 正在播放列表
  playingList: localStorage.getItem('playingList') ? JSON.parse(localStorage.getItem('playingList')) : [],
  // 用户喜欢的音乐id列表
  likeSongIds: localStorage.getItem('likeSongIds') ? JSON.parse(localStorage.getItem('likeSongIds')) : [],
  // 历史播放列表
  historyPlay: localStorage.getItem('historyPlay') ? JSON.parse(localStorage.getItem('historyPlay')) : []
}
export default state
