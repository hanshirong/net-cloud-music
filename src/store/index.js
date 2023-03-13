import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
     // 是否登录
     isLogin: false,
     // 已收藏的歌单
    collectMusicList: [],
    // 用户创建的歌单
    createdMusicList: [],
    // 要下载的音乐信息
    downloadMusicInfo: {
        name: '',
        url: '',
    },
    // 当前的音乐id
    musicId:"",
    // 音乐的播放状态
    isPlay:false,
    // 当前的播放列表
    musicList:[],
    // 当前播放音乐的索引
    currentIndex: -1,
    // 音乐详情卡片的显隐
    isMusicDetailCardShow: false,
    // 实时播放时长
    currentTime: 0,
    // 音乐是否在加载中
    isMusicLoad: false,
    // 当前播放歌单的id
    musicListId: '',


}

const store = new Vuex.Store({
    state,
    mutations:{
         //更新登录状态
        updataLoginState(state, flag = false) {
            state.isLogin = flag;
        },
        // 更新已收藏的歌单
        updateCollectMusicList(state, collectMusicList) {
            state.collectMusicList = collectMusicList;
        },
        // 更新用户创建的歌单
        updateCreatedMusicList(state, createdMusicList) {
            state.createdMusicList = createdMusicList;
        },
        // 更新当前下载的音乐信息
        updateDownloadMusicInfo(state, info) {
            state.downloadMusicInfo = info;
        },
        // 更新当前的播放音乐Id
        updateMusicId(state, musicId) {
            state.musicId = musicId;
            // console.log('updateMusicId');
        },
        // 更新歌单列表和歌单id
        updateMusicList(state, payload) {
            // 当歌单id发生变化时,重置当前播放音乐索引
            if (payload.musicListId != state.musicListId) {
                state.musicListId = payload.musicListId;
                state.currentIndex = -1;
            }
            // console.log(state.currentIndex);
            // 对歌单进行深拷贝再赋值 直接赋值是浅拷贝
            // 歌单是固定的死数据，而vuex中的musicList是动态的
            let musicList = payload.musicList.slice(0)
            state.musicList = musicList;
            // console.log('updateMusicList');
        },
        // 音乐详情卡片的详情显示
        changeMusicDetailCardState(state) {
            state.isMusicDetailCardShow = !state.isMusicDetailCardShow;
        },
        // 修改播放状态
        changePlayState(state, isPlay) {
            state.isPlay = isPlay;
            // console.log('changePlayState');
        },
        // 更新当前的音乐播放时间
        updateCurrentTime(state, currentTime) {
            state.currentTime = currentTime;
        },
        // 更新音乐的加载状态
        updateMusicLoadState(state, isLoad) {
            state.isMusicLoad = isLoad;
        },
        updateCurrentIndex(state,index){
            state.currentIndex = index
        }

    },

})

export default store;