<template>
  <v-navigation-drawer
    v-model="drawer"
    location="right"
    temporary
    >
    <v-toolbar>
      <v-toolbar-title>Menu</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn small icon @click="drawer=false"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>

    <v-list>
      <v-list-item>
        <v-list-item-title>
          <v-icon small>mdi-git</v-icon>
          App version: {{appVersion}}</v-list-item-title>
      </v-list-item>
      <v-list-item @click="resetCache()">
        <v-list-item-title>
          <v-icon small>mdi-cached</v-icon>
            Reset cache</v-list-item-title>
      </v-list-item>
      <v-list-item @click="toggleDark()">
        <v-list-item-title>
          <v-icon small>mdi-theme-light-dark</v-icon>
          {{ dark ? 'Light' : 'Dark' }} mode
        </v-list-item-title>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useTheme } from 'vuetify'

export default defineComponent({
  name: 'NavDrawer',
  setup () {
    const theme = useTheme()
    const store = useStore()
    const appVersion = computed(() => store.state.appVersion)
    const showNavDrawer = computed(() => store.state.showNavDrawer)
    const dark = computed(() => store.state.dark)
    return {
      store,
      theme,
      showNavDrawer,
      appVersion,
      dark
    }
  },
  data () {
    return {
      drawer: false
    }
  },
  watch: {
    showNavDrawer (v: boolean) {
      this.drawer = v
    },
    drawer (v: boolean) {
      this.store.dispatch('showNavDrawer', v)
    }
  },
  methods: {
    resetCache () {
      this.store.dispatch('resetCache')
    },
    toggleDark () {
      // this.$vuetify.theme.dark = !this.dark
      this.theme.global.name.value = this.theme.global.name.value !== 'dark' ? 'dark' : 'light'
      this.store.dispatch('setDark', !this.dark)
    }
  }
})
</script>
