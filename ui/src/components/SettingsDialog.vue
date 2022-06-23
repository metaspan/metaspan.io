<template>
  <v-dialog
    v-model="showSettingsDialog"
    scrollable
    max-width="800px"
  >
    <v-card>
      <v-app-bar>Settings</v-app-bar>
      <v-card-text>
        <!-- <v-card-title>Settings</v-card-title> -->
        <v-radio-group v-model="rad_endpoint" :loading="loading" label="Endpoint">
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

</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapGetters('polkadot', ['kusamaEndpoints']),
    ...mapState({
      settingsDialog: 'showSettingsDialog'
    })
  },
  data () {
    return {
      showSettingsDialog: false,
      loading: false,
      rad_endpoint: null
    }
  },
  watch: {
    settingsDialog (val) {
      // console.debug('SettingsDialog.vue: watch.showSettingsDialog()', val)
      // this.$store.dispatch('setShowSettingsDialog', val)
      this.showSettingsDialog = val
    },
    showSettingsDialog (val) {
      // console.debug('SettingsDialog.vue: watch.showSettingsDialog()', val)
      this.$store.dispatch('setShowSettingsDialog', val)
      // this.showSettingsDialog = val
    },
    rad_endpoint (val) {
      this.$store.dispatch('polkadot/setEndpoint', val)
    }
  },
  created () {
    this.rad_endpoint = this.$store.state.polkadot.endpoint
    this.showSettingsDialog = this.$store.state.showSettingsDialog
  }
})
</script>
