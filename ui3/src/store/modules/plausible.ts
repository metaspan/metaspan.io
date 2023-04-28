
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
      return state.options
    }
  },
  mutations: {},
  actions: {}
}

export default plausible
