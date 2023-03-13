<template>
  <div class="Login">
    <el-tabs stretch>
      <el-tab-pane label="二维码登录" lazy>
        <qr-code-login @getUserInfo="getUserInfo" />
        <div class="tips">提示: 请使用网易云音乐app扫码登陆</div>
      </el-tab-pane>
      <el-tab-pane label="验证码登录" lazy>
        <verify-code-login />
        <div class="tips" style="margin-top:10px">提示: 若登录失败, 请使用二维码登录</div>
      </el-tab-pane>
    </el-tabs>
    <div class="regEnter"
         @click="$emit('update:isRegisteredShow',true)">注册</div>
  </div>
</template>

<script>
import QrCodeLogin from './components/QrCodeLogin.vue';
import VerifyCodeLogin from './components/VerifyCodeLogin.vue';

export default {
  components: {QrCodeLogin,VerifyCodeLogin},
  name: 'Login',
  // 接收父组件传过来的消息 ，这个地方是子组件
  props: {
  },
  data() {
    return {};
  },
  methods: {
    getUserInfo(info) {
      // emit方法向父组件传值
      this.$emit('getUserInfo', info);
    },
  },
};
</script>

<style scoped>

.tips {
  font-size: 12px;
  color: #909399;
  text-align: center;
}

.regEnter {
  width: 100%;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  margin: 15px auto 0;
}

.regEnter:hover {
  text-decoration: underline;
}
</style>