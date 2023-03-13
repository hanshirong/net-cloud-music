import Vue from 'vue';
import VueRouter from 'vue-router'
// 首页
const Index = () => import('../components/Index.vue')
// 首页的中间部分
const Discover = () => import('../views/discover/Discover.vue')
// 首页的个性推荐
const Recommend = () => import('../views/discover/discoverChildren/Recommand.vue')
// 歌单
const MusicList = () => import('../views/discover/discoverChildren/MusicList.vue')
const MusicListIndex = () => import('../views/discover/discoverChildren/musicListChildren/MusicListIndex.vue')
const Ranking = () => import('../views/discover/discoverChildren/Ranking.vue')
// 歌单详情
const MusicListDetail = () => import('../views/musicListDetail/MusicListDetail.vue')

const RecommendMusic = () => import('../views/recommendMusic/RecommendMusic.vue')

const Search = () => import('../views/search/Search.vue')
const SearchSong = () => import('../views/search/searchChildren/SearchSong.vue')
const SearchSinger = () => import('../views/search/searchChildren/SearchSinger.vue')
const SearchAlbum = () => import('../views/search/searchChildren/SearchAlbum.vue')
const SearchMusicList = () => import('../views/search/searchChildren/SearchMusicList.vue')

const SingerDetail = () => import('views/singerDetail/SingerDetail.vue')
const Singer = () => import('views/discover/discoverChildren/Singer.vue')
const Personal = () => import('views/personal/Personal.vue')
Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/index' },
    {
        path:'/index',
        component:Index,
        redirect: '/discover',
        children:[
            {
                path: '/discover',
                component: Discover,
                redirect: '/discover/recommend',
                children: [
                    { path: '/discover/recommend', component: Recommend },
                    {
                        path: '/discover/musiclist',
                        component: MusicList,
                        redirect: '/discover/musiclist/musiclistindex',
                        children: [
                            { path: '/discover/musiclist/musiclistindex', component: MusicListIndex },
                        ]
                    },
                    { path: '/discover/ranking', component: Ranking },
                    { path: '/discover/singer', component: Singer },
                ]
            },
            { path: '/musiclistdetail/:id', name: 'musicListDetail', component: MusicListDetail },
            { path: '/recommendmusic', component: RecommendMusic },
            {
                path: '/search/:id', name: 'search', component: Search,
                redirect: '/search/searchsong/:id',
                children: [
                    { path: '/search/searchsong/:id', name: 'searchSong', component: SearchSong },
                    { path: '/search/searchsinger/:id', name: 'searchSinger', component: SearchSinger },
                    { path: '/search/searchalbum/:id', name: 'searchAlbum', component: SearchAlbum },
                    { path: '/search/searchmusiclist/:id', name: 'searchMusicList', component: SearchMusicList },
                ]
            },
            { path: '/singerdetail/:id', name: 'singerDetail', component: SingerDetail },
            { path: '/personal/:uid', name: 'personal', component: Personal },
        ]
    }

]

const router = new VueRouter({
    routes,
    mode: 'hash',
})

export default router