<template>
  <v-container>
    Identities
    <v-text-field v-model="search" label="Search" :loading="debouncing"></v-text-field>
    <v-list>
      <template v-for="(item, idx) in list">

      <v-divider :key="`${item.accountId}${idx}`"></v-divider>
      <v-list-item :key="item.accountId">

        <v-list-item-content>
          <v-list-item-title>{{item.identity.info.display}}</v-list-item-title>
          <v-list-item-subtitle>
            <v-row>
                <v-col class="col-6 col-sm-3"><ClickToCopy :text="item.accountId" :display="shortStash(item.accountId)"></ClickToCopy></v-col>
                <v-col>
                  <v-btn small elevation="2" icon>
                    <a :href="`https://${chainId}.subscan.io/account/${item.accountId}`" target="_blank" style="text-decoration: none; white-space: nowrap" nowrap>
                      <v-img width="16" height="16" src="/image/subscan-logo.png"></v-img>
                    </a>
                  </v-btn>
              </v-col>
            </v-row>
          </v-list-item-subtitle>
          <v-row>
            <v-col>
              <!-- <div v-for="key in Object.keys(item.identity.info)" v-bind:key="key">
                {{ key }}: {{item.identity.info[key] }}
              </div> -->
              <v-container fluid>
                <!-- <span v-if="item.identity.info.display"><v-icon small>mdi-file-document-outline</v-icon> {{item.identity.info.display}} <br></span> -->
                <span v-if="item.identity.info.email"><v-icon small>mdi-email</v-icon> <a :href="`mailto:${item.identity.info.email}`">{{item.identity.info.email}}</a> <br></span>
                <span v-if="item.identity.info.legal"><v-icon small>mdi-domain</v-icon> {{item.identity.info.legal}} <br></span>
                <span v-if="item.identity.info.riot"><v-icon small>mdi-account-box-outline</v-icon> {{item.identity.info.riot}} <br></span>
                <span v-if="item.identity.info.twitter"><v-icon small>mdi-twitter</v-icon> {{item.identity.info.twitter}} <br></span>
                <span v-if="item.identity.info.web"><v-icon small>mdi-web</v-icon> <a :href="formatUrl(item.identity.info.web)" target="_blank">{{item.identity.info.web}}</a> </span>
              </v-container>
            </v-col>
            <v-col v-if="item.identity.children?.length > 0">Sub-identities <br>
              <v-list>
                <v-list-item v-for="child in item.identity.children" v-bind:key="child.accountId">
                  <v-list-item-title>
                    <v-row>
                      <v-col>{{child.subId}} / </v-col>
                      <v-col><ClickToCopy :text="child.accountId" :display="shortStash(child.accountId)"></ClickToCopy></v-col>
                    </v-row>
                  </v-list-item-title>
                  <v-list-item-action>
                    <v-btn small elevation="2" icon>
                      <a :href="`https://${chainId}.subscan.io/account/${child.accountId}`" target="_blank" style="text-decoration: none; white-space: nowrap" nowrap>
                        <v-img width="16" height="16" src="/image/subscan-logo.png"></v-img>
                      </a>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-list-item-content>
        <hr>
      </v-list-item>

      </template>

    </v-list>
    <!-- {{ list }} -->
    <Loading :loading="loading"></Loading>
  </v-container>
</template>

<script lang="ts">
import Vue, { computed } from 'vue'
import { mapState } from 'vuex'
import { GET_IDENTITIES } from '../graphql/queries/identities'
import { debounce } from 'lodash'
import { shortStash, parseIdentity } from '../global/utils'
import { hexToString } from '@polkadot/util'
import Loading from './Loading.vue'
import ClickToCopy from './ClickToCopy.vue'

interface IData {
  search: string
  list: any[]
  debouncing: boolean
  loading: boolean
  offset: number
  limit: number
}
interface IMethods {
  getSuperOf (stash: string): Promise<any>
  superOf (child: string): string
  shortStash (stash: string): string
  debouncedSearch (search: string): void
  getList (): void
  formatUrl (url: string): string
}
// eslint-disable-next-line
interface IComputed {
  chainId: string
}
// eslint-disable-next-line
interface IProps {}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'Identities',
  components: {
    ClickToCopy,
    Loading
  },
  computed: {
    ...mapState(['chainId'])
  },
  data () {
    return {
      search: '',
      list: [] as any[],
      debouncing: false,
      loading: false,
      offset: 0,
      limit: 20
    }
  },
  watch: {
    chainId (newVal: string) {
      this.$router.push(`/${newVal}/identity`)
      this.getList()
    },
    search (newVal: string) {
      this.debouncing = true
      this.debouncedSearch(newVal)
    }
  },
  methods: {
    shortStash,
    superOf (child: string) {
      let ret = ''
      // const id = await this.$substrate[this.chainId].query.identity.superOf(child)
      const id = this.getSuperOf(child).then(id => id)
      if (id) {
        console.debug('id', id)
        ret = hexToString(id[1]?.raw)
      }
      return ret
    },
    async getSuperOf (stash: string) {
      console.debug(stash)
      const id = await this.$substrate[this.chainId].query.identity.superOf(stash)
      return Promise.resolve(id.toJSON())
    },
    debouncedSearch: (str: string) => { console.debug(str) },
    async getList () {
      // this.$store.dispatch('candidate/getNominators', { chainId: this.chainId, stash: this.stash })
      this.loading = true
      const res = await this.$apollo.query({
        query: GET_IDENTITIES,
        variables: {
          chain: this.chainId,
          search: this.search,
          offset: this.offset,
          limit: this.limit
        }
      })
      // console.log('data', res.data.Nominators.map(n => n.accountId))
      console.debug('data', res.data)
      this.list = [] as any[]
      // console.debug('woot')
      for (let i = 0; i < res.data.Identities.length; i++) {
        // console.debug('idx', i)
        const identity = res.data.Identities[i]
        const children = identity.identity?.children || []
        for (let j = 0; j < children.length; j++) {
          // console.debug('child', children[j])
          let subId = ''
          if (typeof children[j] === 'string') {
            const sup = await this.$substrate[this.chainId].query.identity.superOf(children[j])
            if (sup.toJSON()) subId = hexToString(sup.toJSON()[1]?.raw)
            children[j] = { accountId: children[j], subId }
          } else {
            console.debug('get super of', children[j])
          }
        }
        identity.children = children
        this.list.push(identity)
      }
      this.loading = false
      // console.debug('getList done...')
    },
    formatUrl (url: string) {
      if (url.startsWith('https://') || url.startsWith('http://')) {
        return url
      } else {
        return 'https://' + url
      }
    }
  },
  created () {
    // hack to get around this inside debounce?
    this.debouncedSearch = debounce((str: string) => {
      console.debug('debouncedSearch', str)
      this.getList()
      this.debouncing = false
    }, 1500)
  }
})
</script>

<style scoped>
.subscan {
  width: 16px;
  height: 16px;
  object-fit: contain;
  object-position: 50% -30;
}
</style>
