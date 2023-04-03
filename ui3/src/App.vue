<!-- <template>
  <v-app>
    <v-main>
      <HelloWorld />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import HelloWorld from '@/components/HelloWorld.vue'
</script> -->

<template>
  <v-app :dark="dark">
    <Toolbar v-on:onSettingsDialog="onSettingsDialog"></Toolbar>
    <v-main>
      <!-- <v-fade-transition mode="out-in">
        <router-view/>
      </v-fade-transition> -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in" :duration="100">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
    <NavDrawer app></NavDrawer>
    <bottom-nav></bottom-nav>
    <!-- <v-snackbar bottom right :value="updateExists" :timeout="0" color="primary">
      An update is available
      <v-btn text @click="refreshApp">
        Update
      </v-btn>
    </v-snackbar> -->

    <SettingsDialog></SettingsDialog>
    <Loading :loading="appLoading"></Loading>

  </v-app>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { defineComponent, ref, computed, inject, onMounted } from 'vue'
import { useTheme } from "vuetify"

import Toolbar from './components/Toolbar.vue'
import SettingsDialog from './components/SettingsDialog.vue'
import NavDrawer from './components/NavDrawer.vue'
import BottomNav from './components/BottomNav.vue'
import Loading from './components/Loading.vue'
import { SubstrateAPI } from './plugins/substrate'

export default defineComponent({
  name: 'App',
  components: {
    Toolbar,
    SettingsDialog,
    NavDrawer,
    BottomNav,
    Loading
  },
  setup () {
    const store = useStore()
    const theme = useTheme()
    const dark = computed(() => store.state.dark)
    const loading = computed(() => store.state.polkadot.loading)
    const appLoading = computed(() => store.state.loading)
    const chains = computed(() => store.state.chains)
    const showSettingsDialog = computed(() => store.state.showSettingsDialog)
    const $substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })

    const settingsDialog = ref(false) 
    const matcher = ref()

    const onSettingsDialog = (v: boolean) => {
      settingsDialog.value = v
    }

    const onDark = (evt: any) => {
      console.debug('onDark', evt)
      // this.$vuetify.theme.dark = evt.matches
      // this.$store.dispatch('setDark', evt.matches)
      theme.global.name.value = evt.matches ? 'dark' : 'light'
    }

    onMounted(async () => {
      console.debug('App.vue: mounted')
      matcher.value = window.matchMedia('(prefers-color-scheme: dark)')
      // set the initial state from the matcher  await this.onDark(this.matcher)
      matcher.value.addListener(onDark)
      onDark(matcher.value)
      // connect the API(s) for each chain and set chainInfo
      // Object.keys(chains.value).forEach(async (chainId: string) => {
      //   console.debug(`App.vue: SubstrateAPI, connecting ${chainId}`)
      //   const chainInfo = await $substrate.connect(chainId)
      //   await store.dispatch('substrate/setChainInfo', { chainId, chainInfo })
      // })
      store.dispatch('init')
    })

    return {
      appLoading,
      loading,
      chains,
      dark,
      onSettingsDialog,
      showSettingsDialog,
      settingsDialog,
      matcher,
      // created,
      onMounted
    }
  },
  //   // NOT HERE, watch chain in ChainHome.vue
  //   // async chain (newval) {
  //   //   console.debug('woot, chain is', newval)
  //   //   await this.$substrate.connect(this.chain)
  //   //   // const chainInfo = await this.$substrate[this.chain].registry.getChainProperties()
  //   //   // console.log(chainInfo)
  //   // }
  // },
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.none {
  color: white;
  text-decoration: none;
}
</style>
