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
import { defineComponent, ref, computed, watch, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  setup () {
    const store = useStore()
    const kusamaEndpoints = computed(() => store.state['polkadot/kusamaEndpoints'])
    const settingsDialog = computed(() => store.state.showSettingsDialog)
    const showSettingsDialog = ref(false)
    const loading = ref(false)
    const rad_endpoint = ref()
    watch(() => settingsDialog.value, newVal => {
      // console.debug('SettingsDialog.vue: watch.showSettingsDialog()', val)
      // this.$store.dispatch('setShowSettingsDialog', val)
      showSettingsDialog.value = newVal
    })
    watch(() => showSettingsDialog.value, newVal => {
      // console.debug('SettingsDialog.vue: watch.showSettingsDialog()', val)
      store.dispatch('setShowSettingsDialog', newVal)
      // this.showSettingsDialog = val
    })
    watch(() => rad_endpoint.value, newVal => {
      console.warn('DEPRICATED: rad_endpoint()')
      store.dispatch('polkadot/setEndpoint', newVal)
    })

    onBeforeMount(() => {
      rad_endpoint.value = store.state.polkadot.endpoint
      showSettingsDialog.value = store.state.showSettingsDialog
    })

    return {
      settingsDialog,
      showSettingsDialog,
      kusamaEndpoints,
      loading,
      rad_endpoint
    }
  }
})
</script>
