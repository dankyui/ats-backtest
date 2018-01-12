
const state = {
}

const mutations = {

}

const actions = {
    temp({
        commit
    }) {
        if (!state.equityCurve[product]) {
    state.equityCurve[product] = {}
}
if (!state.equityCurve[product][strategy.id]) {
    state.equityCurve[product][strategy.id] = {}
}

if (!state.equityCurve[product][strategy.id][indicatorSet.position]) {
    state.equityCurve[product][strategy.id][indicatorSet.position] = []
}

if (!state.capital[product]) {
    state.capital[product] = {}
}

if (!state.capital[product][strategy.id]) {
    state.capital[product][strategy.id] = {}
}

if (!state.openPos[product]) {
    state.openPos[product] = {}
}
if (!state.openPos[product][strategy.id]) {
    state.openPos[product][strategy.id] = {}
}

if (!state.openPos[product][strategy.id][indicatorSet.position]) {
    state.openPos[product][strategy.id][indicatorSet.position] = []
}

if (strategy.strategyType == 'longShort') {
    if (!state.openPos[product][strategy.id]['longShort']) {
        state.openPos[product][strategy.id]['longShort'] = []
    }
    if (!state.equityCurve[product][strategy.id]['longShort']) {
        state.equityCurve[product][strategy.id]['longShort'] = []
    }
}

let capital = state.capital[product][strategy.id][indicatorSet.position] || state.initialCapital


if (!resultData[indicatorSet.position]) {
    resultData[indicatorSet.position] = {}
}
if (!resultData[indicatorSet.position]['trades']) {
    resultData[indicatorSet.position]['trades'] = {}
}
if (!resultData[indicatorSet.position]['trades']['entry']) {
    resultData[indicatorSet.position]['trades']['entry'] = []
}
if (!resultData[indicatorSet.position]['trades']['exit']) {
    resultData[indicatorSet.position]['trades']['exit'] = []
}

if (!resultData[indicatorSet.position]['signals']) {
    resultData[indicatorSet.position]['signals'] = {}
}

if (!resultData[indicatorSet.position]['signals']['entry']) {
    resultData[indicatorSet.position]['signals']['entry'] = []
}

if (!resultData[indicatorSet.position]['signals']['exit']) {
    resultData[indicatorSet.position]['signals']['exit'] = []
}

if (strategy.strategyType == 'longShort') {
    if (!resultData['longShort']) {
        resultData['longShort'] = {}
    }
    if (!resultData['longShort']['trades']) {
        resultData['longShort']['trades'] = {}
    }
    if (!resultData['longShort']['trades']['entry']) {
        resultData['longShort']['trades']['entry'] = []
    }
    if (!resultData['longShort']['trades']['exit']) {
        resultData['longShort']['trades']['exit'] = []
    }
    if (hasEntry['longShort'] == undefined) {
        hasEntry['longShort'] = false
    }
}



if (state.openPos[product][strategy.id][indicatorSet.position] != undefined && state.openPos[product][strategy.id][indicatorSet.position].length >
    0) {
    // console.log('pos', state.openPos[product][strategy.id])
    const entryPrice = state.openPos[product][strategy.id][indicatorSet.position][0]
    const curPrice = priceTypeToPrice(strategy.priceType, x)

    const diff = Math.round((curPrice - entryPrice) * state.size, 2)
    capital += diff
}

// console.log(new Date(x[0]), capital)
store.commit(ADD_EC, {
    product: product,
    strategy_id: strategy.id,
    position: indicatorSet.position,
    data: [x[0], capital]
})


//if has open position,check current price diff with the entry price
if(strategy.strategyType=='longShort'&&indicatorSet.position=='short'){
    if (state.openPos[product][strategy.id]['longShort'] != undefined && state.openPos[product][strategy.id]['longShort'].length >
        0) {
        // console.log('pos', state.openPos[product][strategy.id])
        const entryPrice = state.openPos[product][strategy.id]['longShort'][0]
        const curPrice = priceTypeToPrice(strategy.priceType, x)

        const diff = Math.round((curPrice - entryPrice) * state.size, 2)
        capital += diff
    }

    // console.log(new Date(x[0]), capital)
    store.commit(ADD_EC, {
        product: product,
        strategy_id: strategy.id,
        position: 'longShort',
        data: [x[0], capital]
    })
}

//handle longShort
if(strategy.strategyType=='longShort'){
    if(!hasEntry['longShort']){
        store.commit(CHANGE_OPEN_POS, {
            product: product,
            strategy_id: strategy.id,
            position: 'longShort',
            isBuy: true,
            entryPrice: priceTypeToPrice(strategy.priceType, x)
        })
        let title = 'Buy',
            text = 'Buy at $'
        if (indicatorSet.position == 'short') {
            title = 'Sell Short'
            text = 'Sell Short at $'
        }
        resultData['longShort']['trades']['entry'].push({
            x: x[0], // Point where the flag appears
            title: title, // Title of flag displayed on the chart
            text: text + priceTypeToPrice(strategy.priceType, x) // Text displayed when the flag are highlighted.
        })
    }else{
        let capital = state.capital[product][strategy.id]['longShort'] || state.initialCapital
        const entryPrice = state.openPos[product][strategy.id]['longShort'][0]
        const curPrice = priceTypeToPrice(strategy.priceType, x)

        const diff = Math.round((curPrice - entryPrice) * state.size, 2)
        capital += diff
        store.commit(SET_CAPITAL, {
            product: product,
            strategy_id: strategy.id,
            position: 'longShort',
            capital
        })
        store.commit(CHANGE_OPEN_POS, {
            product: product,
            strategy_id: strategy.id,
            position: 'longShort',
            isBuy: false
        })

        let title = 'Sell',
            text = 'Sell at $'
        if (indicatorSet.position == 'short') {
            title = 'Buy to cover'
            text = 'Buy to cover at $'
        }

        resultData['longShort']['trades']['exit'].push({
            x: x[0], // Point where the flag appears
            title: title, // Title of flag displayed on the chart
            text: text + priceTypeToPrice(strategy.priceType, x) // Text displayed when the flag are highlighted.
        })
        if (resultData['longShort']['noOfTrades'] == undefined) {
            resultData['longShort']['noOfTrades'] = 0
        }
        resultData['longShort']['noOfTrades']++
    }
}
hasEntry['longShort'] = !hasEntry['longShort']
    }}

export default {
    state,
    mutations,
    actions
}
