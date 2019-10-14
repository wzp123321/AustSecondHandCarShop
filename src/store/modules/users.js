import * as types from "../mutations";

const users = {
  state: {
    userName: "",
    password: "",
  },
  mutations: {
    // 存储username
    [SET_USER_NAME](state, data) {
      state.userName = data;
    },
    // 清空用户名
    [CLEAR_USER_NAME](state, data) {
      state.userName = "";
    },
    // 设置登录密码
    [SET_PASS_WORD](state, data) {
      state.password = data;
    },
    // 清空密码
    [CLEAR_PASS_WORD](state, data) {
      state.password = "";
    }
  },
  actions: {
    setUserName({
      commit,
      state
    }, data) {
      commit(SET_USER_NAME, data)
    },
    clearUserName({
      commit,
      state
    }, data) {
      commit(CLEAR_USER_NAME, data);
    },
    setPassword({
      commit,
      state
    }, data) {
      commit(SET_PASS_WORD, data);
    },
    clearPassword({
      commit,
      state
    }, data) {
      commit(CLEAR_PASS_WORD, data);
    }
  }
}

export default users
