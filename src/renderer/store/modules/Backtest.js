import Vue from 'vue'
import {
    resolve
} from 'path';

const SAVE_PRODUCT = 'SAVE_PRODUCT'
const REMOVE_PRODUCT = 'REMOVE_PRODUCT'
const SET_PFE = 'SET_PFE'
const SET_SELECTED_STRATEGIES = 'SET_SELECTED_STRATEGIES'
const RUN_BACKTEST = 'RUN_BACKTEST'
const SET_INIT_KEY = 'SET_INIT_KEY'
const CLEAR_BACKTEST = 'CLEAR_BACKTEST'
const BREAK_BACKTEST = 'BREAK_BACKTEST'
const BACKTEST_RUNNING = 'BACKTEST_RUNNING'
const START_LOAD_DATA = 'START_LOAD_DATA'
const START_CALCULATE = 'START_CALCULATE'
const REFRESH_PROGRESS = 'REFRESH_PROGRESS'
const SET_CAL_SET = 'SET_CAL_SET'
const SET_RESULT_SET = 'SET_RESULT_SET'
const ADD_TO_BUFFER = 'ADD_TO_BUFFER'

const state = {
    products: [{
            "id": 0,
            "dataset": "STK-SEHK-1",
            "periodSelected": "2017-01-1 00:00:00 ~ 2017-10-1 00:00:00"
        },
        // {
        //     "id": 1,
        //     "dataset": "STK-SEHK-2",
        //     "periodSelected": "2017-09-9 00:00:00 ~ 2017-10-12 00:00:00"
        // }
    ],
    strategies: [{
        id: 0,
        name: 'Strategy A',
        timeframe: 1440,
        value: [{
            position: 'long',
            actionType: 'entry',
            priceType: 'close',
            indicators: [
                [{
                        id: 0,
                        type: 'ma',
                        param1: 3,
                        param2: 9,
                        param3: 0,
                        compare1: 'ma_fast',
                        compare2: 'ma_slow',
                        condition: '^'
                    },

                ],
                // [{
                //     id: 1,
                //     type: 'ma',
                //     param1: 10,
                //     param2: 20,
                //     param3: 0,
                //     compare1: 'ma_fast',
                //     compare2: 'ma_slow',
                //     condition: '>'
                // }]
                // [{
                //     id: 3,
                //     type: 'ma',
                //     param1: 4,
                //     param2: 8,
                //     compare1: 'ma_fast',
                //     compare2: 'ma_slow',
                //     condition: '^'
                // }, {
                //     id: 4,
                //     type: 'ma',
                //     param1: 20,
                //     param2: 30,
                //     compare1: 'ma_fast',
                //     compare2: 'ma_slow',
                //     condition: '>'
                // }, {
                //     id: 5,
                //     type: 'ma',
                //     param1: 20,
                //     param2: 30,
                //     compare1: 'ma_fast',
                //     compare2: 'ma_slow',
                //     condition: '>'
                // }]
            ]
        }, {
            position: 'long',
            actionType: 'exit',
            priceType: 'open',
            indicators: [
                [{
                        id: 2,
                        type: 'ma',
                        param1: 5,
                        param2: 12,
                        param3: 0,
                        compare1: 'ma_fast',
                        compare2: 'ma_slow',
                        condition: 'v'
                    }
                    // , {
                    //     type: 'ma',
                    //     param1: 5,
                    //     param2: 12,
                    //     compare1: 'close',
                    //     compare2: 'ma_slow',
                    //     condition: '<'
                    // }],
                    //     [{
                    //         id: 8,
                    //         type: 'ma',
                    //         param1: 5,
                    //         param2: 12,
                    //         compare1: 'ma_fast',
                    //         compare2: 'ma_slow',
                    //         condition: 'v'
                    //     }, {
                    //         id: 9,
                    //         type: 'ma',
                    //         param1: 5,
                    //         param2: 12,
                    //         compare1: 'ma_fast',
                    //         compare2: 'ma_slow',
                    //         condition: '<'
                    //     }
                ]
            ]
        }]
    }],
    selectedStrategies: [0],
    capital: 10000,
    header: 'loadDataset',
    rawData: {},
    buffer: {},
    ohlc: {},
    volume: {},
    getAllData: false,
    breakBacktest: false,
    running: false,
    startLoadData: false,
    startCalculate: false,
    calSet: {},
    resultSet: {}
}

const mutations = {
    [SAVE_PRODUCT](state, product) {
        state.products.push(product)
    },
    [REMOVE_PRODUCT](state, indexes) {
        if (indexes.length == 0) return
        while (indexes.length) {
            state.products.splice(indexes.pop(), 1);
        }
        let reIndex = 0
        _.map(state.products, x => {
            x.id = reIndex++
        })
    },
    [SET_SELECTED_STRATEGIES](state, strategies) {
        state.selectedStrategies = strategies
    },
    [RUN_BACKTEST](state) {
        state.rawData = state.buffer
        _.forOwn(state.rawData, (x, key) => {
            state.rawData[key] = _.sortBy(x, x => x[0])
        })
    },
    [ADD_TO_BUFFER](state, data) {
        state.buffer[data.dataset].push(...data.rawData)
    },
    [SET_INIT_KEY](state, dataset) {
        Vue.set(state.rawData, dataset, [])
        Vue.set(state.buffer, dataset, [])
        Vue.set(state.ohlc, dataset, [])
        Vue.set(state.volume, dataset, [])
        Vue.set(state.calSet, dataset, [])
        Vue.set(state.resultSet, dataset, [])
        // Vue.set(state.calSet, dataset + '_timeframe', [])
    },
    [CLEAR_BACKTEST](state) {
        state.products = []
        state.selectedStrategies = []
        state.breakBacktest = false
        state.startLoadData = false
        state.startCalculate = false
        state.running = false
        state.rawData = {}
        state.buffer = {}
        state.ohlc = {}
        state.volume = {}
        state.calSet = {}
        state.resultSet = {}
    },
    [BREAK_BACKTEST](state) {
        state.breakBacktest = true
        state.running = false
    },
    [BACKTEST_RUNNING](state, boo) {
        state.running = boo
    },
    [START_LOAD_DATA](state, boo) {
        state.startLoadData = boo
    },
    [START_CALCULATE](state, boo) {
        state.startCalculate = boo
    },
    [REFRESH_PROGRESS](state) {
        state.startLoadData = false
        state.startCalculate = false
    },
    [SET_CAL_SET](state, {
        product,
        strategy_id,
        calData
    }) {
        // Vue.set(state.calSet, strategy, [])
        // Vue.set(state.calSet[strategy], 'long', [])
        // Vue.set(state.calSet[strategy]['long'], 'entry', [])
        // Vue.set(state.calSet[strategy]['long']['entry'], indicator, [])
        state.calSet[product][strategy_id] = calData
        // console.log(state.calSet[product])
        // console.log(product,data)
        // state.calSet[product][strategy]['long']['entry'][indicator] = data
    },
    [SET_RESULT_SET](state, {
        product,
        strategy_id,
        resultData
    }) {
        state.resultSet[product][strategy_id] = resultData
    }
}

const startCalculate = ({
    product = state.products[0].dataset,
    index: index = 0
} = {}) => {
    if (state.breakBacktest) {
        console.log('break')
        return
    }

    const strategies = _.filter(state.strategies, (x) => {
        return _.includes(state.selectedStrategies, x.id)
    })

    _.map(strategies, (strategy) => {
        const timeframe = strategy.timeframe
        //group data by timeframe
        let data = []

        let groups = _.groupBy(state.rawData[product], (data) => {
            return moment(data[0]).startOf('day').format();
        })

        _.map(groups, (x) => {
            for (let i = 0; i < x.length; i += timeframe) {
                let o = []
                let h = []
                let l = []
                let c = []
                let v = []
                for (let j = 0; j < timeframe && i + j < x.length; j++) {

                    o.push(x[i + j][1])
                    h.push(x[i + j][2])
                    l.push(x[i + j][3])
                    c.push(x[i + j][4])
                    v.push(x[i + j][5])
                }
                data.push([x[i][0], o[0], Math.max(...h), Math.min(...l), c[c.length - 1], _.reduce(v, (a, b) => a + b)])
            }
        })
        //end of calculating timeframe

        //calculate all indicators needed
        let calData = {}
        let resultData = {}
        let aOverb = {}
        let hasEntry = {}

        _.map(data, (x, i) => {
            // console.log(new Date(x[0]),x)
            _.map(strategy.value, indicatorSet => {
                //indicatorSet includes long/short,entry/exit
                //recognize it position and action type
                let compare1Price = {},
                    compare2Price = {}

                _.map(indicatorSet.indicators, (orIndicator, orIndex) => {
                    //or indicator
                    _.map(orIndicator, (indicator, andIndex) => {
                        // console.log('and', indicator)
                        if (!calData[indicatorSet.position]) {
                            calData[indicatorSet.position] = {}
                        }
                        if (!resultData[indicatorSet.position]) {
                            resultData[indicatorSet.position] = {}
                        }
                        if (!resultData[indicatorSet.position]['trades']) {
                            resultData[indicatorSet.position]['trades'] = []
                        }
                        if (!resultData[indicatorSet.position]['trades']['buy']) {
                            resultData[indicatorSet.position]['trades']['buy'] = []
                        }
                        if (!resultData[indicatorSet.position]['trades']['sell']) {
                            resultData[indicatorSet.position]['trades']['sell'] = []
                        }
                        if (!hasEntry[indicatorSet.position]) {
                            hasEntry[indicatorSet.position] = false
                        }

                        if (!calData[indicatorSet.position][indicatorSet.actionType]) {
                            calData[indicatorSet.position][indicatorSet.actionType] = {}
                        }

                        if (!calData[indicatorSet.position][indicatorSet.actionType][orIndex]) {
                            calData[indicatorSet.position][indicatorSet.actionType][orIndex] = {}
                        }

                        if (!calData[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]) {
                            calData[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex] = {}
                        }

                        if (!calData[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]['compareA']) {
                            calData[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]['compareA'] = []
                        }

                        if (!calData[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]['compareB']) {
                            calData[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]['compareB'] = []
                        }



                        if (indicator.type == 'ma') {
                            //         let compare1Data = []
                            //         let compare2Data = []
                            //         let name1,name2
                            //         if (indicator.compare1 == 'ma_fast') {
                            //             _.map(data, (x, i) => {
                            if (i < indicator.param1) {} else {
                                calData[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]['compareA'].push([x[0], _.round(_.map(data.slice(i - indicator.param1, i), x => x[4]).reduce((a, b) => a + b) / indicator.param1, 2)])
                            }
                            // })
                            //     name1='#' + indicator.id + ',MA Fast(' + indicator.param1 + ')'
                            // }
                            // else if (indicator.compare1 == 'close') {
                            //             _.map(data, (x, i) => {
                            //                 if (i < indicator.param1) {
                            //                 } else {
                            //                     compare1Data.push([x[0], _.round(x[4], 2)])
                            //                 }
                            //             })
                            //             name1='#' + indicator.id + ',Close'
                            //         }

                            //         if (indicator.compare2 == 'ma_slow') {
                            //             _.map(data, (x, i) => {
                            if (i < indicator.param2) {
                                // ma_fast.push([x[0], x[4]])
                            } else {
                                calData[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]['compareB'].push([x[0], _.round(_.map(data.slice(i - indicator.param2, i), x => x[4]).reduce((a, b) => a + b) / indicator.param2, 2)])
                            }
                        } //end of ma


                        //             })
                        //             name2='#' + indicator.id + ',MA Slow(' + indicator.param2 + ')'
                        // }

                        // _.map(data, (x, i) => {
                        if (i < indicator.param1 || i < indicator.param2) {
                            // ma_fast.push([x[0], x[4]])
                        } else {
                            // console.log(i)
                            if (!compare1Price[orIndex]) {
                                compare1Price[orIndex] = {}
                            }
                            if (!compare1Price[orIndex][andIndex]) {
                                compare1Price[orIndex][andIndex] = {}
                            }
                            if (!compare2Price[orIndex]) {
                                compare2Price[orIndex] = {}
                            }
                            if (!compare2Price[orIndex][andIndex]) {
                                compare2Price[orIndex][andIndex] = {}
                            }

                            if (indicator.compare1 == 'ma_fast') {
                                compare1Price[orIndex][andIndex] = _.round(_.map(data.slice(i - indicator.param1, i), x => x[4]).reduce((a, b) => a + b) / indicator.param1, 2)
                            } else
                            if (indicator.compare1 == 'close') {
                                compare1Price = _.round(x[4], 2)
                            }

                            compare2Price[orIndex][andIndex] = _.round(_.map(data.slice(i - indicator.param2, i), x => x[4]).reduce((a, b) => a + b) / indicator.param2, 2)

                            //initialize object
                            if (i == indicator.param1 || i == indicator.param2) {


                                if (!aOverb[indicatorSet.position]) {
                                    aOverb[indicatorSet.position] = {}
                                }

                                if (!aOverb[indicatorSet.position][indicatorSet.actionType]) {
                                    aOverb[indicatorSet.position][indicatorSet.actionType] = {}
                                }
                                if (!aOverb[indicatorSet.position][indicatorSet.actionType][orIndex]) {
                                    aOverb[indicatorSet.position][indicatorSet.actionType][orIndex] = {}
                                }

                                if (compare1Price[orIndex][andIndex] > compare2Price[orIndex][andIndex]) {
                                    aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex] = true
                                } else {
                                    aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex] = false
                                }
                                // console.log(i, new Date(x[0]), 'a Over b', aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex])
                            }

                            if (indicatorSet.actionType == 'entry' && !hasEntry[indicatorSet.position]) {
                                //entry
                                passCondition(compare1Price, compare2Price, indicatorSet, orIndicator, indicator, orIndex, andIndex, x, i, calData, resultData, aOverb, hasEntry)
                            } else
                            if (indicatorSet.actionType == 'exit' && hasEntry[indicatorSet.position]) {
                                //exit
                                passCondition(compare1Price, compare2Price, indicatorSet, orIndicator, indicator, orIndex, andIndex, x, i, calData, resultData, aOverb, hasEntry)
                            }
                            if (compare1Price[orIndex][andIndex] > compare2Price[orIndex][andIndex] && !aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]) {
                                // console.log(i, new Date(x[0]), indicator.id + ':cross above')
                                aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex] = true
                            } else if (compare1Price[orIndex][andIndex] < compare2Price[orIndex][andIndex] && aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]) {
                                // console.log(i, new Date(x[0]), indicator.id + ':cross below')
                                aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex] = false
                            }
                            // if (compare1Price > compare2Price && !aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]) {
                            //     console.log(i, new Date(x[0]), 'cross above')
                            //     aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex] = !aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]
                            // } else if (compare1Price < compare2Price && aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]) {
                            //     console.log(i, new Date(x[0]), 'cross below')
                            //     aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex] = !aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]
                            // } else if (compare1Price > compare2Price) {
                            //     console.log(i, new Date(x[0]), 'greater than')
                            // } else if (compare1Price < compare2Price) {
                            //     console.log(i, new Date(x[0]), 'smaller than')
                            // }

                        }

                        // })

                        // console.log('comp1',compare1Data,indicator)
                        // console.log('comp2',compare2Data,indicator)
                        // store.commit(SET_CAL_SET, {
                        //     product,
                        //     strategy_id: strategy.id,
                        //     actionType: indicatorSet.actionType,
                        //     position: indicatorSet.position,
                        //     indicator,
                        //     calData: compare1Data,
                        //     andIndex,
                        //     orIndex,
                        //     timeframe,
                        //     name:name1
                        // })
                        // store.commit(SET_CAL_SET, {
                        //     product,
                        //     strategy_id: strategy.id,
                        //     actionType: indicatorSet.actionType,
                        //     position: indicatorSet.position,
                        //     indicator,
                        //     calData: compare2Data,
                        //     andIndex,
                        //     orIndex,
                        //     timeframe,
                        //     name: name2
                        // })

                    })
                })
            })
        })

        store.commit(SET_CAL_SET, {
            product,
            strategy_id: strategy.id,
            calData
        })

        store.commit(SET_RESULT_SET, {
            product,
            strategy_id: strategy.id,
            resultData
        })
        // console.log(aOverb)
        // console.log(calData)


        // const entry = x.value.longEntry
        // const exit = x.value.longExit
        // const entryAnd = entry.split('&')
        // const exitAnd = exit.split('&')
        // const entryAndOr = _.map(entryAnd, x => x.split('|'))
        // const exitAndOr = _.map(exitAnd, x => x.split('|'))
        // console.log(entryAndOr, exitAndOr)
        // _.map(entryAndOr, x => {
        //     _.map(x, x => {
        //         const indicator = x.split(':')
        // console.log(indicator)

        // if (indicator[0] == 'ma') {
        //     const conditions = ['^', 'v', '>', '<']
        //     let condition
        //     for (let i in conditions) {
        //         if (_.includes(indicator[1], conditions[i])) {
        //             condition = conditions[i]
        //             break
        //         }
        //     }

        // const array = indicator[1].split(condition)
        // console.log(condition, array)
        // let ma1 = []
        // _.map(data, (x, i) => {
        //     if (i < array[0]) {
        // ma.push([x[0], x[4]])
        //     } else {
        //         ma1.push([x[0], _.round(_.map(data.slice(i - array[0], i), x => x[4]).reduce((a, b) => a + b) / array[0], 2)])
        //     }
        // })

        // let ma2 = []

        // _.map(data, (x, i) => {
        //     if (i < array[1]) {
        //     } else {
        //         ma2.push([x[0], _.round(_.map(data.slice(i - array[1], i), x => x[4]).reduce((a, b) => a + b) / array[1], 2)])
        //     }
        // })

        //     console.log(array[0], ma1)
        //     console.log(array[1], ma2)
        //     store.commit(SET_CAL_SET, {
        //         product,
        //         strategy: strategy.id,
        //         entry: true,
        //         long: true,
        //         indicator: 'ma(' + array[0] + ')',
        //         data: ma1
        //     })
        //     store.commit(SET_CAL_SET, {
        //         product,
        //         strategy: strategy.id,
        //         entry: true,
        //         long: true,
        //         indicator: 'ma(' + array[1] + ')',
        //         data: ma2
        //     })
        // }
        // })
        // })

    })

    // let data = []
    // let groups = _.groupBy(state.rawData[product], (data) => {
    //     return moment(data[0]).startOf('day').format();
    // })

    // _.map(groups, (x) => {
    //     for (let i = 0; i < x.length; i += timeframe) {
    //         let o = []
    //         let h = []
    //         let l = []
    //         let c = []
    //         let v = []
    //         for (let j = 0; j < timeframe && i + j < x.length; j++) {
    //             o.push(x[i + j][1])
    //             h.push(x[i + j][2])
    //             l.push(x[i + j][3])
    //             c.push(x[i + j][4])
    //             v.push(x[i + j][5])
    //         }
    //         data.push([x[i][0], o[0], Math.max(...h), Math.min(...l), c[c.length - 1], _.reduce(v, (a, b) => a + b)])
    //     }
    // })

    // store.commit(SET_CAL_SET, {
    //     product,
    //     data,
    //     suffix: '_timeframe'
    // })

    // let ma = []
    // _.map(data, (x, i) => {
    //     if (i < 50) {
    //         // ma.push([x[0], x[4]])
    //     } else {
    //         ma.push([x[0], _.round(_.map(data.slice(i - 50, i), x => x[4]).reduce((a, b) => a + b) / 50, 2)])
    //     }
    // })

    // console.log('ma',ma)


    // store.commit(SET_CAL_SET, {
    //     product,
    //     data: ma,
    //     suffix: ''
    // })
    store.commit(BACKTEST_RUNNING, false)
    index++
    if (index >= state.products.length) return
    startCalculate({
        product: state.products[index].dataset,
        index
    })
}

const passCondition = (compare1Price, compare2Price, indicatorSet, orIndicator, indicator, orIndex, andIndex, x, i, calData, resultData, aOverb, hasEntry) => {
    // console.log(i, new Date(x[0]),'has entry:'+hasEntry[indicatorSet.position])

    //**
    // if(orIndex==indicatorSet.indicators.length-1&&andIndex==orIndicator.length-1){



    // console.log('hasEntry', hasEntry[indicatorSet.position], 'and', andLength, 'or', orLength)
    if (andIndex == orIndicator.length - 1) {
        //     let count = 0
        // for (let orLength = 0; orLength < indicatorSet.indicators.length; orLength++) {
        //     for (let andLength = 0; andLength < orIndicator.length; andLength++) {
        //         const larger = Math.max([indicatorSet.indicators[orLength][andLength].param1, indicatorSet.indicators[orLength][andLength].param2, indicatorSet.indicators[orLength][andLength].param3])
        //         if (i >= larger) {
        //             count++
        //         }
        //     }
        // }
        // console.log('ts', new Date(x[0]), compare1Price)

        let canTrade = false
        for (let i = 0; i < indicatorSet.indicators.length; i++) {
            if (compare1Price[i] == undefined) continue
            canTrade = true
            for (let j = 0; j < orIndicator.length; j++) {
                // console.log('ts', new Date(x[0]), 'i', i, 'j', j, 'p1', compare1Price[i][j],'p2',compare2Price[i][j],'c',indicatorSet.indicators[i][j].condition,'a^b',aOverb,'con',aOverb[indicatorSet.position][indicatorSet.actionType][i][j],(compare1Price[i][j] < compare2Price[i][j] && aOverb[indicatorSet.position][indicatorSet.actionType][i][j]),!(compare1Price[i][j] < compare2Price[i][j] && aOverb[indicatorSet.position][indicatorSet.actionType][i][j]))

                switch (indicatorSet.indicators[i][j].condition) {
                    case '^':
                        if (!(compare1Price[i][j] > compare2Price[i][j] && !aOverb[indicatorSet.position][indicatorSet.actionType][i][j])) {
                            canTrade = false
                        }
                        break
                    case 'v':
                        if (!(compare1Price[i][j] < compare2Price[i][j] && aOverb[indicatorSet.position][indicatorSet.actionType][i][j])) {
                            canTrade = false

                        }
                        break
                    case '>':
                        if (!(compare1Price[i][j] > compare2Price[i][j])) {
                            canTrade = false
                        }
                        break
                    case '<':
                        if (!(compare1Price[i][j] > compare2Price[i][j])) {
                            canTrade = false
                            // console.log("can't trade")
                        }
                        break
                }
                // console.log(i, new Date(x[0]),'can"t trade',compare1Price[i][j],compare2Price[i][j])
                if (!canTrade) break
            }
            if (canTrade) break
        }
        if (canTrade) {
            doAction(indicatorSet, indicator, orIndex, andIndex, hasEntry, resultData, x, i)
        }
        //     switch (indicator.condition) {
        //     case '^':
        //         //cross above
        //         if (compare1Price[orIndex][andIndex] > compare2Price[orIndex][andIndex] && !aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]) {
        //             doAction(indicatorSet, indicator, orIndex, andIndex, hasEntry, resultData, x, i)
        //         }
        //         break
        //     case 'v':
        //         //cross under
        //         if (compare1Price[orIndex][andIndex] < compare2Price[orIndex][andIndex] && aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]) {
        //             // if (!hasEntry[indicatorSet.position]) {
        //             //     console.log(i, new Date(x[0]), indicator.id + ':Buy')
        //             doAction(indicatorSet, indicator, orIndex, andIndex, hasEntry, resultData, x, i)
        //             // } else {
        //             //     console.log(i, new Date(x[0]), indicator.id + ':Sell')
        //             //     resultData[indicatorSet.position]['trades'].push('Sell')
        //             // }
        //             // hasEntry[indicatorSet.position] = !hasEntry[indicatorSet.position]
        //         }
        //         break
        //     case '>':
        //         //greater then
        //         if (compare1Price[orIndex][andIndex] > compare2Price[orIndex][andIndex]) {
        //             console.log(i, new Date(x[0]), indicator.id + ':greater than')
        //             hasEntry[indicatorSet.position] = !hasEntry[indicatorSet.position]
        //         }
        //         break
        //     case '<':
        //         //less than
        //         if (compare1Price[orIndex][andIndex] < compare2Price[orIndex][andIndex]) {
        //             console.log(i, new Date(x[0]), indicator.id + ':smaller than')
        //             hasEntry[indicatorSet.position] = !hasEntry[indicatorSet.position]
        //         }
        //         break
        // }

    }
    // console.log(i, new Date(x[0]), indicator.id + ':'+aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex])


}

const doAction = (indicatorSet, indicator, orIndex, andIndex, hasEntry, resultData, x, i) => {
    if (!hasEntry[indicatorSet.position]) {
        console.log(i, new Date(x[0]), indicator.id + ':Buy')
        // console.log(indicatorSet.position+'-'+indicatorSet.actionType+'-'+orIndex+'-'+andIndex+'-a')

        // resultData[indicatorSet.position]['trades'].push({
        //     type: 'flags',
        //     data: [{
        //         x: x[0], // Point where the flag appears
        //         title: 'Buy', // Title of flag displayed on the chart
        //         text: 'Buy' // Text displayed when the flag are highlighted.
        //     }],
        //     onSeries: indicatorSet.position + '-' + indicatorSet.actionType + '-' + orIndex + '-' + andIndex + '-a', // Id of which series it should be placed on. If not defined
        //     name: 'Buy:' + x[4],
        //     // the flag series will be put on the X axis
        //     shape: 'flag' // Defines the shape of the flags.
        // })
        resultData[indicatorSet.position]['trades']['buy'].push({
            x: x[0], // Point where the flag appears
            title: 'Buy', // Title of flag displayed on the chart
            text: 'Buy at $' + x[4] // Text displayed when the flag are highlighted.

        })
    } else {
        console.log(i, new Date(x[0]), indicator.id + ':Sell.')
        resultData[indicatorSet.position]['trades']['sell'].push({
            x: x[0], // Point where the flag appears
            title: 'Sell', // Title of flag displayed on the chart
            text: 'Sell at $' + x[4] // Text displayed when the flag are highlighted.
        })
        // resultData[indicatorSet.position]['trades'].push({
        //     type: 'flags',
        //     data: [{
        //         x: x[0], // Point where the flag appears
        //         title: 'Sell', // Title of flag displayed on the chart
        //         text: 'Sell' // Text displayed when the flag are highlighted.
        //     }],
        //     onSeries: indicatorSet.position + '-' + indicatorSet.actionType + '-' + orIndex + '-' + andIndex + '-a', // Id of which series it should be placed on. If not defined
        //     // the flag series will be put on the X axis
        //     name: 'Sell:' + x[4],
        //     shape: 'flag' // Defines the shape of the flags.
        // })
    }
    hasEntry[indicatorSet.position] = !hasEntry[indicatorSet.position]
}

const requestData = ({
    date,
    endDate,
    productType,
    productExchange,
    productCode,
    dataset,
    index
}) => {
    if (state.breakBacktest) {
        console.log('break')
        return
    }
    if (date.diff(endDate, 'days') <= 0) {
        new Promise((resolve, reject) => {
            const url = rootUrl + '/backtest/dataset?product_id=' + productCode + '&product_exchange=' + productExchange + '&product_type=' + productType + '&date=' + date.format('YYYYMMDD')

            db.findOne({
                "config.url": url
            }, (err, data) => {
                if (data) {
                    resolve(data)
                } else {
                    Vue.http.get(url)
                        .then((res) => {
                            // if (res.data.success) {
                            db.insert(res)
                            resolve(res)
                            // }
                        }).catch((e) => {
                            console.log(e)
                        })
                }
            })
        }).then((data) => {
            data = data.data.data
            if (data.length) {
                let rawData = []
                // let ohlc = []
                // let volume = []
                _.map(data, (x, i) => {
                    const ts = moment(x[0] + ' ' + x[1], 'DD/MM/YYYY HH:mm:ss').unix() * 1000
                    const open = parseFloat(x[2])
                    const high = parseFloat(x[3])
                    const low = parseFloat(x[4])
                    const close = parseFloat(x[5])
                    const vol = parseFloat(x[6])
                    rawData.push([ts, open, high, low, close, vol])
                    // ohlc.push([ts, open, high, low, close])
                    // volume.push([ts, vol])
                })
                store.commit(ADD_TO_BUFFER, {
                    dataset,
                    rawData,
                    // ohlc,
                    // volume
                })
                // requestData({
                //     date: date.add(1, 'days'),
                //     endDate,
                //     productType,
                //     productExchange,
                //     productCode,
                //     dataset,
                //     index
                // })
                // } else {
            }
            requestData({
                date: date.add(1, 'days'),
                endDate,
                productType,
                productExchange,
                productCode,
                dataset,
                index
            })

        })
    } else {
        index++
        if (index < state.products.length) {
            const splitProduct = state.products[index].dataset.split('-')
            const splitDate = state.products[index].periodSelected.split('~')
            const start = moment(new Date(splitDate[0])).format('YYYYMMDD')
            const end = moment(new Date(splitDate[1])).format('YYYYMMDD')
            store.commit(SET_INIT_KEY, state.products[index].dataset)
            requestData({
                date: moment(new Date(splitDate[0])),
                endDate: moment(new Date(splitDate[1])),
                productType: splitProduct[0],
                productExchange: splitProduct[1],
                productCode: splitProduct[2],
                dataset: state.products[index].dataset,
                index
            })
        } else {
            store.commit(RUN_BACKTEST)
            console.log('finish load dataa')
            store.commit(START_CALCULATE, true)
            startCalculate()
        }
    }
}

const actions = {
    runBacktest({
        commit
    }) {
        console.log(state.rawData,'rdddddsseeddds')
        store.commit(START_LOAD_DATA, true)
        store.commit(SET_INIT_KEY, state.products[0].dataset)
        const splitProduct = state.products[0].dataset.split('-')
        const splitDate = state.products[0].periodSelected.split('~')
        const start = moment(new Date(splitDate[0])).format('YYYYMMDD')
        const end = moment(new Date(splitDate[1])).format('YYYYMMDD')
        requestData({
            date: moment(new Date(splitDate[0])),
            endDate: moment(new Date(splitDate[1])),
            productType: splitProduct[0],
            productExchange: splitProduct[1],
            productCode: splitProduct[2],
            dataset: state.products[0].dataset,
            index: 0
        })
    },
    saveProduct({
        commit
    }, product) {
        commit(SAVE_PRODUCT, product)
    },
    removeProduct({
        commit
    }, indexes) {
        commit(REMOVE_PRODUCT, indexes)
    }
}

export default {
    state,
    mutations,
    actions
}
