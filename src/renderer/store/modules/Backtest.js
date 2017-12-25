const SAVE_PRODUCT = 'SAVE_PRODUCT'
const REMOVE_PRODUCT = 'REMOVE_PRODUCT'
const SET_PFE='SET_PFE'
const SET_SELECTED_STRATEGIES='SET_SELECTED_STRATEGIES'

const state = {
    products: [],
    strategies:['Strategy A','Strategy B','Strategy C'],
    selectedStrategies:[]
}

const mutations = {
    [SAVE_PRODUCT](state, product) {
        state.products.push(product)
    },
    [REMOVE_PRODUCT](state, indexes) {
        if (indexes.length == 0) return
        while(indexes.length) {
            state.products.splice(indexes.pop(), 1);
        }
        let reIndex=0
        _.map(state.products,x=>{
            x.id=reIndex++
        })
    },
    [SET_SELECTED_STRATEGIES](state,strategies){
        state.selectedStrategies=strategies
    }
}

const actions = {
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
