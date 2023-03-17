<template>
  <v-list
    :headers="headers"
    :items="list"
    @click:row="clickRow">

    <v-list-item v-for="item in list" v-bind:key="item.id">
      <v-list-item-content>
        <v-list-item-title>
          {{ shortStash(item.accountId) }}
        </v-list-item-title>
        <v-list-item-subtitle>
            Points: {{ toCoin(item.points) }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <AccountLink :accountId="item.accountId" text="link" />
      </v-list-item-action>
    </v-list-item>

  </v-list>

</template>

<script lang="ts">
import { IPool } from '@/types/global'
import { defineComponent } from 'vue'
import { mapState, mapGetters } from 'vuex'
import AccountLink from './AccountLink.vue'
import { shortStash } from '@/global/utils'

interface IData {
  // loading: boolean
  headers: any[]
}
interface IMethods {
  clickRow (item: IPool): void
  // shortStash (stash: string): string
  toCoin(value: number): string
  // getMembers (): void
}
interface IComputed {
  chainId: string
  chainInfo: any // IChainInfo
  decimals: Record<number, number>
  // mapItems: any[]
  // totalNominations: string
  // tokenSymbol: string
}
interface IProps {
  // poolId: number
  list: any[] // IPool[]
}

export default defineComponent({
  name: 'PoolMemberList',
  components: {
    AccountLink
  },
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapState(['chainId']),
    ...mapState('substrate', ['decimals']),
    ...mapGetters('substrate', ['chainInfo'])
  },
  data () {
    return {
      items: [],
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
    toCoin (v) {
      // console.debug('CandidateNominators.vue', this.chainInfo)
      const decimalPlaces = this.chainInfo?.tokenDecimals?.toJSON()[0] || 0
      // const denom = this.denoms[this.chainInfo.tokenDecimals]
      return (v / this.decimals[decimalPlaces]).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
    },
    clickRow (item) {
      this.$emit('clickRow', item)
    }
  }
})
</script>
