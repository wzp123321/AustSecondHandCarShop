/** @format */
import * as types from '../mutations';
const users = {
  state: {
    userName: "",
    password:""
  },
  mutations: {
    //设置用户名
    [types.SET_USER_NAME](state, data) {
      state.userName = data;
    },
    // 清空用户名
    [types.CLEAR_USER_NAME](state, data) {
      state.userName = "";
    },
    // 设置密码
    [types.SET_PASS_WORD](state, data) {
      state.userName = data;
    },
    // 清空密码
    [types.CLEAR_PASS_WORD](state, data) {
      state.userName = "";
    },
  },
  actions: {
    setUserName: ({ commit, state }, data) => {
      commit(types.SET_USER_NAME, data);
    },
    clearUserName: ({ commit, state }, data) => {
      commit(types.CLEAR_USER_NAME, data);
    },
    setPassWord: ({ commit, state }, data) => {
      commit(types.SET_PASS_WORD, data);
    },
    clearPassWord: ({ commit, state }, data) => {
      commit(types.CLEAR_PASS_WORD, data);
    },
  }
};

export default users;
