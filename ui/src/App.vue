<template>
  <v-app :dark="dark">
    <NavDrawer app></NavDrawer>
    <Toolbar v-on:onSettingsDialog="onSettingsDialog"></Toolbar>
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view/>
      </v-fade-transition>
    </v-main>

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
import { mapState } from 'vuex'
import Vue from 'vue'
import Toolbar from './components/Toolbar.vue'
import SettingsDialog from './components/SettingsDialog.vue'
import NavDrawer from './components/NavDrawer.vue'
import Loading from './components/Loading.vue'

interface IData {
  settingsDialog: boolean
  // eslint-disable-next-line
  matcher: any
}

// eslint-disable-next-line
interface IComputed {
  dark: boolean
  appLoading: boolean
  // chainId: string
  chains: any[]
}

interface IMethods {
  // eslint-disable-next-line
  onSettingsDialog (v: boolean): void
  // eslint-disable-next-line
  onDark (evt: any): void
}
// eslint-disable-next-line
interface IProps {}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'App',
  // mixins: [update],
  components: {
    Toolbar,
    SettingsDialog,
    NavDrawer,
    Loading
  },
  computed: {
    ...mapState(['dark', 'showSettingsDialog']),
    ...mapState('polkadot', ['loading']),
    ...mapState({
      chains: 'chains',
      // chainId: 'chainId',
      appLoading: 'loading'
    })
  },
  data (): IData {
    return {
      settingsDialog: false,
      matcher: null
    }
  },
  watch: {
    // NOT HERE, watch chain in ChainHome.vue
    // async chain (newval) {
    //   console.debug('woot, chain is', newval)
    //   await this.$substrate.connect(this.chain)
    //   // const chainInfo = await this.$substrate[this.chain].registry.getChainProperties()
    //   // console.log(chainInfo)
    // }
  },
  methods: {
    onSettingsDialog (v: boolean) {
      this.settingsDialog = v
    },
    // eslint-disable-next-line
    onDark (evt: any) {
      this.$vuetify.theme.dark = evt.matches
      this.$store.dispatch('setDark', evt.matches)
    }
  },
  async created () {
    console.debug('App.vue: created')
    this.matcher = window.matchMedia('(prefers-color-scheme: dark)')
    // set the initial state from the matcher  await this.onDark(this.matcher)
    this.matcher.addListener(this.onDark)
    this.onDark(this.matcher)
    // connect the API(s) for each chain and set chainInfo
    Object.keys(this.chains).forEach(async (chainId: string) => {
      const chainInfo = await this.$substrate.connect(chainId)
      await this.$store.dispatch('substrate/setChainInfo', { chainId, chainInfo })
    })
    this.$store.dispatch('init')
  }
  // async mounted () {
  //   console.debug('App.vue: mounted')
  // }
})
</script>

<style scoped>
.none {
  color: white;
  text-decoration: none;
}
</style>
