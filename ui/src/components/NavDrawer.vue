<template>
  <v-navigation-drawer
      v-model="drawer"
      absolute
      right
      temporary
    >
    <v-toolbar>
      <v-toolbar-title>Menu</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn small icon @click="drawer=false"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>

    <v-list>
      <v-list-item @click="resetCache()">
        <v-list-item-title>Reset cache</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapState(['showNavBar'])
  },
  data () {
    return {
      drawer: false
    }
  },
  watch: {
    showNavBar (v: boolean) {
      this.drawer = v
    },
    drawer (v: boolean) {
      this.$store.dispatch('showNavBar', v)
    }
  },
  methods: {
    resetCache () {
      this.$store.dispatch('resetCache')
    }
  }
})
</script>
