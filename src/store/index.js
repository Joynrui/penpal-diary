import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        // 在日记列表中，点击编辑日记时，所使用的diary对象
        diary: {},
        // 日记活跃码：默认为false：非编辑状态，激活态为true.
        diaryEditActiveCode: false,
        // 登录用户的匹配状态，默认为未匹配
        // not_matched, randomMatching, targetedMatching, matched
        matchingStatus: "not_matched",
    },

    mutations: {
        // 设置diary对象
        setDiary(state, diary) {
            state.diary = diary;
        },
        /**
         * @deprecated 置空diary对象
         * @param {*} state 
         */
        setDiaryEmpty(state) {
            state.diary = {};
        },

        /**
         * 设置diaryEditActiveCode激活码
         * @param {状态} state 
         * @param {激活码} code 
         */
        setDiaryEditActiveCode(state, payload) {
            state.diaryEditActiveCode = payload.code;
        },
    },

    actions: {

    }
})

export default store;