<template>
  <v-container>
    <v-card>
      <v-card-title>metaspan.io - tools</v-card-title>
      <v-card-text>
        <p>Here you will find various tools and utilities for blockchain-related applications.</p>
        <p>The tools are open source, and the code can be found on github, <a href="https://github.com/metaspan">here</a></p>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Featured dApp: metaspan.io - kusama 1kv</v-card-title>
      <v-card-text>
        <p>Kusama 1KV (1000 validators)</p>
        <p>
          <router-link to="/kusama/candidate">Candidates</router-link>
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

@Component({
  components: {
    // HelloWorld
  }
})
export default class Home extends Vue {}
</script>
