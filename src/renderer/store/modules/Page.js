import Vue from 'vue'

const LOGIN = 'qwee'
const LOGOUT = 'qweqwe'
const SET_TITLE='SET_TITLE'
const SET_PAGE_LOADING='SET_PAGE_LOADING'

const state = {
    title: 'ATS Backtest',
    loading:false
}

const mutations = {
    [LOGIN](state, obj) {
        state.session = obj.userInfo.session
        state.authSuccess = true
        new Promise((resolve, reject) => {
            db.remove({
                username: {
                    $exists: 1
                }
            })
            resolve()
        }).then(() => {
            if (obj.userInfo.autoLogin) {
                db.insert({
                    username: state.username,
                    password: state.password
                })
            }
        })
        router.push('/main')
        obj.resolve()
    },
    [SET_TITLE](state,title){
        state.title=title
    },
    [SET_PAGE_LOADING](state,loading){
        state.loading=loading
    }
}

const actions = {
    login1({
        commit
    }, userInfo) {
        doLogin(commit, userInfo)
    }
}

export default {
    state,
    mutations,
    actions
}
