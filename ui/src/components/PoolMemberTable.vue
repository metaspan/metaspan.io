<template>
  <v-data-table
    :headers="headers"
    :items="list"
    @click:row="clickRow">

    <template v-slot:[`item.accountId`]="{item}">
      <div style="cursor:pointer" @click="clickRow(item)">
        <!-- <ClickToCopy :display="item.shortStash" :text="item.accountId" /> -->
        {{item.accountId}}
        <!-- <AccountLink :accountId="item.accountId" /> -->
      </div>
    </template>

    <template v-slot:[`item.points`]="{item}">
      {{ toCoin(item.points) }}
    </template>

    <template v-slot:[`item.menu`]="{item}">
      <!-- <a :href="`https://${chainId}.subscan.io/account/${item.accountId}`" target="_blank">[link]</a> -->
      <AccountLink :accountId="item.accountId" text="link" />
    </template>

  </v-data-table>

</template>

<script lang="ts">
import { IPool } from '@/types/global'
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import AccountLink from './AccountLink.vue'

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

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'PoolMemberTable',
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
    // mapItems () {
    //   // return this.items
    //   console.log(this.list)
    //   return this.list.map((m: any) => {
    //     m.shortStash = this.$utils.shortStash(m.accountId)
    //     m.balance = this.toCoin(m.account.data.free)
    //     return m
    //   })
    // }
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
