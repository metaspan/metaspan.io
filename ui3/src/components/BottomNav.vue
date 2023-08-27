<template>
  <v-bottom-navigation color="primary" :elevation="10" class="d-block d-sm-none">
    <v-toolbar :color="bgColor">
      <v-spacer></v-spacer>

      <v-btn :to="`/${chainId}/candidate`">
        <v-icon size="large">mdi-account-hard-hat-outline</v-icon>
        <span class="d-none d-sm-inline">1KV</span>
      </v-btn>

      <v-btn :to="`/${chainId}/nomination1kv`">
        <v-icon size="large">mdi-water-plus-outline</v-icon>
        <span class="d-none d-sm-inline">1kv Noms</span>
      </v-btn>

      <v-btn :to="`/${chainId}/delegate`">
        <v-icon size="large">mdi-vote-outline</v-icon>
        <span class="d-none d-sm-inline">Delegate</span>
      </v-btn>

      <v-btn :to="`/${chainId}/pool`">
        <v-icon size="large">mdi-waves</v-icon>
        <span class="d-none d-sm-inline">1KV</span>
      </v-btn>

      <v-btn :to="`/${chainId}/identity`">
        <v-icon size="large">mdi-identifier</v-icon>
        <!-- <span class="d-inline d-md-none">Id</span> -->
        <span class="d-none d-sm-inline text-none">Identity</span>
      </v-btn>

      <v-spacer></v-spacer>
      <ChainMenu></ChainMenu>
      <!-- <v-spacer></v-spacer> -->
    </v-toolbar>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useStore } from 'vuex';
import { useTheme } from 'vuetify'

import ChainMenu from './ChainMenu.vue';

export default defineComponent({
  components: {
    ChainMenu
  },
  setup() {
    const store = useStore()
    const chainId = computed(() => store.state.chainId)
    const dark = computed(() => store.state.dark)
    const theme = useTheme()
    const bgColor = ref('grey-lighten-3')
    watch(() => theme.global.current.value, (newVal) => {
      console.debug('watch theme', newVal)
      bgColor.value = (newVal.dark) ? '' : 'grey-lighten-3'
    })
    return {
      bgColor,
      chainId,
      dark
    }
  },
})
</script>
