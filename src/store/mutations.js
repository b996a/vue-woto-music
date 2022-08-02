const mutations = {
  /* 更新登录状态 */
  updateLogin(state, payload) {
    state.isLogin = payload
    localStorage.setItem('isLogin', JSON.stringify(state.isLogin))
  },
  /* 保存用户信息 */
  saveUserInfo(state, payload) {
    state.userInfo = payload
    localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
  },
  // 音乐播放
  // 用户喜欢的音乐id列表
  saveLikeSongIds(state, payload) {
    state.likeSongIds = payload
    localStorage.setItem('likeSongIds', JSON.stringify(state.likeSongIds))
  },
  // 改变音乐播放状态
  changePlayState(state, payload) {
    state.isPlaying = payload
  },
  saveMiniPlayState(state, payload) {
    state.MiniPlayState = payload
  },
  saveIsLoop(state, payload) {
    state.isLoop = payload
  },

  // 保存歌曲url
  saveSongUrl(state, payload) {
    state.songUrl = payload
    localStorage.setItem('songUrl', JSON.stringify(state.songUrl))
  },
  saveCurTime(state, payload) {
    state.curtime = payload
    localStorage.setItem('curtime', JSON.stringify(state.curtime))
  },
  savePlayModel(state, payload) {
    state.playModel = payload
    localStorage.setItem('playModel', JSON.stringify(state.playModel))
  },
  // 保存当前播放歌曲详情,并且添加当前播放歌曲到播放历史记录
  saveSongDetail(state, payload) {
    state.nowSongDetail = payload
    localStorage.setItem('nowSongDetail', JSON.stringify(state.nowSongDetail))
    // 添加当前播放歌曲到播放历史记录
    const index = state.historyPlay.findIndex(item => {
      return item.id === payload.id
    })
    // 如果列表不存在相同的歌曲 再添加到播放历史列表
    if (index === -1) {
      state.historyPlay.unshift(payload)
      localStorage.setItem('historyPlay', JSON.stringify(state.historyPlay))
    }
  },

  // 添加单曲到当前播放列表
  addPlayinglist(state, song) {
    // 列表查找相同的歌曲
    const index = state.playingList.findIndex(item => {
      return item.id === song.id
    })
    // 如果列表不存在相同的歌曲 再添加到播放列表
    if (index === -1) {
      const index1 = state.playingList.findIndex(item => {
        return item.id === state.nowSongDetail.id
      })
      state.playingList.splice(index1 + 1, 0, song)
      localStorage.setItem('playingList', JSON.stringify(state.playingList))
    }
  },

  // 点击播放全部，添加当前歌单所有歌曲到播放列表
  addAllSong(state, payload) {
    state.playingList = payload
    localStorage.setItem('playingList', JSON.stringify(state.playingList))
  },

  // 删除播放列表单曲
  deleteSong(state, songId) {
    const index = state.playingList.findIndex(item => {
      return songId === item.id
    })
    state.playingList.splice(index, 1)
    localStorage.setItem('playingList', JSON.stringify(state.playingList))
  },

  // 清空播放列表
  deleteAll(state) {
    state.playingList = []
    localStorage.removeItem('playingList')
  },

  // 清空历史记录
  deleteAllHistory(state) {
    state.historyPlay = []
    localStorage.setItem('historyPlay', JSON.stringify(state.historyPlay))
  },

  // 删除历史记录单曲
  deleteHistory(state, songId) {
    const index = state.historyPlay.findIndex(item => {
      return songId === item.id
    })
    state.historyPlay.splice(index, 1)
    localStorage.setItem('historyPlay', JSON.stringify(state.historyPlay))
  },
  // 把歌词保存到对应的歌曲信息中
  addSongLyric(state, { song, lyric }) {
    state.playingList.map(item => {
      if (item.id === song.id) {
        item.lyric = lyric
      }
      return item
    })
  },
  // 是否显示当前播放歌曲详情页
  showSongDetail(state) {
    state.isShowSongDetail = !state.isShowSongDetail
  },
  // 是否显示当前播放歌曲列表
  showPlaylist(state) {
    state.isShowPlaylist = !state.isShowPlaylist
  },
  // 更新当前下载的音乐信息
  updateDownloadMusicInfo(state, payload) {
    state.downloadMusicInfo = payload
  }
}
export default mutations
