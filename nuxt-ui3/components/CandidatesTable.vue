<template>

  <!-- <v-data-table dense
    :loading="loading"
    :headers="headers"
    :items="items"
    :page="options.page"
    :items-per-page="options.itemsPerPage"
    :sort-by="options.sortBy"
    :sort-desc="options.sortDesc"
    item-key="id"
    loading-text="Loading candidates..."
    @pagination="handlePaginate"
    @update:options="handleOptions"
    @update:page="handlePage"
    @update:items-per-page="handleItemsPerPage"
    :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"> -->
  <v-table>
    <thead>
      <th v-for="(head, idx) in headers" v-bind:key="idx">
        {{ head.text }}
      </th>
    </thead>
    <tbody>
      <tr v-for="(item, idx) in items" v-bind:key="idx">
        <td>{{ item.favourite }}</td>
        <td>
          <span class="identicon">
            <Identicon :value="item.stash" :size="16" theme="polkadot"></Identicon>
          </span> {{ item.name }}
        </td>
        <td>{{ item.identity_name }}</td>
        <td>{{ item.discoveredAt }}</td>
        <td>
          <div align="center">
            <v-icon small :color="item.valid?'green':'red'">mdi-{{ item.valid ? 'check-circle' : 'close-circle'}}</v-icon>
          </div>
        </td>
        <td>
          <v-icon small :color="item.active?'green':'grey'">mdi-{{ item.active ? 'check-circle' : 'minus-circle'}}</v-icon>
        </td>
        <td>
          <v-icon small :color="item.nominated_1kv?'green':'grey'">mdi-{{ item.nominated_1kv ? 'check-circle' : 'minus-circle'}}</v-icon>
        </td>
        <td>{{ item.rank }}</td>
        <td>
          {{item.score ? item.score.toFixed(2) : 0.00 }}
        </td>
      </tr>
    </tbody>

    <!-- <template v-slot:[`item.favourite`]="{item}">
      <v-btn small icon @click="toggleFav(item)">
      <v-icon small :color="item.favourite?'orange':'grey'">mdi-star</v-icon>
      </v-btn>
    </template> -->

    <!-- <template v-slot:[`item.name`]="{item}">
      <div style="cursor:pointer" @click="clickItem(item)">
        <span class="identicon">
          <Identicon :value="item.stash" :size="16" theme="polkadot"></Identicon>
        </span> {{item.name}}
      </div>
    </template> -->

    <!-- <template v-slot:[`item.identity_name`]="{item}">
      <div style="cursor:pointer" @click="clickItem(item)">
        {{item.identity_name}}
      </div>
    </template> -->

    <!-- <template v-slot:[`item.discoveredAt`]="{item}">
      {{timeAgo(item.discoveredAt) }}
    </template> -->

    <!-- <template v-slot:[`item.valid`]="{item}">
      <div align="center">
      <v-icon small :color="item.valid?'green':'red'">mdi-{{ item.valid ? 'check-circle' : 'close-circle'}}</v-icon>
      </div>
    </template> -->

    <!-- <template v-slot:[`item.active`]="{item}">
      <v-icon small :color="item.active?'green':'grey'">mdi-{{ item.active ? 'check-circle' : 'minus-circle'}}</v-icon>
    </template> -->

    <!-- <template v-slot:[`item.nominated_1kv`]="{item}">
      <v-icon small :color="item.nominated_1kv?'green':'grey'">mdi-{{ item.nominated_1kv ? 'check-circle' : 'minus-circle'}}</v-icon>
    </template> -->

    <!-- <template v-slot:[`item.score`]="{item}">
      {{item.score ? item.score.toFixed(2) : 0.00 }}
    </template> -->

  <!-- </v-data-table> -->

  </v-table>

</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onBeforeMount } from 'vue'

import moment from 'moment'
// import Identicon from '@polkadot/vue-identicon'
import Identicon from './identicon/Identicon.vue'
import { type ICandidate, type ICandidateValidityItem } from '../types/global'
// import { VDataTable } from 'vuetify/labs/VDataTable'

import { type IOptions } from '../stores/candidate'

interface IFilter {
  favourite: boolean
  rank: string
  score: number
  valid: boolean
  // eslint-disable-next-line
  nominated_1kv: boolean
  active: boolean
}

// eslint-disable-next-line
interface IPaginate {}

interface IFilteredListItem {
  favourite: boolean
  stash: string
  name: string
  discoveredAt: string | number | Date
  identity_name: string
  valid: boolean
  nominated_1kv: boolean
  active: boolean
  rank: number | undefined
  score: number | undefined
}

export default defineComponent({
  props: {
    search: { type: String },
    filter: { type: Object }
  },
  components: {
    // VDataTable,
    Identicon
  },
  setup () {
    const store = useStore()
    const candidateStore = useCandidateStore()
    const chainId = computed(() => store.chainId)
    const filtering = computed<boolean>(() => candidateStore.filtering)
    const updatedAt = computed(() => candidateStore.updatedAt)
    const filteredList = computed<ICandidate[]>(() => candidateStore.filteredList)
    const favourites = computed<string[]>(() => candidateStore.favourites)
    const loading = computed<boolean>(() => candidateStore.loading)

    const options = ref<IOptions>({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: []
    })
    const xfilter = ref({
      favourite: false,
      rank: '',
      score: 0,
      valid: false,
      active: false,
      nominated_1kv: false
    })

    const headers: any[] = [
        {
          text: 'Favourite',
          align: 'center',
          sortable: true,
          value: 'favourite',
          width: '5%',
          // eslint-disable-next-line
          filter: (value: any) => {
            if (xfilter.value.favourite) return value
            else return true
          }
        },
        { text: 'Name', align: null, sortable: true, value: 'name', width: '15%' },
        { text: 'Identity', align: null, sortable: true, value: 'identity_name', width: '15%' },
        { text: 'Discovered', align: null, sortable: true, value: 'discoveredAt', width: '10%' },
        {
          text: 'Valid',
          align: 'center',
          sortable: true,
          value: 'valid',
          width: '5%',
          filter: (value: boolean) => {
            // console.debug(this.xfilter, value)
            return (xfilter.value.valid) ? value === true : true
          }
        },
        {
          text: 'Nom. (1kv)',
          align: 'center',
          sortable: true,
          value: 'nominated_1kv',
          width: '5%',
          filter: (value: boolean) => {
            // console.debug(this.xfilter, value)
            return (xfilter.value.nominated_1kv) ? value === true : true
          }
        },
        {
          text: 'Active',
          align: 'center',
          sortable: true,
          value: 'active',
          width: '5%',
          filter: (value: boolean) => {
            // console.debug(this.xfilter, value)
            return (xfilter.value.active) ? value === true : true
          }
        },
        {
          text: 'Rank',
          align: 'center',
          sortable: true,
          value: 'rank',
          width: '5%',
          filter: (value: number) => {
            if (!xfilter.value.rank) return true
            return value >= parseInt(xfilter.value.rank)
          }
        },
        {
          text: 'Score',
          align: 'center',
          sortable: true,
          value: 'score',
          width: '5%',
          filter: (value: number) => {
            if (!xfilter.value.score) return true
            // return value >= parseInt(this.xfilter.score)
            return value >= xfilter.value.score
          }
        }
      ]
    const items = computed(() => {
      const list = filteredList.value // as ICandidate[]
      const newList = list.map((item: ICandidate, idx: number): IFilteredListItem => {
        return {
          id: `${item.stash}-${idx}`,
          favourite: favourites.value.includes(item.stash),
          stash: item.stash,
          name: item.name,
          identity_name: item.identity.name,
          discoveredAt: item.discoveredAt,
          valid: item.valid,
          nominated_1kv: item.nominated_1kv,
          active: item.active,
          rank: item.rank,
          score: item.score?.total
        } as IFilteredListItem
      }) //as IFilteredListItem[]
      return newList
    })

    const toggleFav  = (item: IFilteredListItem) => {
      // store.dispatch('candidate/toggleFav', { stash: item.stash })
      candidateStore.toggleFav({ chain: chainId.value, stash: item.stash })
    }
    /** @deprecated */
    const handlePaginate  = (evt: IPaginate) => {
      // console.debug(evt)
      // store.dispatch('candidate/paginate', { pagination: evt })
      // candidateStore.paginate({ pagination: evt })
      console.warn('DEPRICATED: handlePaginate()')
    }

    const fetchOptions = (chainId: string) => {
      options.value = candidateStore.options // .candidate[chainId]?.options || {} as any
      console.debug('fetchOptions', chainId, chainId, options.value)
    }

    const handleOptions = (evt: IOptions) => {
      console.debug('CandidatesTable.vue: ', evt)
      // store.dispatch('candidate/handleOptions', { options: evt })
      candidateStore.handleOptions(evt)
    }

    watch(() => chainId.value, newVal => {
      fetchOptions(newVal)
    })

    onBeforeMount(() => {
      console.debug('CandidatesTable.vue: created()', chainId, candidateStore.options)
      fetchOptions(chainId.value)
    })

    return {
      headers,
      items,
      chainId,
      loading,
      filtering,
      updatedAt,
      filteredList,
      favourites,
      options,
      xfilter,
      toggleFav,
      handlePaginate,
      fetchOptions,
      handleOptions
    }
  },
  methods: {
    isValid (items: ICandidateValidityItem[]) {
      const invalid = items.find((i: ICandidateValidityItem) => i.valid === false)
      return !invalid
    },
    timeAgo (d: string): string {
      return moment(d).fromNow()
    },
    clickItem (item: IFilteredListItem) {
      this.$emit('click-item', item)
    },
    handlePage (evt: any) {
      if (!evt) console.debug(evt)
    },
    handleItemsPerPage (evt: any) {
      console.debug(evt)
    },
  }
})
</script>

<style scoped>
.identicon {
    width: 18px;
    max-width: 18px;
    height: 18px;
    max-height: 18px;
    /* white-space:nowrap; */
    display: inline-block;
}
</style>
