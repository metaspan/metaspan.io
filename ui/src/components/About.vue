<template>

    <v-card>
        <v-card-title>About</v-card-title>
        <v-card-text>
            <p>metaspan polkadot / kusama validator dashboard</p>
            <p>Version: {{version}}</p>
        </v-card-text>
    </v-card>

</template>

<script>
import {mapState} from 'vuex'
export default {
    name: '',
    // props: ['showDialog'],
    // computed: {
    //     ...mapState(['showAboutDialog']),
    // },
    data() {
        return {
            // showDialog: false,
            version: '0.1.2'
        }
    },
    watch: {
        showDialog(v) {
            this.$store.dispatch('showAboutDialog', v)
        },
        showAboutDialog(v) {
            this.showDialog = v
        }
    },
}
</script>