<template>
  <v-list>
    <v-list-item v-for="item in list" v-bind:key="item.id" @click="onClickRow(item, $event)">
      <v-list-item-content>
        <v-list-item-title>{{item.id}}. {{item.name}}</v-list-item-title>
        <v-list-item-subtitle>
          {{item.state}}: {{item.memberCounter}} members, {{toCoin(item.points)}} {{chainInfo.tokenSymbol}}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'

export default Vue.extend({
  name: 'PoolList',
  props: {
    // list: {
    //   type: Object
    // }
  },
  computed: {
    // ...mapState(['chainId']),
    ...mapGetters('pool', ['list']),
    ...mapState('substrate', ['decimals']),
    ...mapGetters('substrate', ['chainInfo'])

  },
  methods: {
    onClickRow (item, event) {
      console.log(item, event)
      this.$emit('clickRow', item)
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
