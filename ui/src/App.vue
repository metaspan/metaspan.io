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

  </v-app>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import Vue from 'vue'
import Toolbar from './components/Toolbar.vue'
import SettingsDialog from './components/SettingsDialog.vue'
import NavDrawer from './components/NavDrawer.vue'

interface IData {
  settingsDialog: boolean
  // eslint-disable-next-line
  matcher: any
}

// eslint-disable-next-line
interface IComputed {
  dark: boolean
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
    NavDrawer
  },
  computed: {
    ...mapState(['dark', 'showSettingsDialog']),
    ...mapState('polkadot', ['endpoint', 'loading'])
  },
  data (): IData {
    return {
      settingsDialog: false,
      matcher: null
    }
  },
  // watch: {
  //   $polkadot (newval) {
  //     console.debug('woot, polkadot is', newval)
  //   }
  // },
  methods: {
    onSettingsDialog (v: boolean) {
      this.settingsDialog = v
    },
    // eslint-disable-next-line
    onDark (evt: any) {
      this.$store.dispatch('setDark', evt.matches)
    }
  },
  created () {
    this.matcher = window.matchMedia('(prefers-color-scheme: dark)')
    // set the initial state from the matcher  await this.onDark(this.matcher)
    this.matcher.addListener(this.onDark)
    this.onDark(this.matcher)
    this.$store.dispatch('init')
  },
  async mounted () {
  //   // console.debug('mounted')
  //   // console.debug(await this.$polkadot)
    await await this.$substrate.connect()
  //   // const activeEra = await this.$polkadot.api.query.staking.activeEra();
  //   // // let chain = await this.$polkadot.rpc.system.chain()
  //   // console.debug('TEST', activeEra)
  }
})
</script>

<style scoped>
.none {
  color: white;
  text-decoration: none;
}
</style>
