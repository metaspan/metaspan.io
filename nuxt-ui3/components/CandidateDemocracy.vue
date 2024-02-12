<template>
  <v-card>
    <v-card-title>Democracy</v-card-title>
    <v-card-text>
      <!-- {{chainInfo}} -->
      <!-- {{democracy.direct}} -->

      <v-list>
        <v-list-item v-for="item in democracy.direct?.votes" v-bind:key="item[0]">
          {{item[0]}}, {{item[1]}} {{ formatAmount(item[1].standard?.balance) }} {{tokenSymbol}}
        </v-list-item>
      </v-list>

      {{democracy.delegations}}
      {{democracy.prior}}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeMount } from 'vue'
import type { IChainInfo } from '~/types/global'

export default defineComponent({
  name: 'CandidateDemocracy',
  props: {
    stash: {
      type: String
    }
  },
  setup (props) {
    const candidateStore = useCandidateStore()
    const substrateStore = useSubstrateStore()

    const chainInfo = computed<IChainInfo>(() => substrateStore.chainInfo)
    const decimals = computed(() => substrateStore.decimals)
    const democracy = computed(() => candidateStore.democracy)
    const tokenSymbol = computed(() => {
      return chainInfo.value.tokenSymbol[0] || '???'
    })
    onBeforeMount(() => {
    // TODO get this from the chain
      // store.dispatch('candidate/getDemocracy', { stash: props.stash })
      candidateStore.getDemocracy({ stash: props.stash })
    })
    return {
      chainInfo,
      decimals,
      democracy,
      tokenSymbol
    }
  },
  methods: {
    formatAmount (amount: number) {
      // console.debug('formatAmount', amount, this.chainInfo.tokenDecimals.toJSON()[0])
      // {"ss58Format":2,"tokenDecimals":[12],"tokenSymbol":["KSM"]}
      const tokenDecimals = this.chainInfo.tokenDecimals //[0] || 1
      console.debug('', tokenDecimals)
      const denom = this.decimals[tokenDecimals]
      return (amount / denom).toFixed(4)
    }
  }
})
</script>
