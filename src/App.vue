<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {},
  computed:{
    theme(){
      return this.$store.state.theme
    }
  },
  watch:{
    theme(){
      this.updateTheme()
    }
  },
  methods:{
    updateTheme(){
      const body = document.querySelector('body')
      if (this.theme === 'dark') {
        body.classList.remove('light')
        body.classList.add('dark')
        console.log("dark")
      } else {
        body.classList.remove('dark')
        body.classList.add('light')
        console.log("light")
      }
    }
  }
}
</script>

<style>

</style>
