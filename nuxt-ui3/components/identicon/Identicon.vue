<template>
  <component :is="componentToRender" v-bind="{ address, size, isAlternative, key }"></component>
</template>

<script lang="ts">

import { defineComponent, ref, watch, computed, h } from 'vue'
import { isHex, isU8a, u8aToHex } from '@polkadot/util'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
// import { Beachball, Empty, Jdenticon, Polkadot } from './icons/index.js';
import { Beachball, Empty, Jdenticon } from '@polkadot/vue-identicon/icons'
import Polkadot from './Polkadot.vue'

// const DEFAULT_SIZE = 64;

function encodeAccount(value: string, prefix?: number) {
  try {
    const address = isU8a(value) || isHex(value)
      ? encodeAddress(value, prefix)
      : value;
    const publicKey = u8aToHex(decodeAddress(address, false, prefix))
    return { address, publicKey }
  }
  catch {
    return { address: '', publicKey: '0x' }
  }
}
/**
 * @name Identicon
 * @description The main Identicon component, taking a number of properties
 * @example
 * ```html
 * <Identicon :size="128" :theme="polkadot" :value="..." />
 * ```
 */
export default defineComponent({
  components: {
    Beachball,
    Empty,
    Jdenticon,
    Polkadot
  },
  props: ['prefix', 'isAlternative', 'size', 'theme', 'value'],
  setup (props) {
    const { prefix, isAlternative=false, size=64, theme='empty', value } = props
    const address = ref('')
    const isAlternativeIcon = ref(props.isAlternative || false)
    const publicKey = ref('0x')
    const type = ref('empty')
    const createData = function () {
      type.value = theme
      isAlternativeIcon.value = isAlternative || false
      recodeAddress()
    }
    const recodeAddress = function () {
      const encoded = encodeAccount(value);
      address.value = encoded.address;
      publicKey.value = encoded.publicKey;
    }
    watch(() => value, () => {
      recodeAddress()
    })
    const componentToRender = computed(() => type.value.charAt(0).toUpperCase() + type.value.slice(1))
    createData()
    return {
      address,
      isAlternativeIcon,
      key: publicKey,
      componentToRender
    }
  }
});
</script>
