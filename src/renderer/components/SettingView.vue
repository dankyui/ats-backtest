<template>
    <v-layout row wrap justify-center id="wrapper">
        <logo></logo>
        <v-flex xs10 class="mt-3">
            <v-btn-toggle mandatory v-model="toggle_one">
                <v-btn flat @click="setLanguage('en')">
                    EN
                </v-btn>
                <v-btn flat @click="setLanguage('zh')">
                    中文
                </v-btn>
            </v-btn-toggle>
        </v-flex>
    </v-layout>
</template>

<script>
    import Logo from './ShareView/Logo'
    import {
        mapActions
    } from 'vuex'

    export default {
        name: 'setting',
        components: {
            Logo
        },
        computed: {
            toggle_one: {
                get() {
                    return this.$store.state.Locale.languageId
                },
                set() {}
            },
        },
        methods: {
            ...mapActions([
                'setLanguage'
            ])
        }
    }
</script>
