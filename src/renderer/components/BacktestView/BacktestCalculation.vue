<template>
    <v-card class="mb-5 pa-3">
        <div v-for="product in products">
            <div v-for="strategy_id in selectedStrategies">
                <highstock :options="getOptions(product.dataset,strategy_id)" style="height: 400px;" ref="highcharts">
                </highstock>
            </div>
        </div>
    </v-card>
</template>

<script>
    export default {
        props: [],
        components: {},
        data() {
            return {}
        },
        computed: {
            products: {
                get() {
                    return this.$store.state.Backtest.products
                }
            },
            selectedStrategies: {
                get() {
                    return this.$store.state.Backtest.selectedStrategies
                }
            }
        },
        mounted() {
            this.$root.backtestCharts.push(...this.$refs.highcharts)

            // console.log('a:', this.$root)
            // setInterval(()=>{
            // console.log('b:', this.highcharts)
            // },3000
            // )
        },
        methods: {
            getOptions(key, strategy_id) {
                // console.log(this.$store.state.Backtest.calSet[key])

                let title = {}
                const keyAry = key.split('-')
                title = {
                    text: keyAry[keyAry.length - 1] + ' ' + this.$store.state.Locale.file[key] + ' - ' + this.$store
                        .state.Backtest.strategies[strategy_id].name
                }

                let series = []
                let counter = 0
                _.forOwn(this.$store.state.Backtest.calSet[key][strategy_id], (x, posKey) => {
                    _.forOwn(x, (x, actionKey) => {

                        _.forOwn(x, (x, orKey) => {
                            _.forOwn(x, (x, andKey) => {
                                let isCompare1 = true
                                let data = []
                                _.forOwn(x, (x, compareKey) => {
                                    // console.log('name:', actionKey,indicatorKey,orKey,andKey,x)
                                    series.push({
                                        id: posKey + '-' + actionKey +
                                            '-' + orKey + '-' + andKey +
                                            '-' + (
                                                isCompare1 ? 'a' : 'b'),
                                        name: posKey + '-' + actionKey +
                                            '#' + (counter + 1) + (
                                                isCompare1 ? 'a' : 'b'),
                                        data: x
                                    })
                                    isCompare1 = false
                                })
                                counter++
                            })
                        })
                    })
                })
                _.forOwn(this.$store.state.Backtest.resultSet[key][strategy_id], (x, posKey) => {
                    series.push({
                        type: 'flags',
                        data: x['trades']['buy'],
                        onSeries: posKey + '-' + 'entry' + '-' + '0' + '-' + '0' + '-a', // Id of which series it should be placed on. If not defined
                        // the flag series will be put on the X axis
                        name: 'Buy',
                        shape: 'flag' // Defines the shape of the flags.
                    })
                    series.push({
                        type: 'flags',
                        data: x['trades']['sell'],
                        onSeries: posKey + '-' + 'exit' + '-' + '0' + '-' + '0' + '-a', // Id of which series it should be placed on. If not defined
                        // the flag series will be put on the X axis
                        name: 'Sell',
                        shape: 'flag' // Defines the shape of the flags.
                    })
                })
                // series.push({
                //     type: 'flags',
                //     name:'a',
                //     data: [{
                //         x: 1504769400000, // Point where the flag appears
                //         title: 'Buy', // Title of flag displayed on the chart
                //         text: 'Buy' // Text displayed when the flag are highlighted.
                //     }],
                //     onSeries: 'long-entry-0-0-1', // Id of which series it should be placed on. If not defined
                //     // the flag series will be put on the X axis
                //     shape: 'flag' // Defines the shape of the flags.
                // })
                let timeframe = this.$store.state.Backtest.strategies[strategy_id].timeframe
                const subtitle = {
                    text: 'Timeframe: ' + this.$time.minimize(timeframe)
                }
                return {
                    credits: {
                        enabled: false
                    },
                    rangeSelector: {
                        selected: 1,
                        inputEnabled: false
                    },
                    legend: {
                        enabled: true,
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        y: 100
                    },
                    title: title,
                    subtitle: subtitle,
                    // yAxis: [
                    //     {
                    //     labels: {
                    //         align: 'right',
                    //         x: -3
                    //     },
                    //     title: {
                    //         text: this.$t('ohlc')
                    //     },
                    //     height: '60%',
                    //     lineWidth: 2,
                    //     resize: {
                    //         enabled: true
                    //     }
                    // },
                    // {
                    //     labels: {
                    //         align: 'right',
                    //         x: -3
                    //     },
                    //     title: {
                    //         text: this.$t('volume')
                    //     },
                    //     top: '65%',
                    //     height: '35%',
                    //     offset: 0,
                    //     lineWidth: 2
                    // }
                    // ],

                    tooltip: {
                        // valueDecimals: 2
                    },

                    series: series
                    // [
                    //     {
                    //     type: 'candlestick',
                    //     name: title.text,
                    //     data: this.$store.state.Backtest.calSet[key].map((x => [x[0], x[1], x[2],
                    //         x[3], x[4]
                    //     ])),
                    //     turboThreshold: 0
                    // }, {
                    //     type: 'column',
                    //     name: this.$t('volume'),
                    //     data: this.$store.state.Backtest.calSet[key].map((x => [x[0], x[5]])),
                    //     yAxis: 1,
                    //     turboThreshold: 0,
                    // },
                    // {
                    //     name: this.$t('ma'),
                    //     data: [],
                    //     turboThreshold: 0,
                    // }
                    // ]
                }
            }
        }
    }
</script>
