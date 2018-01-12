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
    import {
        mapActions
    } from 'vuex'

    export default {
        props: [],
        components: {},
        data() {
            return {
                visible: {}
            }
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
                // console.log(this.$store.state.Backtest.signals[key])
                let title = {}
                const keyAry = key.split('-')
                title = {
                    text: keyAry[keyAry.length - 1] + ' ' + this.$store.state.Locale.file[key] + ' - ' + this.$store
                        .state.Backtest.strategies[strategy_id].name
                }

                let series = []
                let counter = 0
                let indicatorSetIndex = 0
                _.forOwn(this.$store.state.Backtest.calSet[key][strategy_id], (x, posKey) => {
                    _.forOwn(x, (x, actionKey) => {
                        _.forOwn(x, (x, orKey) => {
                            _.forOwn(x, (x, andKey) => {
                                let isCompare1 = true
                                let data = []
                                _.forOwn(x, (x, compareKey) => {
                                    const indicator = this.$store
                                        .state.Backtest.strategies[strategy_id]
                                        .value[indicatorSetIndex].indicators[
                                            orKey][andKey]
                                    const prefix = posKey + '-' + actionKey +
                                        '#' + (counter + 1)


                                    let text = prefix + (
                                            isCompare1 ? 'a' : 'b') + ':' +
                                        backtest.compareString(indicator.compare1,indicator.param1)
                                    if (!isCompare1) {
                                        text = prefix + (
                                                isCompare1 ? 'a' : 'b') + ':'+backtest.compareString(indicator.compare2,indicator.param2)
                                    }
                                    series.push({
                                        id: posKey + '-' + actionKey +
                                            '-' + orKey + '-' + andKey +
                                            '-' + (
                                                isCompare1 ? 'a' : 'b'),
                                        name: text,
                                        data: x,
                                        events: {
                                            legendItemClick: function () {
                                                let visible = !this
                                                    .visible &&
                                                    this.chart.get(
                                                        posKey +
                                                        '-' +
                                                        actionKey +
                                                        '-' + orKey +
                                                        '-' +
                                                        andKey +
                                                        '-a'
                                                    ).visible
                                                if (this.options.id ==
                                                    posKey + '-' +
                                                    actionKey +
                                                    '-' + orKey +
                                                    '-' + andKey +
                                                    '-a') {
                                                    visible = !this
                                                        .visible &&
                                                        this.chart.get(
                                                            posKey +
                                                            '-' +
                                                            actionKey +
                                                            '-' +
                                                            orKey +
                                                            '-' +
                                                            andKey +
                                                            '-b'
                                                        ).visible

                                                }
                                                if (visible) {
                                                    this.chart.get(
                                                        posKey +
                                                        '-' +
                                                        actionKey +
                                                        '-flags'
                                                    ).show()
                                                } else {
                                                    this.chart.get(
                                                        posKey +
                                                        '-' +
                                                        actionKey +
                                                        '-flags'
                                                    ).hide()
                                                }
                                            }
                                        }
                                    })
                                    isCompare1 = false
                                })
                                counter++
                            })
                        })
                        indicatorSetIndex++
                    })
                })
                _.forOwn(this.$store.state.Backtest.signals[key][strategy_id], (x, posKey) => {
                    _.forOwn(x, (x, actionKey) => {
                        let name = (posKey == 'long') ? (actionKey == 'entry') ? 'Buy' : 'Sell' : (
                            actionKey == 'entry') ? 'Sell Short' : 'Buy to Cover'

                        series.push({
                            type: 'flags',
                            id: posKey + '-' + actionKey + '-flags',
                            data: x,
                            onSeries: posKey + '-' + actionKey + '-' + '0' + '-' + '0' + '-a', // Id of which series it should be placed on. If not defined
                            // the flag series will be put on the X axis
                            name: name,
                            shape: 'squarepin', // Defines the shape of the flags.
                            showInLegend: false
                        })

                    })

                    // series.push({
                    //     type: 'flags',
                    //     data: x['trades']['exit'],
                    //     onSeries: posKey + '-' + 'exit' + '-' + '0' + '-' + '0' + '-a', // Id of which series it should be placed on. If not defined
                    //     // the flag series will be put on the X axis
                    //     name: (posKey=='long')?'Sell':'Buy to Cover',
                    //     shape: 'squarepin' // Defines the shape of the flags.
                    // })
                })
                // series.push({
                //     type: 'flags',
                //     name:'a',
                //     data: [{
                //         x: 1504769400000, // Point where the flag appears
                //         title: 'entry', // Title of flag displayed on the chart
                //         text: 'entry' // Text displayed when the flag are highlighted.
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
