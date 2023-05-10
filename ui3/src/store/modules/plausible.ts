
const plausible = {
  state: {
    options: {
      // see configuration section
      domain: 'metaspan.io',
      hashMode: true,
      trackLocalhost: true,
      apiHost: 'https://click.metaspan.io',
    }
  },
  getters: {
    options (state: any) {
      console.debug('plausible.ts: getters.options', state)
      return state.options
    }
  },
  mutations: {},
  actions: {}
}

export default plausible
