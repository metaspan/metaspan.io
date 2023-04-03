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

      <v-btn @click="$router.push(`/${chainId}/candidate`)" class="d-none d-sm-block">
        <v-icon size="large">mdi-account-hard-hat-outline</v-icon>
        <span class="d-none d-sm-inline">1KV</span>
      </v-btn>

      <v-btn @click="$router.push(`/${chainId}/pool`)" class="d-none d-sm-block">
        <v-icon>mdi-waves</v-icon>
        <span class="d-none d-sm-inline">Pools</span>
      </v-btn>

      <v-btn @click="$router.push(`/${chainId}/identity`)" class="d-none d-sm-block">
        <v-icon size="large">mdi-identifier</v-icon>
        <!-- <span class="d-inline d-md-none">Id</span> -->
        <span class="d-none d-sm-inline text-none">Identity</span>
      </v-btn>

      <ChainMenu></ChainMenu>

    </v-toolbar-items>

    <!-- <v-spacer></v-spacer> -->

    <v-tooltip>
      <template v-slot:activator="{ props }">
        <v-btn
          small icon
          v-bind="props"
        >
          <v-icon :color="apiConnected ? 'primary' : ''">mdi-api{{apiConnected ? '' : '-off'}}</v-icon>
        </v-btn>
        </template>
      <span>API connected: {{apiConnected ? 'yes' : 'no'}}</span>
    </v-tooltip>

    <Alerts></Alerts>

    <v-app-bar-nav-icon @click="toggleNavDrawer()"></v-app-bar-nav-icon>

  </v-app-bar>

</template>

<script lang="ts">
import { defineComponent, ref, watch, inject } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { useTheme } from 'vuetify'
import ChainMenu from './ChainMenu.vue'
import Alerts from './Alerts.vue'
import { SubstrateAPI } from '../plugins/substrate'

export default defineComponent({
  components: {
    Alerts,
    ChainMenu
  },
  setup () {
    const theme = useTheme()
    const bgColor = ref('grey-lighten-3')
    const substrate: SubstrateAPI = inject('$substrate') || new SubstrateAPI({ lite: false })
    watch(() => substrate.connected, (newVal) => {
      console.debug('Toolbar.vue: watch substrate connected', newVal)
    })
    watch(() => theme.global.current.value, (newVal) => {
      console.debug('watch theme', newVal)
      bgColor.value = (newVal.dark) ? '' : 'grey-lighten-3'
    })
    return {
      bgColor
    }
  },
  computed: {
    ...mapState({ chainId: 'chainId', dark: 'dark', settingsDialog: 'showSettingsDialog' }),
    ...mapGetters('substrate', { apiConnected: 'connected' }),
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
    toggleNavDrawer () {
      this.$store.dispatch('toggleNavDrawer')
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
