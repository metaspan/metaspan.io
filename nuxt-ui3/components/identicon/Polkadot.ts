
import { defineComponent, h } from 'vue';
// import { polkadotIcon } from '@polkadot/ui-shared';
import { polkadotIcon } from './ui-shared/polkadot.js';
/**
 * @name Polkadot
 * @description The Polkadot default identicon
 */
export const Polkadot = defineComponent({
  props: ['address', 'isAlternative', 'size'],
  render() {
    console.debug('Polkadot.ts: render()', this.address, this.$props)
    const { address, isAlternative, size } = this.$props;
    const circles = polkadotIcon(address, { isAlternative }).map(({ cx, cy, fill, r }) => h('circle', { attrs: { cx, cy, fill, r } }, []));
    // console.debug('circles', circles)
    return h('svg', {
      attrs: {
        height: size,
        viewBox: '0 0 64 64',
        width: size
      }
    }, circles);
  }
});
