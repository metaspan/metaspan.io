<template>
  <v-fade-transition>
    <v-overlay :value="loading">
      <v-container fluid>
        <v-progress-circular
        :size="150"
        color="primary"
        indeterminate
      ></v-progress-circular>
      </v-container>
    </v-overlay>
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from 'vue'
// import { mapState } from 'vuex'

export default Vue.extend({
  name: 'Loading',
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  },
  // computed: {
  //   ...mapState(['loading'])
  // }
  created () {
    console.debug('Loading.vue: created')
  },
  mounted () {
    console.debug('Loading.vue: mounted')
  }
})
</script>

<style scoped>
.fade-transition-enter-active {
  background-color: #b2fab2;
  transition: background-color 2s, all 2s;
}
.fade-transition-enter-to {
  background-color: white;
}
.fade-transition-leave-active {
  background-color: white;
  transition: background-color 2s, all 2s;
}
.fade-transition-leave-to {
  background-color: #fccece;
}
</style>
