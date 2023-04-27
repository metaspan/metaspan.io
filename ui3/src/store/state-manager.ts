
import { IndexedDB } from './modules/idb'

export class StateManager {
  dbName = 'metaspan.io'
  idb: IndexedDB

  constructor (dbName = 'metaspan.io') {
    this.dbName = dbName
    this.idb = new IndexedDB(dbName)
  }

  async saveState (key: string, state: any) {
    // console.debug('store/state-manager.ts: saveState()', key, state)
    // localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    // remove api from saved state
    // vue3 uses Proxy Objects !
    const lState = JSON.parse(JSON.stringify(state))
    try {
      if (!state.initial) await this.idb.set(key, lState)
    } catch (err) {
      console.log('Failed to save state in idb')
      console.log(key, lState)
      console.error(err)
    }
  }

  async clearState (key: string) {
    console.debug('store/state-manager.ts: clearState()', key)
    // localStorage.removeItem(STORAGE_KEY)
    await this.idb.unset(key)
  }

  // TODO why do we need a sync method? we use this to return initial state for a store/module
  getStateSync (key: string, initialState: any): any {
    console.debug('store/state-manager.ts: getStateSync()', key)
    const savedState: any = this.idb.getSync(key)
    console.debug('savedState', savedState)
    if (savedState !== undefined) {
      return Object.assign(initialState, {
        ...savedState,
        chains: {
          polkadot: savedState.chains.polkadot,
          kusama: savedState.chains.kusama
        }
      })
    } else {
      console.debug('returning initialState', initialState)
      return initialState
    }

    // // const state =
    // this.getState(key, initialState).then(state => {
    //   console.debug('store/state-manager.ts: getStateSync() returns', state)
    //   return state
    // })
    // // console.debug('store/state-manager.ts: getStateSync() returns', state)
    // // return state
  }

  async getState (key: string, initialState: any): Promise<any> {
    console.debug('store/state-manager.ts: getState()', key)
    // const savedState = localStorage.getItem(STORAGE_KEY)
    return new Promise((resolve) => {
      let ret = initialState
      let fromIdb = false
      this.idb.get(key).then((savedState) => {
        // const savedState = await this.idb.get(key)
        if (savedState && savedState.chainId) {
          console.debug('store/state-manager.ts: getState(): restoring from idb()')
          fromIdb = true
          // return JSON.parse(savedState)
          // console.debug(savedState)
          ret = Object.assign({}, initialState, savedState)
          // return mergedState
        } else {
          console.debug('store/state-manager.ts: getState(): using initialState')
          ret = Object.assign({}, initialState)
          ret.initial = false
          // return mergedState
        }
        console.debug('store/state-manager.ts: getState() returns', key, fromIdb, ret)
        resolve(ret)
      })
      // return ret
    })
  }
}
