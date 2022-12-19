<template>
  <v-app-bar
    app
    :dark="dark"
  >
    <v-toolbar-title>
      <router-link :class="`toolbar-title${dark ? '-dark' : ''}`" to="/"><v-icon>mdi-web</v-icon> metaspan.io</router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <!-- <v-btn text to="/validator">
        <v-icon>mdi-view-list</v-icon><span class="d-none d-md-inline">Validators</span>
      </v-btn> -->

      <!-- <v-btn text to="/kusama">
        <v-img :src="require('@/assets/kusama-logo.png')" width="24px" height="24px"></v-img>
        <span class="d-none d-sm-inline">Kusama</span>
      </v-btn> -->

      <!-- <v-btn text to="/polkadot">
        <v-img :src="require('@/assets/polkadot-logo.png')" width="24px" height="24px"></v-img>
        <span class="d-none d-sm-inline">Polkadot</span>
      </v-btn> -->

      <!-- <v-btn text @click="showSettingsDialog=true">
        <v-icon>mdi-api</v-icon><span class="d-none d-sm-inline">Settings</span>
      </v-btn> -->

      <!-- <v-btn text to="/docs">
        <v-icon>mdi-text-box-search-outline</v-icon><span class="d-none d-md-inline">API Docs</span>
      </v-btn>

      <v-btn text to="/about">
        <v-icon>mdi-question-mark</v-icon><span class="d-none d-md-inline">About</span>
      </v-btn> -->
      <v-btn text :to="`/${chainId}/pool`">
        <v-icon>mdi-waves</v-icon><span class="d-none d-sm-inline">Pools</span>
      </v-btn>

      <v-btn text :to="`/${chainId}/candidate`">
        <span class="d-none d-sm-inline"><v-icon>mdi-basketball</v-icon></span>1KV
      </v-btn>
      <!-- <v-btn text :to="`/${chainId}/selector`">
        <span class="d-none d-sm-inline"><v-icon>mdi-filter</v-icon></span>Selector
      </v-btn> -->
      <v-btn text :to="`/${chainId}/identity`">
        <span class="d-none d-sm-inline"><v-icon>mdi-passport</v-icon></span>Id<span class="d-none d-md-inline">entity</span>
      </v-btn>

      <ChainMenu></ChainMenu>

    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-tooltip>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          small icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon :color="apiConnected ? 'primary' : ''">mdi-api{{apiConnected ? '' : '-off'}}</v-icon>
        </v-btn>
        </template>
      <span>API connected: {{apiConnected ? 'yes' : 'no'}}</span>
    </v-tooltip>

    <Alerts></Alerts>

    <v-app-bar-nav-icon @click="toggleNavBar()"></v-app-bar-nav-icon>

  </v-app-bar>

</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import ChainMenu from './ChainMenu.vue'
import Alerts from './Alerts.vue'

interface IData {
  showSettingsDialog: boolean
}
// eslint-disable-next-line
interface IMethods {
  toggleNavBar(): void
}
interface IComputed {
  chainId: string
  dark: boolean
  settingsDialog: boolean
  apiConnected: boolean
}
// eslint-disable-next-line
interface IProps {}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  components: {
    Alerts,
    ChainMenu
  },
  computed: {
    ...mapState({ chainId: 'chainId', dark: 'dark', settingsDialog: 'showSettingsDialog' }),
    ...mapGetters('substrate', { apiConnected: 'connected' })
  },
  data () {
    return {
      showSettingsDialog: false
      // apiConnected: false
    }
  },
  watch: {
    settingsDialog (val) {
      this.showSettingsDialog = val
    },
    showSettingsDialog (val) {
      this.$emit('onSettingsDialog', val)
      this.$store.dispatch('setShowSettingsDialog', val)
    }
  },
  methods: {
    toggleNavBar () {
      this.$store.dispatch('toggleNavBar')
    }
  },
  mounted () {
    // let count = 0
    // const int = setInterval(async () => {
    //   count++
    //   if (this.$substrate.polkadot) {
    //     // var nominators = await this.$substrate.polkadot.api.query.staking.nominators(this.candidate.stash)
    //     // console.debug('nominators', this.candidate.stash, nominators)
    //     // var vals = await this.$substrate.polkadot.api.query.staking.validators(this.candidate.stash)
    //     // console.debug('vals', this.candidate.stash, vals)
    //     this.apiConnected = true
    //     clearInterval(int)
    //   }
    //   if (count > 10) {
    //     console.debug('Toolbar.vue: no api found, clearing interval...')
    //     clearInterval(int)
    //   }
    // }, 1000)
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
