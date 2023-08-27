<template>
  <v-list lines="two">
    <template v-for="item in list" v-bind:key="item.id">
      <v-list-item @click="onClickRow(item, $event)">
        <template v-slot:prepend>
          <v-avatar size="small">
            {{item.id}}
          </v-avatar>
        </template>
        <v-list-item-title> {{item.name}}</v-list-item-title>
        <v-list-item-subtitle>
          {{item.state}}: {{item.memberCounter}} members, {{toCoin(item.points)}} {{tokenSymbol}}<br>
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
import { defineComponent } from 'vue'
import { mapGetters, mapState } from 'vuex'

export default defineComponent({
  name: 'PoolList',
  computed: {
    ...mapState(['chainId']),
    ...mapGetters('pool', ['list']),
    ...mapState('substrate', ['decimals']),
    ...mapGetters('substrate', ['chainInfo']),
    tokenSymbol () {
      return this.chainId === 'kusama' ? 'KSM' : 'DOT'
    }
  },
  methods: {
    onClickRow (item: any, event: any) {
      console.log('PoolList.vue: onClickRow()', item, event)
      this.$emit('clickRow', item)
    },
    getCommission (item: any): any[] {
      const [commission, target] = item?.commission?.current || [0, '']
      return [commission/10000000, target]
    },
    toCoin (v: number): string {
      // console.debug('toCoin()', v)
      // return v / 1000000000000
      // console.debug('CandidateBalance.vue: toCoin()', v, this.chainInfo)
      // console.debug('decimals', this.chainInfo?.tokenDecimals?.toJSON()[0])
      // const decimalPlaces = this.chainInfo?.tokenDecimals?.toJSON()[0] || 0
      // console.debug('decimalPlaces', decimalPlaces)
      const denom = this.chainId === 'kusama' ? 1000000000000 : 10000000000
      return ((v || 0) / denom).toFixed(4)
    }

  }
})
</script>
