import { openDB, IDBPDatabase } from 'idb'

class IndexedDB {
  key = ''
  db: Promise<IDBPDatabase<unknown>> = openDB('', 1, {
    upgrade (_db) {
      _db.createObjectStore('keyval')
    }
  })

  constructor (key: string) {
    this.key = key
    this.db = openDB(key, 1, {
      upgrade (_db) {
        _db.createObjectStore('keyval')
      }
    }).then(db => db)
  }

  getSync (key: string) {
    console.debug('store/modules/idb.ts: getSync()', key)
    this.db.then(dbc => {
      dbc.get('keyval', key).then(res => {
        console.debug('idb returning', res)
        return res
      }).catch(err => {
        console.debug('ERROR in idb', err)
      })
    })
  }

  async get (key: string) {
    return await (await this.db).get('keyval', key)
  }

  async set (key: string, val: any) {
    // const valstr = JSON.stringify(val)
    return (await this.db).put('keyval', val, key)
  }

  async unset (key: string) {
    return (await this.db).delete('keyval', key)
  }

  async keys () {
    return (await this.db).getAllKeys('keyval')
  }

  async getAll () {
    return (await this.db).getAll('keyval')
  }
}

export { IndexedDB }
