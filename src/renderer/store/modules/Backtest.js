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
const START_GEN_RESULT = 'START_GEN_RESULT'
const REFRESH_PROGRESS = 'REFRESH_PROGRESS'
const SET_CAL_SET = 'SET_CAL_SET'
const SET_SIGNAL = 'SET_SIGNAL'
const SET_RESULT_SET = 'SET_RESULT_SET'
const ADD_TO_BUFFER = 'ADD_TO_BUFFER'
const CHANGE_OPEN_POS = 'CHANGE_OPEN_POS'
const SET_CAPITAL = 'SET_CAPITAL'
const ADD_EC = 'ADD_EC'

const state = {
    products: [{
            "id": 0,
            "dataset": "STK-SEHK-1",
            "periodSelected": "2017-08-1 00:00:00 ~ 2017-10-31 00:00:00"
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
        priceType: 'open',
        strategyType: 'longShort',
        value: [{
                position: 'long',
                actionType: 'entry',
                indicators: [
                    [{
                        id: 0,
                        type: 'ma',
                        param1: 1,
                        param2: 9,
                        param3: 0,
                        compare1: 'close',
                        compare2: 'ma_slow',
                        condition: '^'
                    }],
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
                indicators: [
                    [{
                            id: 2,
                            type: 'ma',
                            param1: 1,
                            param2: 9,
                            param3: 0,
                            compare1: 'close',
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
            },
            {
                position: 'short',
                actionType: 'entry',
                indicators: [
                    [{
                            id: 3,
                            type: 'ma',
                            param1: 1,
                            param2: 5,
                            param3: 0,
                            compare1: 'close',
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
            },
            {
                position: 'short',
                actionType: 'exit',
                indicators: [
                    [{
                            id: 4,
                            type: 'ma',
                            param1: 1,
                            param2: 5,
                            param3: 0,
                            compare1: 'close',
                            compare2: 'ma_slow',
                            condition: '^'
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
            }
        ]
    }],
    selectedStrategies: [0],
    initialCapital: 10000,
    capital: {},
    size: 100,
    confirmBar: 0,
    header: 'loadDataset',
    rawData: {},
    buffer: {},
    getAllData: false,
    breakBacktest: false,
    running: false,
    startLoadData: false,
    startCalculate: false,
    startGenResult: false,
    calSet: {},
    signals: {},
    resultSet: {},
    equityCurve: {},
    openPos: {}
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
        Vue.set(state.calSet, dataset, {})
        Vue.set(state.resultSet, dataset, [])
        Vue.set(state.equityCurve, dataset, {})
        Vue.set(state.openPos, dataset, {})
        Vue.set(state.signals, dataset, {})

        // Vue.set(state.calSet, dataset + '_timeframe', [])
    },
    [CLEAR_BACKTEST](state) {
        state.products = []
        state.selectedStrategies = []
        state.breakBacktest = false
        state.startLoadData = false
        state.startCalculate = false
        state.startGenResult = false
        state.running = false
        state.rawData = {}
        state.buffer = {}
        state.calSet = {}
        state.resultSet = {}
        state.equityCurve = {}
        state.openPos = {}
        state.signals = {}
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
    [START_GEN_RESULT](state, boo) {
        state.startGenResult = boo
    },
    [REFRESH_PROGRESS](state) {
        state.breakBacktest = false
        state.startLoadData = false
        state.startCalculate = false
        state.startGenResult = false
        state.running = false
        state.rawData = {}
        state.buffer = {}
        state.calSet = {}
        state.resultSet = {}
        state.equityCurve = {}
        state.openPos = {}
        state.capital = {}
        state.signals = {}

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
    [SET_SIGNAL](state, {
        product,
        strategy_id,
        signals
    }) {
        state.signals[product][strategy_id] = signals
    },
    [SET_RESULT_SET](state, {
        product,
        strategy_id,
        resultData
    }) {
        state.resultSet[product][strategy_id] = resultData
    },
    [CHANGE_OPEN_POS](state, {
        product,
        strategy_id,
        position,
        isBuy,
        entryPrice
    }) {
        if (!state.openPos[product]) {
            state.openPos[product] = {}
        }
        if (!state.openPos[product][strategy_id]) {
            state.openPos[product][strategy_id] = {}
        }
        if (!state.openPos[product][strategy_id][position]) {
            state.openPos[product][strategy_id][position] = []
        }
        if (isBuy) {
            state.openPos[product][strategy_id][position].push(entryPrice)
        } else {
            state.openPos[product][strategy_id][position].pop()
        }
    },
    [SET_CAPITAL](state, {
        product,
        strategy_id,
        position,
        capital
    }) {
        state.capital[product][strategy_id][position] = capital
    },
    [ADD_EC](state, {
        product,
        strategy_id,
        position,
        data
    }) {
        state.equityCurve[product][strategy_id][position].push(data)
    }
}

const priceTypeToPrice = (type, tick) => {
    switch (type) {
        case 'open':
            return tick[1]
        case 'high':
            return tick[2]
        case 'low':
            return tick[3]
        case 'close':
            return tick[4]
    }
}

const genResult = ({
    product = state.products[0].dataset,
    index: index = 0
} = {}) => {
    console.log('finish')
    store.commit(BACKTEST_RUNNING, false)
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
        let rawData = [...state.rawData[product]].reverse()
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
        let aOverb = {}
        let hasEntry = {}
        let signals = {}

        //use grouped(timeframe) data to calculate
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
                        if (!calData[indicatorSet.position]) {
                            calData[indicatorSet.position] = {}
                        }

                        if (hasEntry[indicatorSet.position] == undefined) {
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

                        if (!signals[indicatorSet.position]) {
                            signals[indicatorSet.position] = {}
                        }

                        if (!signals[indicatorSet.position][indicatorSet.actionType]) {
                            signals[indicatorSet.position][indicatorSet.actionType] = []
                        }

                        if (indicator.type == 'ma') {

                            if (indicator.compare1 == 'close') {
                                calData[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]['compareA'].push([x[0], _.round(x[4], 2)])
                            } else {
                                if (i < indicator.param1 - 1) {} else {
                                    calData[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]['compareA'].push([x[0], _.round(_.map(data.slice(i - indicator.param1 + 1, i + 1), x => priceTypeToPrice(strategy.priceType, x)).reduce((a, b) => a + b) / indicator.param1, 2)])
                                }
                                //+1 to calculate ma inclusively
                            }

                            if (i < indicator.param2 - 1) {} else {
                                calData[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]['compareB'].push([x[0], _.round(_.map(data.slice(i - indicator.param2 + 1, i + 1), x => priceTypeToPrice(strategy.priceType, x)).reduce((a, b) => a + b) / indicator.param2, 2)])
                            }
                        } //end of ma

                        if (i < indicator.param1 - 1 || i < indicator.param2 - 1) {} else {
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
                                compare1Price[orIndex][andIndex] = _.round(_.map(data.slice(i - indicator.param1 + 1, i + 1), x => priceTypeToPrice(strategy.priceType, x)).reduce((a, b) => a + b) / indicator.param1, 2)
                            } else
                            if (indicator.compare1 == 'close') {
                                compare1Price[orIndex][andIndex] = _.round(x[4], 2)
                            }


                            compare2Price[orIndex][andIndex] = _.round(_.map(data.slice(i - indicator.param2 + 1, i + 1), x => priceTypeToPrice(strategy.priceType, x)).reduce((a, b) => a + b) / indicator.param2, 2)

                            //initialize object
                            if (i == indicator.param1 - 1 || i == indicator.param2 - 1) {
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
                            }

                            if (indicatorSet.actionType == 'entry' && !hasEntry[indicatorSet.position]) {
                                //entry
                                passCondition(product, strategy, compare1Price, compare2Price, indicatorSet, orIndicator, indicator, orIndex, andIndex, x, i, calData, aOverb, hasEntry, signals)
                            } else
                            if (indicatorSet.actionType == 'exit' && hasEntry[indicatorSet.position]) {
                                //exit
                                passCondition(product, strategy, compare1Price, compare2Price, indicatorSet, orIndicator, indicator, orIndex, andIndex, x, i, calData, aOverb, hasEntry, signals)
                            }
                            if (compare1Price[orIndex][andIndex] > compare2Price[orIndex][andIndex] && !aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]) {
                                aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex] = true
                            } else if (compare1Price[orIndex][andIndex] < compare2Price[orIndex][andIndex] && aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex]) {
                                aOverb[indicatorSet.position][indicatorSet.actionType][orIndex][andIndex] = false
                            }
                        }
                    })
                })
            })
        })

        store.commit(SET_CAL_SET, {
            product,
            strategy_id: strategy.id,
            calData
        })
        store.commit(SET_SIGNAL, {
            product,
            strategy_id: strategy.id,
            signals
        })
        //end of indicator calculation

        let resultData = {}
        hasEntry = {}
        let signalsCopy = _.cloneDeep(signals)
        let openPos = {}
        let posArray = []
        let tempCapital = {}
        if (strategy.strategyType == 'long') {
            posArray.push('long')
        } else if (strategy.strategyType == 'short') {
            posArray.push('short')
        } else if (strategy.strategyType == 'longShort') {
            posArray.push('long', 'short', 'longShort')
        }
        if (!resultData['capital']) {
            resultData['capital'] = {}
        }
        if (!resultData['equityCurve']) {
            resultData['equityCurve'] = {}
        }
        if (!resultData['trades']) {
            resultData['trades'] = {}
        }
        if (!resultData['noOfTrade']) {
            resultData['noOfTrade'] = {}
        }
        if (strategy.strategyType == 'longShort') {
            if (!resultData['capital']['longShort']) {
                resultData['capital']['longShort'] = state.initialCapital
            }
            if (!resultData['equityCurve']['longShort']) {
                resultData['equityCurve']['longShort'] = []
            }
            if (!resultData['trades']['longShort']) {
                resultData['trades']['longShort'] = {}
            }
            if (!resultData['trades']['longShort']['entry']) {
                resultData['trades']['longShort']['entry'] = []
            }
            if (!resultData['trades']['longShort']['exit']) {
                resultData['trades']['longShort']['exit'] = []
            }
            if (!resultData['noOfTrade']['longShort']) {
                resultData['noOfTrade']['longShort'] = 0
            }
            if (!hasEntry['longShort']) {
                hasEntry['longShort'] = {}
            }
            if (!openPos['longShort']) {
                openPos['longShort'] = []
            }
        }

        //start calculating P&L
        _.map(state.rawData[product], (x, i) => {
            _.map(strategy.value, indicatorSet => {
                if (!resultData['capital'][indicatorSet.position]) {
                    resultData['capital'][indicatorSet.position] = state.initialCapital
                }
                if (!resultData['equityCurve'][indicatorSet.position]) {
                    resultData['equityCurve'][indicatorSet.position] = []
                }
                if (!resultData['trades'][indicatorSet.position]) {
                    resultData['trades'][indicatorSet.position] = {}
                }
                if (!resultData['trades'][indicatorSet.position][indicatorSet.actionType]) {
                    resultData['trades'][indicatorSet.position][indicatorSet.actionType] = []
                }
                if (resultData['noOfTrade'][indicatorSet.position] == undefined) {
                    resultData['noOfTrade'][indicatorSet.position] = 0
                }

                if (hasEntry[indicatorSet.position] == undefined) {
                    hasEntry[indicatorSet.position] = false
                }

                if (!openPos[indicatorSet.position]) {
                    openPos[indicatorSet.position] = []
                }



                if (signalsCopy[indicatorSet.position][indicatorSet.actionType].length == 0) return
                let tradeTime=1
                if(strategy.priceType=='open')tradeTime=0
                if (x[0] >= signalsCopy[indicatorSet.position][indicatorSet.actionType][0].x + ((state.confirmBar+tradeTime) * strategy.timeframe * 60 * 1000)) {
                    const signal = signalsCopy[indicatorSet.position][indicatorSet.actionType].shift()
                    if (indicatorSet.actionType == 'entry') {
                        openPos[indicatorSet.position].push(priceTypeToPrice(strategy.priceType, x))
                    } else if (indicatorSet.actionType == 'exit') {

                        const entryPrice = _.reduce(openPos[indicatorSet.position],(a,b)=>a+b)/openPos[indicatorSet.position].length
                        const curPrice = priceTypeToPrice(strategy.priceType, x)
                        const diff = Math.round((curPrice - entryPrice) * state.size, 2)
                        resultData['capital'][indicatorSet.position] += diff
                        tempCapital[indicatorSet.position] = resultData['capital'][indicatorSet.position]
                        openPos[indicatorSet.position] = []

                    }
                    resultData['trades'][indicatorSet.position][indicatorSet.actionType].push(signal)

                    resultData['noOfTrade'][indicatorSet.position]++
                        hasEntry[indicatorSet.position] = !hasEntry[indicatorSet.position]
                }
            })
            _.map(posArray, (position) => {
                if (!tempCapital[position]) {
                    tempCapital[position] = state.initialCapital
                }
                if (openPos[position].length > 0) {
                    tempCapital[position] = resultData['capital'][position]

                    const entryPrice = _.reduce(openPos[position],(a,b)=>a+b)/openPos[position].length
                    const curPrice = priceTypeToPrice(strategy.priceType, x)
                    const diff = Math.round((curPrice - entryPrice) * state.size, 2)
                    tempCapital[position] += diff
                    // console.log(position, ':', openPos, resultData['capital'][position], new Date(x[0]), x, entryPrice, curPrice, diff, openPos[position][0])

                }
                resultData['equityCurve'][position].push([x[0], tempCapital[position]])
            })
        })
        console.log(resultData)

        store.commit(SET_RESULT_SET, {
            product,
            strategy_id: strategy.id,
            resultData
        })
        //end of calculating P&L




    })
    index++
    if (index >= state.products.length) {
        store.commit(START_GEN_RESULT, true)
        console.log('finish cal data')
        genResult()
    } else {
        startCalculate({
            product: state.products[index].dataset,
            index
        })
    }
}

const passCondition = (product, strategy, compare1Price, compare2Price, indicatorSet, orIndicator, indicator, orIndex, andIndex, x, i, calData, aOverb, hasEntry, signals) => {
    if (andIndex == orIndicator.length - 1) {
        let hasSignal = false
        for (let i = 0; i < indicatorSet.indicators.length; i++) {
            if (compare1Price[i] == undefined) continue
            hasSignal = true
            for (let j = 0; j < orIndicator.length; j++) {
                switch (indicatorSet.indicators[i][j].condition) {
                    case '^':
                        if (!(compare1Price[i][j] > compare2Price[i][j] && !aOverb[indicatorSet.position][indicatorSet.actionType][i][j])) {
                            hasSignal = false
                        }
                        break
                    case 'v':
                        if (!(compare1Price[i][j] < compare2Price[i][j] && aOverb[indicatorSet.position][indicatorSet.actionType][i][j])) {
                            hasSignal = false
                        }
                        break
                    case '>':
                        if (!(compare1Price[i][j] > compare2Price[i][j])) {
                            hasSignal = false
                        }
                        break
                    case '<':
                        if (!(compare1Price[i][j] > compare2Price[i][j])) {
                            hasSignal = false
                        }
                        break
                }
                if (!hasSignal) break
            }
            if (hasSignal) break
        }
        if (hasSignal) {
            markSignal(product, strategy, indicatorSet, indicator, orIndex, andIndex, hasEntry, x, i, calData, signals)
        }
    }
}

const markSignal = (product, strategy, indicatorSet, indicator, orIndex, andIndex, hasEntry, x, i, calData, signals) => {
    if (!hasEntry[indicatorSet.position]) {
        // store.commit(CHANGE_OPEN_POS, {
        //     product: product,
        //     strategy_id: strategy.id,
        //     position: indicatorSet.position,
        //     isBuy: true,
        //     entryPrice: priceTypeToPrice(strategy.priceType, x)
        // })
        let title = 'LE',
            text = 'Long Entry: ' + backtest.conditionString(indicator)
        if (indicatorSet.position == 'short') {
            title = 'SE'
            text = 'Short Entry: ' + backtest.conditionString(indicator)
        }
        signals[indicatorSet.position][indicatorSet.actionType].push({
            x: x[0], // Point where the flag appears
            title: title, // Title of flag displayed on the chart
            text: text // Text displayed when the flag are highlighted.
        })
    } else {
        // let capital = state.capital[product][strategy.id][indicatorSet.position] || state.initialCapital
        // const entryPrice = state.openPos[product][strategy.id][indicatorSet.position][0]
        // const curPrice = priceTypeToPrice(strategy.priceType, x)

        // const diff = Math.round((curPrice - entryPrice) * state.size, 2)
        // capital += diff

        // store.commit(SET_CAPITAL, {
        //     product: product,
        //     strategy_id: strategy.id,
        //     position: indicatorSet.position,
        //     capital
        // })
        // store.commit(CHANGE_OPEN_POS, {
        //     product: product,
        //     strategy_id: strategy.id,
        //     position: indicatorSet.position,
        //     isBuy: false
        // })

        let title = 'LX',
            text = 'Long Exit: ' + backtest.conditionString(indicator)
        if (indicatorSet.position == 'short') {
            title = 'SX'
            text = 'Short Exit: ' + backtest.conditionString(indicator)
        }
        signals[indicatorSet.position][indicatorSet.actionType].push({
            x: x[0], // Point where the flag appears
            title: title, // Title of flag displayed on the chart
            text: text // Text displayed when the flag are highlighted.
        })
        //     if (resultData[indicatorSet.position]['noOfTrades'] == undefined) {
        //         resultData[indicatorSet.position]['noOfTrades'] = 0
        //     }
        //     resultData[indicatorSet.position]['noOfTrades']++
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
                })
                store.commit(ADD_TO_BUFFER, {
                    dataset,
                    rawData,
                })
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
            store.commit(RUN_BACKTEST) //copy buffer data to rawData
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
