
import { IndexedDB } from './modules/idb'

export class StateManager {
  dbName = 'metaspan.io'
  idb: IndexedDB

  constructor (dbName = 'metaspan.io') {
    this.dbName = dbName
    this.idb = new IndexedDB(dbName)
  }

  async saveState (key: string, state: any) {
    console.debug('store/state-manager.ts: saveState()', key, state)
    // localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    // remove api from saved state
    if (!state.initial) await this.idb.set(key, state)
  }

  async clearState (key: string) {
    console.debug('store/state-manager.ts: clearState()', key)
    // localStorage.removeItem(STORAGE_KEY)
    await this.idb.unset(key)
  }

  getStateSync (key: string, initialState: any): any {
    console.debug('store/state-manager.ts: getStateSync()', key)
    const savedState = this.idb.getSync(key)
    return Object.assign(initialState, savedState)
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
