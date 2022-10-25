<template>
  <div>
    there is nothing to see here... check the console
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ScProvider, WellKnownChain } from '@polkadot/rpc-provider/substrate-connect'
import { ApiPromise } from '@polkadot/api'

// interface IData {
//   api: Promise<ApiPromise>
// }

export default Vue.extend({
  name: 'SubstrateTest',
  data () {
    return {
      api: {} as ApiPromise
    }
  },
  async mounted () {
    console.log('App.vue: mounted')
    try {
      const provider = new ScProvider(WellKnownChain.ksmcc3)

      provider.on('error', (err) => {
        console.debug('Provider error follows')
        console.error(err)
      })
      provider.on('connected', () => {
        console.debug('Provider connected')
        console.debug()
      })
      provider.on('disconnected', (evt) => {
        console.debug('Provider disconnected')
        console.debug(evt)
      })

      console.debug(provider)
      let i = 0
      const int = setInterval(async () => {
        console.debug('loop ' + i)
        i++
        if (!provider.isConnected) {
          await provider.connect()
        }
        console.debug(`connected: ${provider.isConnected}`)
        if (provider.isConnected) {
          // console.debug(provider)
          this.api = await ApiPromise.create({ provider })
          console.log(this.api.genesisHash.toHex())
          i = 20
        } else {
          console.debug('not connected')
        }
        if (i > 10) {
          console.debug('shutdown!')
          clearInterval(int)
        }
      }, 1000)
      console.debug(provider)
    } catch (err) {
      console.error(err)
    } finally {
      console.log('...done')
    }
    // const test = this.api.query.state()
  }
})
</script>
