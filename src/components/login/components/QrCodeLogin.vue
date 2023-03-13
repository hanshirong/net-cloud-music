<template>
    <div class="img-container">
      <img :src="qrCodeImg">
    </div>
  </template>
  
<script>
import { getQrCodeKey, getQrCode, checkQrCode, getAccountInfo } from '../server.js';
import { getTimeStamp } from '@/plugins/utils';

export default {
  name: 'qrCodeLogin',
  data() {
    return {
      key: '',
      qrCodeImg: '',
      timer: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
        // 获取key
      await this.getQrCodeKey();
    //   根据key获取二维码
      await this.getQrCode();
    //   轮询获取二维码的状态
      await this.checkQrCode();
    },

    async getQrCodeKey() {
        // 使用当前的时间戳 获取独一无二的key值
      const res = await getQrCodeKey({ timestamp: getTimeStamp() });
      this.key = res.data.data.unikey;
    },

    async getQrCode() {
      const res = await getQrCode({ key: this.key, qrimg: true, timestamp: getTimeStamp() });
      this.qrCodeImg = res.data.data.qrimg;
    },

    async checkQrCode() {
        // 轮询获取二维码的状态
      this.timer = setInterval(async () => {
        // 定时器已被清空或已处于登录状态 则不向下执行
        if (!this.timer || this.$store.state.isLogin) return;

        const res = await checkQrCode({ key: this.key, timestamp: getTimeStamp() });
        if (res.data.code === 800) {
          // 二维码过期
          this.clearChecker();
          this.init();
        } else if (res.data.code === 803) {
          // 授权成功
          this.clearChecker();
          this.getAccountInfo();
        }
      }, 2000);
    },

    async getAccountInfo() {
      const res = await getAccountInfo();
      console.log("用户信息")
      console.log(res)
      if (res.data.code == 200) {
        window.localStorage.setItem('userId', res.data.profile.userId);
        this.$emit('getUserInfo', res.data.profile);
        this.$message.success('登录成功!');
        this.$store.commit('updataLoginState', true);
      }
    },

    // 清空定时器
    clearChecker() {
      clearInterval(this.timer);
      this.timer = null;
    },
  },
  beforeDestroy() {
    this.clearChecker();
  },
};

</script>

<style  scoped>
.img-container {
  text-align: center;
}
img {
    height: 120px;
}
</style>