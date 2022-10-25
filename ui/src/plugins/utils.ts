import Vue from 'vue'

const defaults = {
  shortLength: 5 // 5...5 = 13
}

export default {
  // install: (app, options) => {
  //   console.debug('hello from plugins/utils.ts')
  //   console.debug(app)
  //   app.prototype.$translate = (key: string) => {
  //     // retrieve a nested property in `options`
  //     // using `key` as the path
  //     // return key.split('.').reduce((o, i) => {
  //     //   if (o) return o[i]
  //     // }, options)
  //     return key
  //   }
  //   // app.config.globalProperties.$utils = {
  //   // }
  // },
  shortStash (stash: string) {
    return stash.slice(0, defaults.shortLength) + '...' + stash.slice(-defaults.shortLength)
  }
}
