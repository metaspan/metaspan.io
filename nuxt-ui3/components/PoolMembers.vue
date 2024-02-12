<template>
  <div>
    <v-toolbar elevation="0">
      <v-toolbar-title>Pool Members</v-toolbar-title>
    </v-toolbar>
    <!-- <PoolMemberTable class="d-none d-sm-block" :list="items" /> -->
    <PoolMemberList :list="list" />

    <Loading :loading="loading" :absolute="true" :size="75"></Loading>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, type PropType } from 'vue'

import Loading from './Loading.vue'
// import PoolMemberTable from './PoolMemberTable.vue'
import PoolMemberList from './PoolMemberList.vue'
// import { GET_POOL_MEMBERS } from '../graphql/queries/pools'
import { type IPoolMember } from '@/types/global'

export default defineComponent({
  props: {
    // poolId: {
    //   type: String,
    //   required: true
    // },
    members: {
      type: Array as PropType<IPoolMember[]>,
      required: true
    }
  },
  components: {
    // ClickToCopy,
    // PoolMemberTable,
    PoolMemberList,
    Loading
  },
  setup (props) {
    const store = useStore()
    const chainId = computed(() => store.chainId)
    const substrateStore = useSubstrateStore()
    const decimals = computed(() => substrateStore.decimals)
    const chainInfo = computed(() => substrateStore.chainInfo)
    const list = ref<IPoolMember[]>([] as IPoolMember[])
    const tokenSymbol = computed(() => chainInfo.value.tokenSymbol)

    const loading = ref(false)
    const headers = [
      { text: 'Member', value: 'accountId' },
      // { text: 'Id.', value: 'identity' },
      { text: 'Points', value: 'points', align: 'right' },
      // { text: '1KV', value: 'is1kv', width: '15px', align: 'right' },
      { text: '#', value: 'menu', width: '15px', align: 'right' }
    ]
    watch(() => props.members, (newVal: IPoolMember[]) => {
      if (newVal !== undefined) list.value = newVal
    })

    return {
      store,
      chainId,
      decimals,
      chainInfo,
      tokenSymbol,
      headers,
      loading,
      list
    }
  }
})
</script>
