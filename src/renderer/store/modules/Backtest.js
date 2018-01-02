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

const state = {
    products: [{
            "id": 0,
            "dataset": "STK-SEHK-1",
            "periodSelected": "2017-09-1 00:00:00 ~ 2017-10-5 00:00:00"
        },
        // {
        //     "id": 1,
        //     "dataset": "STK-SEHK-2",
        //     "periodSelected": "2017-09-9 00:00:00 ~ 2017-10-12 00:00:00"
        // }
    ],
    strategies: ['Strategy A', 'Strategy B', 'Strategy C'],
    selectedStrategies: [],
    capital: 1,
    header: 'loadDataset',
    rawData: {},
    ohlc: {},
    volume: {},
    getAllData: false,
    breakBacktest: false,
    running: false,
    startLoadData: false,
    startCalculate: false,
    calSet: {}
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
    [RUN_BACKTEST](state, data) {
        state.rawData[data.dataset].push(...data.rawData)
        state.ohlc[data.dataset].push(...data.ohlc)
        state.volume[data.dataset].push(...data.volume)
    },
    [SET_INIT_KEY](state, dataset) {
        Vue.set(state.rawData, dataset, [])
        Vue.set(state.ohlc, dataset, [])
        Vue.set(state.volume, dataset, [])
        Vue.set(state.calSet, dataset, [])
        Vue.set(state.calSet, dataset+'_timeframe', [])
    },
    [CLEAR_BACKTEST](state) {
        state.products = []
        state.selectedStrategies = []
        state.breakBacktest = false
        state.startLoadData = false
        state.startCalculate = false
        state.rawData={}
        state.ohlc = {}
        state.volume = {}
        state.calSet={}
    },
    [BREAK_BACKTEST](state) {
        state.breakBacktest = true
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
        data,
        suffix
    }) {
        // console.log(product,data)
        state.calSet[product+suffix] = data
    }
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
                let rawData=[]
                let ohlc = []
                let volume = []
                _.map(data, (x, i) => {
                    const ts = moment(x[0] + ' ' + x[1], 'DD/MM/YYYY HH:mm:ss').unix() * 1000
                    const open = parseFloat(x[2])
                    const high = parseFloat(x[3])
                    const low = parseFloat(x[4])
                    const close = parseFloat(x[5])
                    const vol = parseFloat(x[6])
                    rawData.push([ts, open, high, low, close,vol])
                    ohlc.push([ts, open, high, low, close])
                    volume.push([ts, vol])
                })
                store.commit(RUN_BACKTEST, {
                    dataset,
                    rawData,
                    ohlc,
                    volume
                })
                requestData({
                    date: date.add(1, 'days'),
                    endDate,
                    productType,
                    productExchange,
                    productCode,
                    dataset,
                    index
                })
            } else {
                requestData({
                    date: date.add(1, 'days'),
                    endDate,
                    productType,
                    productExchange,
                    productCode,
                    dataset,
                    index
                })
            }

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
            console.log('finish load dataa')
            store.commit(START_CALCULATE, true)
            startCalculate()
        }
    }
}

const startCalculate = ({
    product = state.products[0].dataset,
    index: index = 0,
    timeframe = 5
} = {}) => {
    if (state.breakBacktest) {
        console.log('break')
        return
    }

    let data = []
    let groups = _.groupBy(state.rawData[product], (data) => {
        return moment(data[0]).startOf('day').format();
    })

    _.map(groups, (x) => {
        for (let i = 0; i < x.length; i+=timeframe) {
            let o=[]
            let h=[]
            let l=[]
            let c=[]
            let v=[]

            for(let j=0;j<timeframe&&j<x.length;j++){
            o.push(x[i+j][1])
            h.push(x[i+j][2])
            l.push(x[i+j][3])
            c.push(x[i+j][4])
            v.push(x[i+j][5])
            }
            data.push([x[i][0],o[0],Math.max(...h),Math.min(...l),c[c.length-1],_.reduce(v,(a,b)=>a+b)])
        }
    })

    console.log(data)

    // _.map(state.ohlc[product], (x, i) => {
    //     if (i < 50) {
    //         data.push([x[0], x[4]])
    //     } else {
    //         data.push([x[0], _.round(_.map(state.ohlc[product].slice(i - 50, i), x => x[4]).reduce((a, b) => a + b) / 50, 2)])
    //     }
    // })

    store.commit(SET_CAL_SET, {
        product,
        data,
        suffix:'_timeframe'
    })
    store.commit(BACKTEST_RUNNING, false)
    index++
    if (index >= state.products.length) return
    startCalculate({
        product: state.products[index].dataset,
        index
    })
    // console.log(JSON.stringify(temp))

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
