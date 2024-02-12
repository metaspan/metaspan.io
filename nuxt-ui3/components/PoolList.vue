<template>
  <v-list lines="two">
    <template v-for="item in list" v-bind:key="item.id">
      <v-list-item @click="onClickRow(item, $event)">
        <template v-slot:prepend>
          <v-avatar size="small">
            {{item.id}}
          </v-avatar>
        </template>
        <v-list-item-title> {{ item.name }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ item.state }}: {{ item.members?.length || 0 }} members, {{ toCoin(item.points || 0) }} {{ tokenSymbol }}<br>
          Commission: {{ getCommission(item)[0] }}%
        </v-list-item-subtitle>
        <template v-slot:append>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-list-item>
      <v-divider></v-divider>
    </template>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'PoolList',
  emits: ['clickRow'],
  setup (_, { emit }) {
    const store = useStore()
    const chainId = computed(() => store.chainId)
    const poolStore = usePoolStore()
    const list = computed(() => poolStore.list)
    const substrateStore = useSubstrateStore()
    const decimals = computed(() => substrateStore.decimals)
    const chainInfo = computed(() => substrateStore.chainInfo)
    const tokenSymbol = () => {
      return chainId.value === 'kusama' ? 'KSM' : 'DOT'
    }

    const onClickRow = (item: any, event: any) => {
      console.log('PoolList.vue: onClickRow()', item, event)
      emit('clickRow', item)
    }

    const getCommission = (item: any): any[] => {
      const [commission, target] = item?.commission?.current || [0, '']
      return [commission/10000000, target]
    }

    const toCoin = (v: number): string => {
      // console.debug('toCoin()', v)
      // return v / 1000000000000
      // console.debug('CandidateBalance.vue: toCoin()', v, this.chainInfo)
      // console.debug('decimals', this.chainInfo?.tokenDecimals?.toJSON()[0])
      // const decimalPlaces = this.chainInfo?.tokenDecimals?.toJSON()[0] || 0
      // console.debug('decimalPlaces', decimalPlaces)
      const denom = chainId.value === 'kusama' ? 1000000000000 : 10000000000
      return ((v || 0) / denom).toFixed(4)
    }

    return {
      list,
      chainId,
      chainInfo,
      tokenSymbol,
      onClickRow,
      getCommission,
      toCoin
    }
  }
})
</script>
