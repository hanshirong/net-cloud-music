<template>
    <button @click="toggleTheme">
      {{ theme === 'light' ? '切换到夜间模式' : '切换到日间模式' }}
    </button>
</template>
<script>
export default {
  computed: {
    theme() {
      return this.$store.state.theme
    }
  },
  methods: {
    toggleTheme() {
      const newTheme = this.theme === 'light' ? 'dark' : 'light'
      this.$store.commit('updateTheme', newTheme)
    }
  }
}
</script>