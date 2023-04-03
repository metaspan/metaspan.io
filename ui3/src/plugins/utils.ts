// import { App, Plugin, InjectionKey } from 'vue'

const defaults = {
  shortLength: 5 // 5...5 = 13
}

type UtilsType = {
  shortStash(stash: string): string
}

// export const utilsPluginKey: InjectionKey<UtilsType> = Symbol('$utils')
function shortStash (stash: string) {
  return stash.slice(0, defaults.shortLength) + '...' + stash.slice(-defaults.shortLength)
}

// export const utils: Plugin = {
//   install: (app: App, options) => {
//     //   console.debug('hello from plugins/utils.ts')
//     //   console.debug(app)
//     //   app.prototype.$translate = (key: string) => {
//     //     // retrieve a nested property in `options`
//     //     // using `key` as the path
//     //     // return key.split('.').reduce((o, i) => {
//     //     //   if (o) return o[i]
//     //     // }, options)
//     //     return key
//     //   }
//     //   // app.config.globalProperties.$utils = {
//     //   // }

//     app.config.globalProperties.$utils = { shortStash }
//     app.provide('$utils', { shortStash })
//   }
// }

export default {
  utils: {
    shortStash
  }
}
