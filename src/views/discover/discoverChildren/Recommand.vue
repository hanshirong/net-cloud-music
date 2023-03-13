<template>
    <div class="recommendContainer">
        <div class="recommend">
            <div class="carousel">
                <el-carousel :interval="4000" type="card" height="180px">
                    <el-carousel-item v-for="(item, index) in bannerData" :key="index">
                        <img :src="item.imageUrl" alt="" />
                    </el-carousel-item>
                </el-carousel>
            </div>
            <!-- 推荐歌单 -->
            <div class="recommendMusicList">
                <h3>推荐歌单<i class="iconfont icon-arrow-right-bold"></i></h3>
                <list-card :listCardData="musicList" @clickListCardItem="clickListCardItem"></list-card>
            </div>
        </div>
    </div>
</template>
<script>
import ListCard from "components/listCard/ListCard.vue";
export default {
    name:"Recommand",
    components:{ListCard},
    data() {
        return {
            bannerData: [],
            musicList:[],

        }
    },
    methods: {
        // 获取bannner的内容
        async getBannerData() {
            let result = await this.$request("/banner");
            this.bannerData = result.data.banners;
        },
        // 请求推荐歌单数据的前十个
        async getMusicList(){
            let res = await this.$request("/personalized", { limit: 10 })
            this.musicList = res.data.result
        },
        // 点击歌单封面的回调
        clickListCardItem(id) {
            // 跳转到歌曲的详情页
            this.$router.push({ name: "musicListDetail", params: { id } });
        },

    },
    created() {
        // 获取banner的数据
        this.getBannerData()
        this.getMusicList()
    }
}
</script>

<style scoped>
.recommendContainer {
    display: flex;
    justify-content: center;
}

.recommend {
    max-width: 80%;
    margin: auto;
}

.carousel {
    width: 100%;
}

.el-carousel {
    margin: auto;
    width: 100%;
}

.el-carousel__item {
    border-radius: 10px;
}

.el-carousel__item img {
    height: 100%;
    width: 100%;
}

.bannerImage::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: url("~assets/img/imgLoading.png") no-repeat center;
  background-size: contain;
  border-radius: 10px;
  z-index: -1;
}

.recommendMusicList{
    margin: 20px 10px;
}
.recommendMusicList h3 {
  color: #373737;
}
</style>