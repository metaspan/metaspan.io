<template>
  <client-only>
  <v-list
    :headers="headers"
    :items="list"
    @click:row="clickRow">

    <v-list-item v-for="item in list" v-bind:key="item.accountId">
      <v-list-item-title>
        {{ shortStash(item.accountId) }}
      </v-list-item-title>
      <v-list-item-subtitle>
          Points: {{ toCoin(item.points) }}
      </v-list-item-subtitle>

      <template v-slot:append>
        <AccountLink :chain-id="chainId" :accountId="item.accountId" text="link" />
      </template>
    </v-list-item>

  </v-list>
  </client-only>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import AccountLink from './AccountLink.vue'
import { type IPoolMember } from '@/types/global'

export default defineComponent({
  name: 'PoolMemberList',
  components: {
    AccountLink
  },
  props: {
    list: {
      type: Object as PropType<IPoolMember[]>, 
      required: true
    }
  },
  emits: ['clickRow'],
  setup (_, context) {
    const store = useStore()
    const substrateStore = useSubstrateStore()
    const chainId = computed(() => store.chainId)
    const decimals = computed(() => substrateStore.decimals)
    const chainInfo = computed(() => substrateStore.chainInfo)
    const headers = [
      { text: 'Member', value: 'accountId' },
      // { text: 'Id.', value: 'identity' },
      { text: 'Points', value: 'points', align: 'right' },
      // { text: '1KV', value: 'is1kv', width: '15px', align: 'right' },
      { text: '#', value: 'menu', width: '75px', align: 'right', sortable: false }
    ]
    const toCoin = (v: any) => {
      console.debug('CandidateNominators.vue', chainInfo.value)
      const decimalPlaces = chainInfo.value?.tokenDecimals || 0
      const denom = chainId.value === 'kusama' ? 1000000000000 : 10000000000
      return (v / denom).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
    }
    const clickRow = (item: any) => {
      context.emit('clickRow', item)
    }

    return {
      shortStash,
      store,
      chainId,
      decimals,
      chainInfo,
      headers,
      toCoin,
      clickRow,
    }
  }
})
</script>
