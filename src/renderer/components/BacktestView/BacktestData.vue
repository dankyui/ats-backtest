<template>
    <!-- <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
            <v-flex xs12> -->
    <v-card class="mb-5 pa-3">

        <!-- <highcharts :options="options"></highcharts> -->
        <v-btn round color="error" dark @click="breakBacktest" v-if="this.$store.state.Backtest.running">Stop</v-btn>
        <div v-if="!this.$store.state.Backtest.startCalculate">
            <v-progress-linear v-bind:indeterminate="true" color="primary" class="mt-5"></v-progress-linear>
        </div>
        <div v-else>
            <div v-for="product in this.$store.state.Backtest.products">
                <!-- {{ getOptions(product.dataset) }} -->
                <BacktestChart :dataset="product.dataset"></BacktestChart>
            </div>
        </div>

        <!-- {{options}} -->
        <!-- {{this.$store.state.Backtest.dataset}} -->
    </v-card>
    <!-- </v-flex>
        </v-layout>
    </v-container> -->
</template>

<script>
    import {
        mapActions
    } from 'vuex'
    import BacktestChart from './BacktestChart.vue'

    export default {
        props: [],
        components: {
            BacktestChart
        },
        data() {
            return {
                e6: 1,
                hasResult: false,
                width: window.innerWidth,
                height: window.innerHeight,
            }
        },
        mounted() {},
        computed: {},
        methods: {
            ...mapActions([
                'runBacktest'
            ]),
            breakBacktest() {
                this.$store.commit('BREAK_BACKTEST')
            },

        }
    }
</script>
