<template>
    <v-card class="pa-3">
        <div v-for="product in products">
            <div v-for="strategy_id in selectedStrategies">
                <highstock :options="getOptions(product.dataset,strategy_id)" style="height: 400px;" ref="highcharts">
                </highstock>
            </div>
        </div>
             <v-btn block color="primary" dark @click="$store.commit('REFRESH_PROGRESS')">{{$t('startAnotherTest')}}</v-btn>
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
                // _.forOwn(this.$store.state.Backtest.calSet[key][strategy_id], (x, posKey) => {
                //     _.forOwn(x, (x, actionKey) => {

                //         _.forOwn(x, (x, orKey) => {
                //             _.forOwn(x, (x, andKey) => {
                //                 let isCompare1 = true
                //                 let data = []
                //                 _.forOwn(x, (x, compareKey) => {
                //                     // console.log('name:', actionKey,indicatorKey,orKey,andKey,x)
                //                     series.push({
                //                         id: posKey + '-' + actionKey +
                //                             '-' + orKey + '-' + andKey +
                //                             '-' + (
                //                                 isCompare1 ? 'a' : 'b'),
                //                         name: posKey + '-' + actionKey +
                //                             '#' + (counter + 1) + (
                //                                 isCompare1 ? 'a' : 'b'),
                //                         data: x
                //                     })
                //                     isCompare1 = false
                //                 })
                //                 counter++
                //             })
                //         })
                //     })
                // })
                series.push({
                    id: 'equityCurve',
                    name: 'Equity Curve',
                    data: this.$store.state.Backtest.equityCurve[key][strategy_id]
                })
                _.forOwn(this.$store.state.Backtest.resultSet[key][strategy_id], (x, posKey) => {
                    console.log('number of trades:',x['noOfTrades'])
                    series.push({
                        type: 'flags',
                        data: x['trades']['buy'],
                        onSeries: 'equityCurve', // Id of which series it should be placed on. If not defined
                        // the flag series will be put on the X axis
                        name: 'Buy',
                        shape: 'flag' // Defines the shape of the flags.
                    })
                    series.push({
                        type: 'flags',
                        data: x['trades']['sell'],
                        onSeries: 'equityCurve', // Id of which series it should be placed on. If not defined
                        // the flag series will be put on the X axis
                        name: 'Sell',
                        shape: 'flag' // Defines the shape of the flags.
                    })
                })
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

                    tooltip: {},
                    series: series
                }
            }
        }
    }
</script>
