<template>

  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Validator Selector ({{chainId}} / {{stash}})</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-toolbar-items>
        <v-btn small>{{filteredList.length}} of {{count}} vals.</v-btn>
        <v-btn small icon @click="reload()"><v-icon>mdi-refresh</v-icon></v-btn>
        <v-btn small icon @click="calcNominations()"><v-icon>mdi-start</v-icon></v-btn>
      </v-toolbar-items> -->
    </v-toolbar>

    <v-card>
      <v-card-text>
        Stash: {{stash}} <br>
        Is 1KV: {{valIs1kv(stash)}} <br>
        ID: {{ getId() }}
      </v-card-text>
    </v-card>

    <Loading :loading="loading"></Loading>
  </v-container>

</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onBeforeMount, inject } from 'vue'
// import Vue from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { hexToString } from '@polkadot/util'
import { IValidator, ICandidate, IChainInfo } from '../types/global'
import Loading from './Loading.vue'
import axios from 'axios'
import { SubstrateAPI } from '@/plugins/substrate'

type TF = ReturnType<typeof setInterval>

export default defineComponent({
  name: 'ValidatorSelector',
  components: {
    Loading
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const substrate = inject<SubstrateAPI>('$substrate') || new SubstrateAPI({ lite: false})

    const chainId = computed(()=> store.state.chainId)
    const decimals = computed(() => store.state['substrate/decimals'])
    const chainInfo = computed(() => store.getters['substrate/chainInfo'])
    const candidates = computed<ICandidate[]>(() => store.getters['candidate/list'])

    const stash = ref('')
    const candidate = ref<ICandidate>({} as ICandidate)
    const list = ref<IValidator[]>([])
    const validator = ref<IValidator>({} as IValidator)
    const multiplier = ref(10000000)
    const is1kv = ref(false)
    const hasId = ref(false)
    const loading = ref(false)

    const calcNominations = async () => {
      // this.filteredList.forEach((v: IValidator) => {
      console.debug(chainInfo.value)
      const decimalPlaces = chainInfo.value.tokenDecimals?.toJSON()[0] || 0
      // const denom = this.decimals[this.chainInfo.toJSON().tokenDecimals]
      let nomBal = 0
      console.debug('checking noms for', stash.value)
      for (let i = 0; i < validator.value.nominators?.length || 0; i++) {
        // if (i > 2) continue
        const nom = validator.value.nominators[i]
        const bal: any = await substrate.api?.query.system.account(nom)
        nomBal += bal.data.miscFrozen.toNumber() / decimals.value[decimalPlaces]
        console.debug(nom, bal.data.miscFrozen.toNumber() / decimals.value[decimalPlaces])
      }
      console.debug(validator.value.stash, 'has', nomBal, 'in nominations')
    }

    onBeforeMount(() => {
      console.debug(route)
      stash.value = route.params.stash.toString()
      store.dispatch('selector/setValidator', stash.value)
    })

    return {
      chainId,
      decimals,
      chainInfo,
      list,
      candidates,
      stash,
      candidate,
      validator,
      multiplier,
      is1kv,
      hasId,
      loading,
      calcNominations
    }
  },
  methods: {
    async loadValidator () {
      console.debug('ValidatorSelector.vue: loadValidators()', this.chainId)
      this.loading = true
      this.candidates = []
      let ret = await axios.get(`https://api.metaspan.io/api/${this.chainId}/candidate`)
      this.candidates = ret.data
      this.list = []
      // await this.$substrate[this.chainId].isReady
      const limit = 50 // hard-coded in api...
      // let offset = 0
      ret = await axios.get(`https://api.metaspan.io/api/${this.chainId}/validator/${this.stash}`)
      this.validator = ret.data
      this.loading = false
    },
    load () {
      this.loadValidator()
    },
    parseId (id: any) {
      console.debug('parseId', id)
      if (id) {
        return id.name + '/' + id.sub
      } else {
        return ''
      }
    },
    getId () {
      this.candidate = this.candidates.find(f => f.stash === this.stash) || {} as ICandidate
      console.debug('identity', this.candidate?.identity)
      return this.parseId(this.candidate?.identity)
    },
    toNumber (value: any): number {
      if (typeof value === 'string') {
        return Number(BigInt(value))
      } else {
        return Number(value)
      }
    },
    valIs1kv (stash: string) {
      const found = this.candidates.find((c: ICandidate) => c.stash === stash)
      return !!found
    }
  },
  mounted () {
    this.calcNominations()
  },
  beforeDestroy () {
    // if (this.interval) clearInterval(this.interval)
  }
})
</script>
