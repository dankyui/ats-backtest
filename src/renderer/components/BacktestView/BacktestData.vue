<template>
    <!-- <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
            <v-flex xs12> -->
    <v-card class="mb-5 pa-3">
        <!-- <highcharts :options="options"></highcharts> -->
        <v-btn round color="error" dark @click="breakBacktest" v-if="this.$store.state.Backtest.running">Stop</v-btn>

        <div v-for="product in this.$store.state.Backtest.products" ref="container">
            <!-- {{ getOptions(product.dataset) }} -->
            <highstock :options="getOptions(product.dataset)" style="height: 400px" ref="highcharts"></highstock>
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

    export default {
        props: [],
        components: {},
        data() {
            return {
                e6: 1,
                hasResult: false,
                width: window.innerWidth,
                height: window.innerHeight,
            }
        },
        mounted() {
           this.$root.backtestCharts.push(...this.$refs.highcharts)
        },
        computed: {
        },
        methods: {
            ...mapActions([
                'runBacktest'
            ]),
            breakBacktest() {
                this.$store.commit('BREAK_BACKTEST')
            },
            getOptions(key) {
                let title={}
                const keyAry= key.split('-')
                title={
                    text:keyAry[keyAry.length-1]+' '+this.$store.state.Locale.file[key]
                }
                return {
                    chart: {},
                    credits: {
                        enabled: false
                    },
                    rangeSelector: {
                        selected: 1,
                        inputEnabled: false
                    },
                    title: title,
                    yAxis: [{
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: this.$t('ohlc')
                        },
                        height: '60%',
                        lineWidth: 2,
                        resize: {
                            enabled: true
                        }
                    }, {
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: this.$t('volume')
                        },
                        top: '65%',
                        height: '35%',
                        offset: 0,
                        lineWidth: 2
                    }],

                    tooltip: {
                        split: true
                    },

                    series: [{
                        type: 'candlestick',
                        name: title.text,
                        data: this.$store.state.Backtest.ohlc[key],
                        turboThreshold: 0
                    }, {
                        type: 'column',
                        name: this.$t('volume'),
                        data: this.$store.state.Backtest.volume[key],
                        yAxis: 1,
                        turboThreshold: 0,
                    }]
                }
            }
        }
    }
</script>
