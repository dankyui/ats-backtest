import Vue from 'vue';

const LOAD_DEFAULT_LANGUAGE = 'LOAD_DEFAULT_LANGUAGE'
const SET_LANGUAGE = 'SET_LANGUAGE'
const GET_LANGUAGE_ID = 'GET_LANGUAGE_ID'

const state = {
    languageId: 0
}

const mutations = {
    [SET_LANGUAGE](state, id) {
        state.languageId = id
    },
    [LOAD_DEFAULT_LANGUAGE](state, id) {
        state.languageId = id
    }

}

const actions = {
    loadDefaultLanguage({
        commit
    }) {
        new Promise((resolve, reject) => {
            global.db.findOne({
                default_language: {
                    $exists: 1
                }
            }, (err, doc) => {
                resolve(doc)
            })
        }).then((doc) => {
            if (doc == undefined) {
                global.db.insert({
                    default_language: 'en'
                })
            } else {
                Vue.prototype.$locale.change(doc.default_language)
                const id = getLanguageId(doc.default_language)
                commit(LOAD_DEFAULT_LANGUAGE, id)
            }
        })
    },
    setLanguage({
        commit
    }, lang) {
        global.db.update({
            default_language: {
                $exists: 1
            }
        }, {
            default_language: lang
        })
        Vue.prototype.$locale.change(lang)
        const id = getLanguageId(lang)
        commit(SET_LANGUAGE, id)
    }
}

const getLanguageId = (lang) => {
    switch (lang) {
        case 'zh':
            return 1
        default:
            return 0
    }
}

export default {
    state,
    mutations,
    actions
}
