<template>

  <v-menu offset-y>

    <template v-slot:activator="{ on, attrs }">
      <v-btn icon text
        v-bind="attrs"
        v-on="on"
        >
        <v-icon>mdi-menu</v-icon>
      </v-btn> <span class="d-none d-sm-inline">Links</span>
    </template>

    <v-list>

      <v-list-item>
        <v-list-item-icon>
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 990 319.84">
            <!-- <defs>
              <style>.cls-1{fill:#fff;}</style>
            </defs> -->
            <title>KUSAMA_logo copy 6</title>
            <path class="cls-1" d="M631.44,140.4v-.59a21.61,21.61,0,0,0-21.57-21.32H595.54a2,2,0,0,1-2.29-2.29v-13c0-.19,0-.39,0-.6a24.82,24.82,0,1,0-49.63,0V116.2a2,2,0,0,1-2.29,2.29H495a2,2,0,0,1-2.29-2.29V101.31a23.55,23.55,0,0,0-47.1,0V116.2c0,1.53-.68,2.29-2,2.29H429a21.62,21.62,0,0,0,0,43.23,8.51,8.51,0,0,1,1.08.05h13.46c1.35,0,2,.76,2,2.29v20a23.56,23.56,0,0,0,47.1.93v-20.9a2,2,0,0,1,2.29-2.29h46.33a2,2,0,0,1,2.29,2.29V174.5q0,19.6-3.31,31.94a48.46,48.46,0,0,1-12,21.39q-8.65,9-22.79,13.87a167.15,167.15,0,0,1-29.24,6.59,22.13,22.13,0,0,0,4.63,43.78c.53,0,1.05,0,1.57-.05q58.08-7.63,83.89-34.15,26.85-27.62,26.85-83.37V164a2,2,0,0,1,2.29-2.29h14.3A21.61,21.61,0,0,0,631.44,140.4Z"></path>
            <path class="cls-1" d="M839,94.82a13.92,13.92,0,0,0-10.18-4.33H655.55a22.28,22.28,0,0,0,0,44.55H787a1.49,1.49,0,0,1,1.27.76c.34.51.34.94,0,1.27q-18.84,32.85-62.37,57.54-1.79,1.27-3.31-.77c-2.84-3.84-5.34-7.22-7.53-10.16h0a25.27,25.27,0,0,0-34-6.28l-1,.65A25.24,25.24,0,0,0,673.92,213q24.24,33.34,46,65.05a25.45,25.45,0,0,0,41.69-29c-2.21-3.24-4.76-6.93-7.66-11.13-.85-1.18-.59-2.12.77-2.8q31.31-18.33,51-39a169.23,169.23,0,0,0,32-47.6,68.81,68.81,0,0,0,5.6-28V105A14,14,0,0,0,839,94.82Z"></path>
            <path class="cls-1" d="M393.36,104.87a14,14,0,0,0-10.31-4.2H294.6s-7.68.28-7.72-.24A23.2,23.2,0,0,0,241.32,96a.67.67,0,0,1-.08.17,194.56,194.56,0,0,1-36.3,73,23.08,23.08,0,0,0,4.15,30.59l.37.32a23.09,23.09,0,0,0,30.7-1.36A222.9,222.9,0,0,0,274.6,146a3,3,0,0,1,3.06-2h65.17c1.69,0,2.37.68,2,2q-5.61,49.65-31.44,72.56-23.9,21.18-74,29.3h0a22.15,22.15,0,0,0,3.19,44.06,23.06,23.06,0,0,0,3.23-.23,6,6,0,0,1,1-.07Q322.78,281.17,358.61,242q37.68-41.25,38.95-126.78A14,14,0,0,0,393.36,104.87Z"></path>
            <path class="cls-1" d="M492.24,21.51a10.75,10.75,0,0,0-5.72-2.8c-2.68-.35-5.39,1.43-7.23,2.62S474,26,472.52,27s-5.12,2-11,5.59-29.17,18.46-29.17,18.46l6.05.06L411.42,65.08h2.69l-3.87,3a8.67,8.67,0,0,0,6.3-.92l0,.83s32.09-12.65,38.32-9.37L451.1,59.7c.33,0,6.44.39,6.44.39a8.61,8.61,0,0,0,3.88,6.24c3.68,2.43,3.74,3.75,3.74,3.75s-1.9.78-1.9,1.77a17.4,17.4,0,0,1,10.38,0s-.2-1-2.76-1.77-5.06-3.49-6.31-5a7,7,0,0,1-1-6.9c.88-2.28,4-3.55,10.31-6.83,7.49-3.87,9.19-6.77,10.24-9s2.63-6.7,3.5-8.8a11.6,11.6,0,0,1,3.6-5,46.77,46.77,0,0,1,6.18-2.76S493.49,22.5,492.24,21.51Z"></path>
          </svg>
        </v-list-item-icon>
        <v-list-item-title>
          <a class="none" :href="'https://thousand-validators.'+chain+'.network/#/leaderboard/'+candidate.stash" target="_blank"> TVP</a>
        </v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <img width="18px" heithg="18px" src="https://polkadot.js.org/apps/static/subscan.11e2654a..svg">
        </v-list-item-icon>
        <v-list-item-title>
          <!-- <v-btn small text> -->
          <a class="none" :href="'https://'+chain+'.subscan.io/validator/'+candidate.stash" target="_blank"> subscan</a>
          <!-- </v-btn> -->
        </v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <img width="18px" heithg="18px" src="https://polkadot.js.org/apps/static/subscan.11e2654a..svg">
        </v-list-item-icon>
        <v-list-item-title>
          <!-- <v-btn small text> -->
          <a class="none" :href="`https://${chain}.subscan.io/account/${candidate.stash}?tab=reward`" target="_blank"> subscan Rewards</a>
          <!-- </v-btn> -->
        </v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon class="position-relative">
          <img class="polkastats-logo" src="https://kusama.polkastats.io/img/polkastats_logo_dark@1x.png">
        </v-list-item-icon>
        <v-list-item-title>
          <a class="none" :href="'https://'+chain+'.polkastats.io/validator/'+candidate.stash" target="_blank">
            polkastats
          </a>
        </v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <svg height="16px" class="w-6 h-6" viewBox="0 0 44.426 44.424" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path fill="#7c3aed" d="M28.272 25.817c1.006-.551 1.754-1.306 2.24-2.268.486-.96.73-2.065.73-3.314 0-1.247-.244-2.346-.73-3.296-.486-.949-1.236-1.691-2.25-2.223-1.013-.533-2.314-.799-3.905-.799h-5.839V26.64h5.873c1.58 0 2.873-.274 3.881-.823z"></path><path fill="#7c3aed" d="M22.213 0C9.945 0 0 9.945 0 22.213c0 7.366 3.588 13.892 9.109 17.933.264.103.544.171.844.171a2.364 2.364 0 0 0 2.363-2.363l.004-2.257V8.594h13.014c2.702 0 4.972.504 6.809 1.511 1.838 1.008 3.229 2.39 4.173 4.146.944 1.757 1.417 3.752 1.417 5.983 0 2.256-.476 4.259-1.426 6.011-.95 1.75-2.354 3.127-4.207 4.128-1.853 1.001-4.138 1.502-6.851 1.502h-6.606l-.014 9.086a3.59 3.59 0 0 0 2.559 3.437c.34.016.682.026 1.025.026 12.269 0 22.213-9.944 22.213-22.213C44.426 9.945 34.482 0 22.213 0Z"></path></svg>
        </v-list-item-icon>
        <v-list-item-title>
          <a class="none" :href="'https://polkachu.com/'+chain+'/thousand_validators/'+candidate.stash" target="_blank">
            polkachu
          </a>
        </v-list-item-title>
      </v-list-item>

    </v-list>
  </v-menu>

</template>

<script lang="ts">
import { mapState } from 'vuex'
export default {
  name: 'CandidateExternalLinks',
  props: ['candidate'],
  computed: {
    ...mapState(['chain'])
  }
}
</script>

<style scoped>
.polkastats-logo {
    width: 95px;
    height: 18px;
    margin-right: -655px;
}

.cls-1{
  height: 24px;
  font-size: large;
  fill:#000000;
}
</style>
