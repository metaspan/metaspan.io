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
import { defineComponent } from 'vue'
import { mapState, mapGetters } from 'vuex'

export default defineComponent({
  props: {
    loading: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters('pool', ['list']),
    ...mapState('substrate', ['decimals']),
    ...mapGetters('substrate', ['chainInfo'])
  },
  data () {
    return {
      headers: [
        { text: 'id', value: 'id' },
        { text: 'name', value: 'name' },
        { text: 'state', value: 'state' },
        { text: 'memberCounter', value: 'memberCounter' },
        { text: 'points', value: 'points', align: 'right' }
      ]
    }
  },
  methods: {
    onClickRow (event: any) {
      this.$emit('clickRow', event)
    },
    toCoin (v: number): string {
      // console.debug('toCoin()', v)
      // return v / 1000000000000
      // console.debug('CandidateBalance.vue: toCoin()', v, this.chainInfo)
      // console.debug('decimals', this.chainInfo?.tokenDecimals?.toJSON()[0])
      const decimalPlaces = this.chainInfo?.tokenDecimals?.toJSON()[0] || 0
      // console.debug('decimalPlaces', decimalPlaces)
      return ((v || 0) / this.decimals[decimalPlaces]).toFixed(4)
    }
  }
})
</script>
