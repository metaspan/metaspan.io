<template>
  <v-container :loading="loading" fluid>
    <v-toolbar flat dense>
      <v-toolbar-title>Validators</v-toolbar-title>
      <v-spacer></v-spacer>
        <v-btn>
        Updated: {{timeAgo(updatedAt)}}
        </v-btn>
        <v-btn :loading="loading" icon @click="getList()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
      <v-toolbar-items>
      </v-toolbar-items>
    </v-toolbar>

    <!-- {{xfilter}} -->
    <v-toolbar dense flat elevation="0">
      <!-- <v-spacer></v-spacer> -->
      <!-- <v-toolbar-items> -->
        <v-switch v-model="xfilter.favourite" label="Fav."></v-switch>
        <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
        <v-text-field v-model="xfilter.rank" label="Rank" class="mx-4"></v-text-field>
        <v-text-field v-model="xfilter.total" label="Total" class="mx-4"></v-text-field>
        <!-- <v-btn rounded> -->
          <v-switch v-model="xfilter.valid" label="Valid"></v-switch>
          <!-- <v-radio-group class='small-radio' v-model="xfilter.valid" label="Valid" row>
            <v-radio small label="All" value="0"></v-radio>
            <v-radio small label="Y" value="1"></v-radio>
            <v-radio small label="N" value="2"></v-radio>
          </v-radio-group> -->
        <!-- </v-btn> -->
        <!-- <v-btn rounded> -->
          <v-switch v-model="xfilter.active" label="Active"></v-switch>
          <!-- <v-radio-group v-model="xfilter.active" label="Active" row>
            <v-radio label="All" value="0"></v-radio>
            <v-radio label="Y" value="1"></v-radio>
            <v-radio label="N" value="2"></v-radio>
          </v-radio-group> -->
        <!-- </v-btn> -->
      <!-- </v-toolbar-items> -->
    </v-toolbar>

    <v-data-table dense :loading="loading"
      :headers="headers"
      :items="items"
      :page="options.page"
      :items-per-page="options.itemsPerPage"
      :sort-by="options.sortBy"
      :sort-desc="options.sortDesc"
      item-key="stash"
      :search="search"
      @pagination="handlePaginate"
      @update:options="handleOptions"
      @update:page="handlePage"
      @update:items-per-page="handleItemsPerPage">

      <!-- <template v-slot:top>
        <v-row>
          <v-col>
            <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="xfilter.rank" label="Rank" class="mx-4"></v-text-field>
          </v-col>
          <v-col>
            <v-radio-group style="border: 1px dotted grey" v-model="xfilter.valid" label="Valid" row>
              <v-radio label="All" value="0"></v-radio>
              <v-radio label="Y" value="1"></v-radio>
              <v-radio label="N" value="2"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col>
            <v-radio-group v-model="xfilter.active" label="Active" row>
              <v-radio label="All" value="0"></v-radio>
              <v-radio label="Y" value="1"></v-radio>
              <v-radio label="N" value="2"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </template> -->

      <template v-slot:[`item.favourite`]="{item}">
        <v-btn small icon @click="toggleFav(item)">
          <v-icon small :color="item.columns.favourite?'orange':'grey'">mdi-star</v-icon>
        </v-btn>
      </template>

      <template v-slot:[`item.name`]="{item}">
        <div style="cursor:pointer" @click="gotoValidator(item)">
          <Identicon class="identicon" :value="item.columns.stash" :size="16"></Identicon> &nbsp;&nbsp;
          <v-btn class="text-none">{{item.columns.name}}</v-btn>
        </div>
      </template>

      <template v-slot:[`item.discoveredAt`]="{item}">
        <!-- <div align="center"> -->
        {{timeAgo(item.columns.discoveredAt) }}
        <!-- </div> -->
      </template>

      <template v-slot:[`item.valid`]="{item}">
        <div align="center">
          <v-icon small :color="item.columns.valid?'green':'red'">mdi-{{ item.columns.valid ? 'check-circle' : 'close-circle'}}</v-icon>
        </div>
      </template>

      <template v-slot:[`item.active`]="{item}">
          <v-icon small :color="item.columns.active?'green':'grey'">mdi-{{ item.columns.active ? 'check-circle' : 'minus-circle'}}</v-icon>
      </template>

      <template v-slot:[`item.totalScore`]="{ item }">
        {{item.columns.total ? item.columns.total.toFixed(2) : 0.00 }}
      </template>

    </v-data-table>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, inject, onBeforeMount } from 'vue'
import moment from 'moment'
import { useStore } from 'vuex'
import { VDataTable } from 'vuetify/lib/labs/components.mjs'
// import { Identicon } from '@polkadot/vue-identicon'
import Identicon from './identicon/Identicon.vue'
import { IValidator } from '../types/global'
import { SubstrateAPI } from '@/plugins/substrate'
import { useRouter } from 'vue-router'

interface ITableItem {
  favourite: boolean
  stash: string
  name: string
  discoveredAt: number | Date
  valid?: boolean
  active?: boolean
  rank: number
  total: number
}

// eslint-disable-next-line
interface IOptions {
  page: number
  itemsPerPage: number
  sortBy: any[] // string[]
  sortDesc: string[]
}

interface IFilter {
  favourite: boolean
  valid: boolean
  active: boolean
  total: number | null
  rank: number | null
}

interface IVueTableHeader {
  text: string
  align?: string | null
  sortable?: boolean
  value: string
  width?: string
  // eslint-disable-next-line
  filter?: Function
}

export default defineComponent({
  name: 'Validators',
  components: {
    VDataTable,
    Identicon
  },
  props: {
    chain: {
      type: String,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const substrate = inject<SubstrateAPI>('$substrate') || new SubstrateAPI({ lite: false })

    const loading = computed<boolean>(() => store.state['validator/loading'])
    const list = computed<any[]>(() => store.state['validator/list'])
    // const list = ref<DataTableItem<ITableItem>[]>()
    const updatedAt = computed(() => store.state['validator/updatedAt'])
    const favourites = computed<string[]>(() => store.state['validator/favourites'])

    const dateTimeFormat = ref( 'YYYY/MM/DD hh:mm')
    const search = ref('')
    const options = ref<IOptions>({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: []
    })
    const xfilter = ref<IFilter>({
      favourite: false,
      rank: null,
      total: null,
      valid: false,
      active: false
    })
    const updated = computed(() => { return moment(updatedAt.value).format(dateTimeFormat.value) })
    const headers = computed<any[]>(() => {
      return [
        {
          text: 'Favourite', align: 'center', sortable: true, value: 'favourite', width: '5%',
          filter: (value: boolean) => {
            if (xfilter.value.favourite) return value
            else return true
          }
        },
        { text: 'Name', align: null, sortable: true, value: 'name', width: '25%' },
        { text: 'Discovered', align: null, sortable: true, value: 'discoveredAt', width: '10%' },
        // {
        //   text: 'Valid',
        //   align: 'center',
        //   sortable: true,
        //   value: 'valid',
        //   width: '5%',
        //   filter: (value: boolean) => {
        //     // console.debug(this.xfilter, value)
        //     return (this.xfilter.valid) ? value === true : true
        //   }
        // },
        {
          text: 'Active', align: 'center', sortable: true, value: 'active', width: '5%',
          filter: (value: boolean) => {
            // console.debug(this.xfilter, value)
            return (xfilter.value.active) ? value === true : true
          }
        },
        {
          text: 'Rank', align: 'center', sortable: true, value: 'rank', width: '5%',
          filter: (value: number) => {
            if (!xfilter.value.rank) return true
            return value >= parseInt(xfilter.value.rank.toString())
          }
        },
        {
          text: 'Total', align: 'center', sortable: true, value: 'total', width: '5%',
          filter: (value: number) => {
            if (!xfilter.value.total) return true
            return value >= parseInt(xfilter.value.total.toString())
          }
        }
      ]
    })
    const items = computed(() => {
      return list.value?.map((item: IValidator) => {
        return {
          favourite: favourites.value.includes(item.stash),
          stash: item.stash,
          name: item.StorageKey.toString(), // item.name,
          discoveredAt: item.discoveredAt,
          // valid: this.isValid(item.validity || [{ valid: false }]),
          // active: item.active,
          rank: item.rank,
          totalScore: item.score?.total
        }
      })
    })

    const getList = async () => {
      console.debug('getList')
      await store.dispatch('validator/loading', true)
      const era = await substrate.api?.query.staking.activeEra()
      console.debug('era', era)
      // let vals = await this.$substrate.polkadot.api.query.staking.erasValidatorPrefs.entries(era.value.index)
      // let vals = await this.$substrate.polkadot.api.query.staking.validators(account_hash_stash)
      // let vals = await this.$substrate.polkadot.api.query.session.validators()
      // const vals = await this.$substrate.polkadot.api.query.staking.validators.entries()
      // const vals = await this.$substrate.polkadot.api.query.staking.validators.at(era)
      const countForVals: any = await substrate.api?.query.staking.counterForValidators()
      const countForNoms: any = await substrate.api?.query.staking.counterForNominators()
      console.debug('vals', countForVals.toNumber(), countForNoms.toNumber())

      const vals = await substrate.api?.query.session.validators()
      console.debug('vals', vals)

      // await this.$store.dispatch('validator/setList', vals)
      await store.dispatch('validator/loading', false)
    }
    const toggleFav = (item: any) => {
      store.dispatch('validator/toggleFav', item.stash)
    }

    const handlePaginate = (evt: any) => {
      // console.debug(evt)
      store.dispatch('validator/paginate', evt)
    }
    const handleOptions = (evt: IOptions) => {
      store.dispatch('validator/handleOptions', evt)
    }
    const gotoValidator = (item: any) => {
      // console.debug('gotoValidator', item)
      store.dispatch('validator/setValidator', item.stash)
      router.push('/validator/' + item.stash)
    }

    watch(() => search.value, newVal => {
      store.dispatch('validator/setSearch', newVal)
    })
    watch(() => xfilter.value, (oldVal, newVal) => {
      // if (oldVal === false) console.debug(newVal, oldVal)
      store.dispatch('validator/handleFilter', newVal)
    })

    onBeforeMount(() => {
      // console.debug('Validators.vue: chain: ' + chainId.value)
      options.value = store.state.validator.options
      // this.itemsPerPage = this.$store.state.validator.pagination.itemsPerPage
      xfilter.value = store.state.validator.filter
      search.value = store.state.validator.search
      if (!updatedAt.value || moment(updatedAt.value).diff(moment(), 'seconds') > 15) { getList() }
    }) 

    return {
      loading,
      list,
      updatedAt,
      updated,
      favourites,
      dateTimeFormat,
      search,
      options,
      xfilter,
      headers,
      items,
      getList,
      toggleFav,
      handlePaginate,
      handleOptions,
      gotoValidator
    }
  },
  // watch: {
  //   search (newval) {
  //   },
  //   xfilter: {
  //     deep: true,
  //     handler (newval, oldval) {
  //     }
  //   }
  // },
  methods: {
    formatDate (d: string|number): string {
      return moment(d).format(this.dateTimeFormat)
    },
    timeAgo (d: string|number): string {
      return moment(d).fromNow()
    },
    // eslint-disable-next-line
    handlePage (evt: any) {
      if (!evt) console.debug(evt)
    },
    // eslint-disable-next-line
    handleItemsPerPage (evt: any) {
      console.debug(evt)
    },
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

.small-radio i {
  font-size: 19px;
}
.small-radio label {
  font-size: 14px;
  padding-left: 0px;
  margin-left: -4px;
}
.small-radio .v-radio {
  padding: 0px;
}
.small-radio [class*="__ripple"] {
  left: 0;
}
</style>
