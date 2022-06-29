<template>

  <v-list :loading="filtering">
    <!-- <v-list-item>
        |{{search}}|
    </v-list-item> -->
    <!-- {{filter}} -->
    <!-- {{ favourites }} -->
    <!-- {{filtering}} -->
    <v-list-item two-line v-for="item in filteredList" v-bind:key="item.stash">

      <!-- <v-list-item-avatar>
        <Identicon :value="item.stash" :size="36" theme="polkadot"></Identicon>
      </v-list-item-avatar> -->

      <v-list-item-content @click="clickItem(item)" style="cursor: pointer" three-line>
        <v-list-item-title>
          <span class="identicon">
            <Identicon :value="item.stash" :size="16" theme="polkadot"></Identicon>
          </span>
          {{item.name}} {{item.identity ? `/ ${item.identity.name}` : ''}}
        </v-list-item-title>
        <v-list-item-subtitle>Score: {{ getScore(item) }}, Rank: {{item.rank}}</v-list-item-subtitle>
        <div>
          <v-chip x-small :color="isValid(item.validity)?'green':'red'">Valid&nbsp;<v-icon class="d-none d-sm-inline" x-small dark>mdi-{{ isValid(item.validity) ? 'check-circle' : 'close-circle'}}</v-icon></v-chip>
          &nbsp;<v-chip x-small :color="item.active?'green':'grey'">Active&nbsp;<v-icon class="d-none d-sm-inline" x-small dark>mdi-{{ item.active ? 'check-circle' : 'minus-circle'}}</v-icon></v-chip>
        </div>
        <!-- Discovered: {{timeAgo(item.discoveredAt)}} -->
      </v-list-item-content>

      <v-list-item-action @click="toggleFav(item)">
        <!-- <v-list-item-action-text>Fav</v-list-item-action-text> -->
        <v-btn icon><v-icon :color="isFavourite(item.stash)?'orange':'grey'">mdi-star</v-icon></v-btn>
      </v-list-item-action>

      <v-list-item-action class="d-none d-sm-block" @click="clickItem(item)">
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item-action>

    </v-list-item>

  </v-list>

</template>

<script lang="ts">
import moment from 'moment-timezone'
import { mapState } from 'vuex'
import Identicon from '@polkadot/vue-identicon'
import Vue from 'vue'
import { ICandidate, ICandidateListFilter, ICandidateValidityItem } from '../types/global'

// eslint-disable-next-line
interface IData {
  // options: any
}

// interface IProps {
//   search: string
// }

interface IMethods {
  // eslint-disable-next-line
  clickItem (item: any): void
  isFavourite(stash: string): boolean
  // eslint-disable-next-line
  toggleFav (item: any): void
  // eslint-disable-next-line
  timeAgo (d: any): string
  getScore (v: ICandidate): string|number
  isValid (items: ICandidateValidityItem[]): boolean
}

interface IComputed {
  filteredList: ICandidate[]
  filter: ICandidateListFilter
  loading: boolean
  filtering: boolean
  favourites: string[]
  // items: any[]
}

export default Vue.extend<IData, IMethods, IComputed>({
  name: 'CandidatesList',
  components: {
    Identicon
  },
  computed: {
    ...mapState('candidate', ['filteredList', 'filter', 'loading', 'filtering', 'favourites'])
  },
  data () {
    return {
      // options: {}
    }
  },
  methods: {
    // eslint-disable-next-line
    clickItem (item: any) { this.$emit('click-item', item) },
    isFavourite (stash: string) {
      return this.favourites.includes(stash)
    },
    // eslint-disable-next-line
    toggleFav (item: any) {
      // console.debug('toggleFav', item.stash)
      this.$store.dispatch('candidate/toggleFav', item.stash)
    },
    // eslint-disable-next-line
    timeAgo (d: any): string {
      return moment(d).fromNow()
    },
    getScore (item: ICandidate): string|number {
      return (item.score && item.score.total) ? item.score.total.toFixed(2) : 0
    },
    isValid (items = []): boolean {
      const invalid = items.find(i => i.valid === false)
      return !invalid
    }
  }
})
</script>

<style scoped>
.identicon {
  width: 16px;
  max-width: 16px;
  /* white-space:nowrap; */
  display: inline-block;
}
</style>
