<template>
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
        <AccountLink :accountId="item.accountId" text="link" />
      </template>
    </v-list-item>

  </v-list>

</template>

<script lang="ts">
import { IPool } from '../types/global'
import { defineComponent, computed, PropType } from 'vue'
import { useStore } from 'vuex'
import AccountLink from './AccountLink.vue'
import { shortStash } from '../global/utils'
import { IPoolMember } from '../types/global'

export default defineComponent({
  name: 'PoolMemberList',
  components: {
    AccountLink
  },
  props: {
    list: {
      // type: Array,
      type: Object as PropType<IPoolMember[]>, 
      required: true
    }
  },
  setup () {
    const store = useStore()
    const chainId = computed(() => store.state.chainId)
    const decimals = computed(() => store.state['substrate/decimals'])
    const chainInfo = computed(() => store.getters['substrate/chainInfo'])
    return {
      store,
      chainId,
      decimals,
      chainInfo
    }
  },
  data () {
    return {
      // items: [],
      headers: [
        { text: 'Member', value: 'accountId' },
        // { text: 'Id.', value: 'identity' },
        { text: 'Points', value: 'points', align: 'right' },
        // { text: '1KV', value: 'is1kv', width: '15px', align: 'right' },
        { text: '#', value: 'menu', width: '75px', align: 'right', sortable: false }
      ]
    }
  },
  methods: {
    shortStash: shortStash,
    toCoin (v: any) {
      // console.debug('CandidateNominators.vue', this.chainInfo)
      const decimalPlaces = this.chainInfo?.tokenDecimals?.toJSON()[0] || 0
      // const denom = this.denoms[this.chainInfo.tokenDecimals]
      const denom = this.chainId === 'kusama' ? 1000000000000 : 10000000000
      // return (v / this.decimals[decimalPlaces]).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
      return (v / denom).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
    },
    clickRow (item: any) {
      this.$emit('clickRow', item)
    }
  }
})
</script>
