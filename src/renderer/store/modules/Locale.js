import Vue from 'vue';

const SET_LANGUAGE = 'SET_LANGUAGE'
const GET_LANGUAGE_ID = 'GET_LANGUAGE_ID'

const state = {
    language:'en',
    languageId: 0
}

const mutations = {
    [SET_LANGUAGE](state, obj) {
        state.languageId = obj.id
        state.language = obj.language
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
                commit(SET_LANGUAGE, {id:id,language:doc.default_language})
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
        commit(SET_LANGUAGE, {id:id,language:lang})
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
