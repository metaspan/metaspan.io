<template>
  <v-container fluid>
    <v-toolbar dense flat>
      <v-toolbar-title>
        <v-btn text><v-img :src="require(`@/assets/${chain}-logo.png`)" width="24px" height="24px"></v-img>&nbsp;
        {{chain}}
        </v-btn>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- <v-btn text to="/kusama/pool">
        <v-icon>mdi-account-group-outline</v-icon><span class="d-none d-sm-inline">Pools</span>
      </v-btn> -->
      <!-- <v-btn text to="/kusama/validator">
        <v-icon>mdi-basketball</v-icon><span class="d-none d-sm-inline">Validators</span>
      </v-btn> -->
      <v-btn text :to="`/chain/${chain}/candidate`">
        <span class="d-none d-sm-inline"><v-icon>mdi-basketball</v-icon></span>1KV
      </v-btn>

      <v-spacer></v-spacer>

    </v-toolbar>

    <router-view>
      This is the {{chain}} Home page
    </router-view>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'KusamaHome',
  props: {
    chain: {
      type: String,
      required: true
      // default: 'kusama'
    }
  }
})
</script>
