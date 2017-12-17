import Vue from 'vue'

const LOGIN = 'qwee'
const SET_STOCK = 'SET_STOCK'

const state = {
    columns: [],
    rows: [],
    max: [],
    min: [],
    avg: []
}

const mutations = {
    [SET_STOCK](state, data) {
        let newCol=[]
        data.columns=Vue.prototype.$array.move(data.columns,1,-1)
        state.columns=data.columns
        let cleanData = []
        data.rows.map((x) => {
            x=Vue.prototype.$array.move(x,1,-1)

            let row = []
            let canPush = true

            x.map((y, j) => {
                if (j != 0 && j != state.columns.length-1) {
                    const temp = y.replace(/,/g, '')
                    if (!isNaN(temp) && temp.length > 0) {
                        row.push(parseFloat(temp))
                    } else {
                        canPush = false
                    }
                } else {
                    row.push(y)
                }
            })

            if (canPush)
                cleanData.push(row)
        })
        state.rows = cleanData
        let sortByIndex = {}
        cleanData.map((x) => {
            x.map((y, j) => {
                if (sortByIndex[j] == undefined) sortByIndex[j] = []
                if (isNaN(y)) return
                sortByIndex[j].push(parseFloat(y))
            })
        })
        for (let i in sortByIndex) {
            if (i != 0 && i != state.columns.length-1) {
                state.max.push(Math.max(...sortByIndex[i]))
                state.min.push(Math.min(...sortByIndex[i]))
                state.avg.push(sortByIndex[i].reduce((a, b) => a + b) / sortByIndex[i].length)
            } else {
                state.max.push(0)
                state.min.push(0)
                state.avg.push(0)
            }
        }
    }
}

const actions = {
    getStock({
        commit
    }) {
        commit('SET_PAGE_LOADING', true)
        Vue.http.get(rootUrl + '/stockshape').then((res) => {
            commit(SET_STOCK, {
                columns: res.data.title,
                rows: res.data.data
            })
            commit('SET_PAGE_LOADING', false)
        }).catch((e) => {
            console.log(e)
        })
    }
}

export default {
    state,
    mutations,
    actions
}
