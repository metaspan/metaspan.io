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

      <v-btn text to="/chain/kusama">
        <!-- <v-icon>mdi-basketball</v-icon> -->
        <v-img :src="require('@/assets/kusama-logo.png')" width="24px" height="24px"></v-img>
        <span class="d-none d-sm-inline">Kusama</span>
      </v-btn>

      <v-btn text to="/chain/polkadot">
        <!-- <v-icon>mdi-basketball</v-icon> -->
        <v-img :src="require('@/assets/polkadot-logo.png')" width="24px" height="24px"></v-img>
        <span class="d-none d-sm-inline">Polkadot</span>
      </v-btn>

      <!-- <v-btn text @click="showSettingsDialog=true">
        <v-icon>mdi-api</v-icon><span class="d-none d-sm-inline">Settings</span>
      </v-btn> -->

      <!-- <v-btn text to="/docs">
        <v-icon>mdi-text-box-search-outline</v-icon><span class="d-none d-md-inline">API Docs</span>
      </v-btn>

      <v-btn text to="/about">
        <v-icon>mdi-question-mark</v-icon><span class="d-none d-md-inline">About</span>
      </v-btn> -->

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
      <span>API connected: {{apiConnected}}</span>
    </v-tooltip>

    <Alerts></Alerts>

    <v-app-bar-nav-icon @click="toggleNavBar()"></v-app-bar-nav-icon>

  </v-app-bar>

</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import Alerts from './Alerts.vue'
export default Vue.extend({
  computed: {
    ...mapState({ dark: 'dark', settingsDialog: 'showSettingsDialog' })
  },
  data () {
    return {
      showSettingsDialog: false,
      apiConnected: false
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
  components: { Alerts },
  mounted () {
    let count = 0
    const int = setInterval(async () => {
      count++
      if (this.$substrate.polkadot) {
        // var nominators = await this.$substrate.polkadot.api.query.staking.nominators(this.candidate.stash)
        // console.debug('nominators', this.candidate.stash, nominators)
        // var vals = await this.$substrate.polkadot.api.query.staking.validators(this.candidate.stash)
        // console.debug('vals', this.candidate.stash, vals)
        this.apiConnected = true
        clearInterval(int)
      }
      if (count > 10) {
        console.debug('Toolbar.vue: no api found, clearing interval...')
        clearInterval(int)
      }
    }, 1000)
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
