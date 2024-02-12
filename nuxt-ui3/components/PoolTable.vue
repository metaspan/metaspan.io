<template>
  <v-table>
    <thead>
      <th v-for="(head, idx) in headers" :key="idx">
        {{ head.text }}
      </th>
    </thead>
    <tbody>
      <tr v-for="(item, idx) in list" :key="idx" @click="onClickRow">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.state }}</td>
        <td>{{ item.memberCounter }}</td>
        <td>{{ toCoin(item.points) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    loading: {
      type: Boolean
    }
  },
  emits: ['clickRow'],
  setup (props, { emit }) {

    const poolStore = usePoolStore()
    const list = computed(() => poolStore.list)
    const substrateStore = useSubstrateStore()
    const decimals = computed(() => substrateStore.decimals)
    const chainInfo = computed(() => substrateStore.chainInfo)
    const headers = [
        { text: 'id', value: 'id' },
        { text: 'name', value: 'name' },
        { text: 'state', value: 'state' },
        { text: 'memberCounter', value: 'memberCounter' },
        { text: 'points', value: 'points', align: 'right' }
      ]

    const onClickRow = (event: any) => {
      console.log('PoolTable.vue: onClickRow()', event)
      emit('clickRow', event)
    }
    const toCoin = (v: number): string => {
      // console.debug('toCoin()', v)
      // return v / 1000000000000
      // console.debug('CandidateBalance.vue: toCoin()', v, this.chainInfo)
      // console.debug('decimals', this.chainInfo?.tokenDecimals?.toJSON()[0])
      const decimalPlaces = chainInfo.value?.tokenDecimals || 0
      // console.debug('decimalPlaces', decimalPlaces)
      return ((v || 0) / decimals.value[decimalPlaces]).toFixed(4)
    }

    return {
      headers,
      onClickRow,
      toCoin
    }
  }
})
</script>
