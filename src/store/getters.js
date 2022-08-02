// 用户信息
export const userInfo = state => state.userInfo
export const isLogin = state => state.isLogin
/* 音乐播放 */
// 音乐播放状态
export const isPlaying = state => state.isPlaying
export const isLoop = state => state.isLoop
// 当前歌曲url
export const songUrl = state => state.songUrl
// 当前下载音乐信息
export const downloadMusicInfo = state => state.downloadMusicInfo
// 当前歌曲详情
export const nowSongDetail = state => state.nowSongDetail || {}
// 正在播放列表
export const playingList = state => state.playingList || []
export const likeSongIds = state => state.likeSongIds
// 历史记录
export const historyPlay = state => state.historyPlay || []
// 是否显示当前歌曲详情页
export const isShowSongDetail = state => state.isShowSongDetail
// 是否显示歌曲列表
export const isShowPlaylist = state => state.isShowPlaylist
// 当前歌曲播放的实时秒数
export const curtime = state => state.curtime
export const MiniPlayState = state => state.MiniPlayState

// 当前播放歌曲歌词
export const currentLyric = state => state.nowSongDetail.lyric || {}
export const playModel = state => state.playModel
