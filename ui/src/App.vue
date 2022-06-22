<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >

      <v-toolbar-title>
        <router-link class="none" to="/"><v-icon>mdi-web</v-icon> metaspan</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn text to="/validator">
          <v-icon>mdi-view-list</v-icon><span class="d-none d-md-inline">Validators</span>
        </v-btn>
        <v-btn text to="/candidate">
          <v-icon>mdi-basketball</v-icon><span class="d-none d-md-inline">Candidates</span>
        </v-btn>

        <v-btn text @click="settingsDialog=true">
          <v-icon>mdi-api</v-icon><span class="d-none d-md-inline">Settings</span>
        </v-btn>

        <v-btn text to="/about">
          <v-icon>mdi-question-mark</v-icon><span class="d-none d-md-inline">About</span>
        </v-btn>

        <v-btn class="d-none d-sm-block" text to="/docs">
          <v-icon>mdi-text-box-search-outline</v-icon><span class="d-none d-md-inline">API Docs</span>
        </v-btn>

      </v-toolbar-items>

    </v-app-bar>

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

    <v-dialog
      v-model="settingsDialog"
      scrollable
      max-width="800px"
    >
      <v-card>
        <v-app-bar>Settings</v-app-bar>
        <v-card-text>
          <!-- <v-card-title>Settings</v-card-title> -->
          <v-radio-group v-model="radEndpoint" :loading="loading" label="Endpoint">
            <v-radio v-for="item in kusamaEndpoints" :key="item.id" :value="item.id" :label="item.url"></v-radio>
          </v-radio-group>
          <!-- <v-list>
            <v-list-item v-for="item in kusamaEndpoints" v-bind:key="item.id">
              <v-list-item-icon>{{item.id == endpoint? '+': '-'}}</v-list-item-icon>
            {{item}}
            </v-list-item>
          </v-list> -->

        </v-card-text>
        <!-- <v-card-actions>
          <v-btn>Save</v-btn>
        </v-card-actions> -->
      </v-card>

    </v-dialog>

  </v-app>
</template>

<script lang="ts">
import { mapState, mapGetters } from 'vuex'
// import update from './mixins/update'
import Vue from 'vue'

interface IData {
  settingsDialog: boolean
// eslint-disable-next-line
  radEndpoint: any
}

// eslint-disable-next-line
interface IComputed {}
// eslint-disable-next-line
interface IMethods {}
// eslint-disable-next-line
interface IProps {}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'App',
  // mixins: [update],
  // components: {
  //   AboutDialog,
  // },
  computed: {
    ...mapState('polkadot', ['endpoint', 'loading']),
    ...mapGetters('polkadot', ['kusamaEndpoints'])
  },
  data (): IData {
    return {
      settingsDialog: false,
      radEndpoint: null
    }
  },
  watch: {
    $polkadot (newval) {
      console.debug('woot, polkadot is', newval)
    },
    rad_endpoint (val) {
      this.$store.dispatch('polkadot/setEndpoint', val)
    }
  },
  methods: {
    // showAboutDialog() {
    //   console.debug("test")
    //   this.$store.dispatch("showAboutDialog", true)
    // }
  },
  created () {
    this.$store.dispatch('init')
    this.radEndpoint = this.$store.state.polkadot.endpoint
  },
  async mounted () {
    // console.debug("mounted")
    // console.debug(await this.$polkadot)
    await await this.$polkadot.connect()
    // const activeEra = await this.$polkadot.api.query.staking.activeEra();
    // // let chain = await this.$polkadot.rpc.system.chain()
    // console.debug('TEST', activeEra)
  }
})
</script>

<style scoped>
.none {
  color: white;
  text-decoration: none;
}
</style>
