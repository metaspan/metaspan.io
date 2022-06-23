
module.exports = {
  exits: {},
  async fn(inputs, exits, env) {
    let {res} = env
    return res.redirect('http://metaspan.io')
  }
}
