import Vue from 'vue'

const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const LOADING = 'LOADING'
const AUTO_LOGIN_FUNC = 'AUTO_LOGIN_FUNC'
const SET_USERNAME = 'SET_USERNAME'
const SET_PASSWORD = 'SET_PASSWORD'
const SET_ERR_MSG = 'SET_ERR_MSG'
const SET_LOADING = 'SET_LOADING'

const state = {
    username: '',
    password: '',
    session: '',
    authSuccess: false,
    loading: false,
    autoLogin: false,
    errMsg: ''
}

const mutations = {
    [LOGIN](state, obj) {
        // state.username = userInfo.username
        // state.password = userInfo.password
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
    [LOADING](state, resolve) {
        state.loading = true
        resolve()
    },
    [SET_USERNAME](state, username) {
        state.username = username
    },
    [SET_PASSWORD](state, password) {
        state.password = password
    },
    [SET_ERR_MSG](state, obj) {
        state.errMsg = obj.errMsg
        state.authSuccess = false
        if (obj.resolve != undefined)
            obj.resolve()
    },
    [SET_LOADING](state, v) {
        state.loading = v
    },
    [LOGOUT](state, next) {
        state.username=''
        state.password=''
        state.autoLogin=false
        state.authSuccess=false
        db.remove({
            username: {
                $exists: 1
            }
        }, (err, res) => {
            next()
        })
    }
}

const actions = {
    login({
        commit
    }, userInfo) {
        doLogin(commit, userInfo)
    },
    autoLoginFunc({
        commit
    }) {
        db.findOne({
            username: {
                $exists: 1
            }
        }, (err, doc) => {
            if (doc != null) {
                commit(SET_USERNAME, doc.username)
                commit(SET_PASSWORD, doc.password)
                doLogin(commit, {
                    autoLogin: true
                })
            }
        })
    }
}

const doLogin = (commit, userInfo) => {
    new Promise((resolve, reject) => {
        commit(LOADING, resolve)
    }).then(() => {
        new Promise((resolve, reject) => {
                Vue.http.post(rootUrl + '/backtest/login', {
                    user_id: state.username,
                    password: state.password
                }).then((res) => {
                    userInfo.authSuccess = res.data.success
                    if (userInfo.authSuccess) {
                        commit(LOGIN, {
                            userInfo: userInfo,
                            resolve: resolve
                        })
                    } else {
                        commit(SET_ERR_MSG, {
                            errMsg: 'errMsg1',
                            resolve: resolve
                        })
                    }
                }).catch((e) => {
                    alert(e)
                    commit(SET_LOADING, false)
                })
            })
            .then(() => {
                commit(SET_LOADING, false)
            })
    })
}

export default {
    state,
    mutations,
    actions
}
