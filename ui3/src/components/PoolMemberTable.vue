<template>
  <v-data-table
    :headers="headers"
    :items="list"
    @click:row="clickRow">

    <template v-slot:item.accountId="{ item }">
      <div style="cursor:pointer" @click="clickRow(item)">
        <!-- <ClickToCopy :display="item.shortStash" :text="item.accountId" /> -->
        {{ item.columns.accountId }}
        <!-- <AccountLink :accountId="item.accountId" /> -->
      </div>
    </template>

    <template v-slot:item.points="{ item }">
      {{ toCoin(item.columns.points) }}
    </template>

    <template v-slot:item.menu="{ item }">
      <!-- <a :href="`https://${chainId}.subscan.io/account/${item.accountId}`" target="_blank">[link]</a> -->
      <AccountLink :accountId="item.columns.accountId" text="link" />
    </template>

  </v-data-table>

</template>

<script lang="ts">
import { defineComponent, computed, ref, defineEmits, PropType } from 'vue'
import { useStore } from 'vuex'
import { IPoolMember } from '@/types/global'
import AccountLink from './AccountLink.vue'
// import { VDataTable } from 'vuetify/lib/labs/components.mjs'

export default defineComponent({
  name: 'PoolMemberTable',
  components: {
    // VDataTable,
    AccountLink
  },
  props: {
    list: {
      type: Array as PropType<IPoolMember[]>,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const chainId = computed(() => store.state.substrate.chainId)
    const chainInfo = computed(() => store.state.substrate.chainInfo)
    const decimals = computed(() => store.state.substrate.decimals)
    const emit = defineEmits(['clickRow'])
    const headers = ref([
      { title: 'Member', key: 'accountId' },
      // { text: 'Id.', value: 'identity' },
      { title: 'Points', key: 'points' }, // , align: 'right' },
      // { text: '1KV', value: 'is1kv', width: '15px', align: 'right' },
      { title: '#', key: 'menu' }, // , width: '75px', align: 'right', sortable: false }
    ])
    const toCoin = (v: any) => {
      // console.debug('CandidateNominators.vue', this.chainInfo)
      const decimalPlaces = chainInfo.value?.tokenDecimals?.toJSON()[0] || 0
      // const denom = this.denoms[this.chainInfo.tokenDecimals]
      return (v / decimals.value[decimalPlaces]).toLocaleString('en-GB', { maximumFractionDigits: 4 }) // .toFixed(4)
    }
    const clickRow = (item: any) => {
      emit('clickRow', item)
    }

    return {
      chainId,
      chainInfo,
      decimals,
      headers,
      toCoin,
      clickRow
    }
  },
})
</script>
