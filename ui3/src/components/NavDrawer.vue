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
import { defineComponent, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useApolloClient } from '@vue/apollo-composable'
import { useTheme } from 'vuetify'

export default defineComponent({
  name: 'NavDrawer',
  setup () {
    const theme = useTheme()
    const store = useStore()
    const apolloClient = useApolloClient()
    const drawer = ref(false)
    const appVersion = computed(() => store.state.appVersion)
    const showNavDrawer = computed<boolean>(() => store.state.showNavDrawer)
    const dark = computed(() => store.state.dark)

    const resetCache = async () => {
      console.debug('clearCache')
      store.dispatch('resetCache')
      const result = await apolloClient.client.clearStore()
      console.debug('result', result)
    }
    const toggleDark = () => {
      // this.$vuetify.theme.dark = !this.dark
      theme.global.name.value = theme.global.name.value !== 'dark' ? 'dark' : 'light'
      store.dispatch('setDark', !dark.value)
    }
    watch(() => drawer.value, newVal => {
      store.dispatch('showNavDrawer', newVal)
    })
    watch(() => showNavDrawer.value, newVal => {
      drawer.value = newVal
    })

    return {
      store,
      theme,
      showNavDrawer,
      appVersion,
      dark,
      resetCache,
      toggleDark,
      drawer
    }
  },
  data () {
    return {
      drawer: false
    }
  }
})
</script>
