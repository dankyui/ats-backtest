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
const START_LOAD_DATA='START_LOAD_DATA'
const START_CALCULATE='START_CALCULATE'
const ADD_CAL_SET='ADD_CAL_SET'
const REFRESH_PROGRESS='REFRESH_PROGRESS'
const state = {
    products: [{
            "id": 0,
            "dataset": "STK-SEHK-1",
            "periodSelected": "2017-09-1 00:00:00 ~ 2017-10-5 00:00:00"
        },
        {
            "id": 1,
            "dataset": "STK-SEHK-2",
            "periodSelected": "2017-09-9 00:00:00 ~ 2017-10-12 00:00:00"
        }
    ],
    strategies: ['Strategy A', 'Strategy B', 'Strategy C'],
    selectedStrategies: [],
    capital: 1,
    header: 'loadDataset',
    dataset: {},
    ohlc: {},
    volume: {},
    getAllData: false,
    breakBacktest: false,
    running: false,
    startLoadData:false,
    startCalculate:false,
    calSet: {},
    temp:[]
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
        state.ohlc[data.dataset].push(...data.ohlc)
        state.volume[data.dataset].push(...data.volume)
    },
    [SET_INIT_KEY](state, dataset) {
        Vue.set(state.ohlc, dataset, [])
        Vue.set(state.volume, dataset, [])
    },
    [CLEAR_BACKTEST](state) {
        state.products = []
        state.selectedStrategies = []
        state.breakBacktest = false
        state.startLoadData=false
        state.startCalculate=false
        state.ohlc = {}
        state.volume = {}
    },
    [BREAK_BACKTEST](state) {
        state.breakBacktest = true
    },
    [BACKTEST_RUNNING](state, boo) {
        state.running = boo
    },
    [START_LOAD_DATA](state,boo){
        state.startLoadData=boo
    },
    [START_CALCULATE](state,boo){
        state.startCalculate=boo
    },
    [ADD_CAL_SET](state,data){
        state.temp=data
    },
    [REFRESH_PROGRESS](state){
        state.startLoadData=false
        state.startCalculate=false
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
        // setTimeout(()=>{
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
                let ohlc = []
                let volume = []
                _.map(data, (x, i) => {
                    const ts = moment(x[0] + ' ' + x[1], 'DD/MM/YYYY HH:mm:ss').unix() * 1000
                    const open = parseFloat(x[2])
                    const high = parseFloat(x[3])
                    const low = parseFloat(x[4])
                    const close = parseFloat(x[5])
                    const vol = parseFloat(x[6])
                    ohlc.push([ts, open, high, low, close])
                    volume.push([ts, vol])
                })
                store.commit(RUN_BACKTEST, {
                    dataset,
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
        // },900*_.random())
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
            store.commit(START_CALCULATE,true)
            startCalculate()
        }
    }
}

const startCalculate = ({
    product = state.products[0].dataset,
    index:index=0
}={}) => {

    let temp=[]
    _.map(state.ohlc[product],(x,i)=>{
        if(i<3){
            temp.push([x[0],x[4]])
        }else{
            temp.push([x[0],_.round(_.map(state.ohlc[product].slice(i-3,i),x=>x[4]).reduce((a,b)=>a+b)/3,2)])
        }
    })
    store.commit(ADD_CAL_SET,temp)
    store.commit(BACKTEST_RUNNING,false)

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
