<template>

    <v-card>
        <v-card-title>About</v-card-title>
        <v-card-text>
            <p>metaspan polkadot / kusama validator dashboard</p>
            <p>Version: {{version}}</p>
        </v-card-text>
    </v-card>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'About',
  data() {
    return {
      // showDialog: false,
      version: '0.1.2'
    }
  },
  watch: {
    showDialog(v: boolean) {
      this.$store.dispatch('showAboutDialog', v)
    }
    // showAboutDialog(v) {
    //   this.showDialog = v
    // }
  },
})
</script>
