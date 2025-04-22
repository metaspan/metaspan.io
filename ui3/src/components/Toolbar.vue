<template>
  <v-app-bar
    :color="bgColor"
    app
    :dark="dark"
  >
    <!-- <v-toolbar-title> -->
    <!-- </v-toolbar-title> -->

    <v-btn icon :class="`toolbar-title${dark ? '-dark' : ''}`" to="/">
      <v-icon>mdi-web</v-icon>
    </v-btn>
    <v-btn variant="text" class="d-none d-sm-inline text-none" @click="$router.push('/')">metaspan.io</v-btn>
    <v-spacer></v-spacer>

    <v-toolbar-items>

      <!-- <v-btn @click="$router.push(`/${chainId}/candidate`)" class="d-none d-sm-block">
        <v-icon size="large">mdi-account-hard-hat-outline</v-icon>
        <span class="d-none d-sm-inline">1KV</span>
      </v-btn> -->

      <!-- <v-btn @click="$router.push(`/${chainId}/nomination1kv`)" class="d-none d-sm-block">
        <v-icon size="large">mdi-water-plus-outline</v-icon>
        <span class="d-none d-sm-inline">1kv Noms</span>
      </v-btn> -->

      <!-- <v-btn @click="$router.push(`/${chainId}/delegate`)" class="d-none d-sm-block">
        <v-icon size="large">mdi-vote-outline</v-icon>
        <span class="d-none d-sm-inline">Delegate</span>
      </v-btn> -->

      <!-- <v-btn @click="$router.push(`/${chainId}/pool`)" class="d-none d-sm-block">
        <v-icon>mdi-waves</v-icon>
        <span class="d-none d-sm-inline">Pools</span>
      </v-btn> -->

      <!-- <v-btn @click="$router.push(`/${chainId}/identity`)" class="d-none d-sm-block">
        <v-icon size="large">mdi-identifier</v-icon>
        <span class="d-none d-sm-inline text-none">Identity</span>
      </v-btn> -->

      <!-- <ChainMenu></ChainMenu> -->

    </v-toolbar-items>

    <!-- <v-spacer></v-spacer> -->

    <!-- <v-tooltip>
      <template v-slot:activator="{ props }">
        <v-btn
          small icon
          v-bind="props"
        >
          <v-icon :color="apiConnected ? 'primary' : ''">mdi-api{{apiConnected ? '' : '-off'}}</v-icon>
        </v-btn>
        </template>
      <span>API connected: {{apiConnected ? 'yes' : 'no'}}</span>
    </v-tooltip> -->

    <!-- <Alerts></Alerts> -->

    <!-- <v-app-bar-nav-icon @click="toggleNavDrawer()"></v-app-bar-nav-icon> -->

  </v-app-bar>

</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, inject } from 'vue'
import { useStore } from 'vuex'
import { useTheme } from 'vuetify'
import ChainMenu from './ChainMenu.vue'
import Alerts from './Alerts.vue'
import { SubstrateAPI } from '../plugins/substrate'

export default defineComponent({
  components: {
    Alerts,
    ChainMenu
  },
  setup (props, ctx) {
    const store = useStore()
    const theme = useTheme()
    const chainId = computed(() => store.state.chainId)
    const dark = computed(() => store.state.dark)
    const settingsDialog = computed(() => store.state.showSettingsDialog)
    const apiConnected = computed(() => store.getters['substrate/connected'])

    const showSettingsDialog = ref(false)
    const bgColor = ref('grey-lighten-3')
    const substrate = inject<SubstrateAPI>('$substrate') || new SubstrateAPI({ lite: false })

    const toggleNavDrawer = () => {
      store.dispatch('toggleNavDrawer')
    }

    watch(() => substrate.connected, (newVal) => {
      console.debug('Toolbar.vue: watch substrate connected', newVal)
    })
    watch(() => theme.global.current.value, (newVal) => {
      console.debug('watch theme', newVal)
      bgColor.value = (newVal.dark) ? '' : 'grey-lighten-3'
    })
    watch(() => settingsDialog.value, (val) => {
      showSettingsDialog.value = val
    })
    watch(() => showSettingsDialog.value, (val) => {
      ctx.emit('onSettingsDialog', val)
      store.dispatch('setShowSettingsDialog', val)
    })

    return {
      chainId,
      dark,
      settingsDialog,
      showSettingsDialog,
      apiConnected,
      bgColor,
      toggleNavDrawer
    }
  }
})
</script>

<style scoped>
.toolbar-title {
  cursor: pointer;
  color: inherit;
  text-decoration: inherit;
}
.toolbar-title-dark {
  cursor: pointer;
  color: inherit;
  text-decoration: inherit;
}
</style>
