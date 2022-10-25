<template>
  <v-data-table
    :loading="loading"
    :items="list"
    :headers="headers"
    @click:row="onClickRow">

    <template v-slot:[`item.points`]="{ item }">
      {{ toCoin(item.points) }}
    </template>

  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

export default Vue.extend({
  props: {
    loading: {
      type: Boolean
    }
    // list: {
    //   type: Object
    // }
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
    onClickRow (event) {
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
