import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    console.log("after : token +==========")
    console.log(token)
    state.token = token
  },
  SET_NAME: (state, name) => {
    console.log("after : username +==========")
    console.log(name)
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    console.log("after : avatar +==========")
    console.log(avatar)
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    console.log("after:roles============")
    console.log(roles);
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    console.log(userInfo.username);
    console.log(userInfo.password);
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (response.code == 200) {
          console.log("response:=============");
          console.log(response);
          //const { data } = response.data;
          console.log("beforae:token=======")
          console.log(response.data.token)
          commit('SET_TOKEN', response.data.token);
          
          setToken(response.data.token);
          resolve();
        }

      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        console.log("getInfo");
        
        console.log("getInfo===response")
        console.log(response.data);

        var result = response.data;
        if (!result) {
          reject('Verification failed, please Login again.')
        }

        // const { roles, username, avatar } = result
        var role = result.role;
        var username = result.username;
        var avatar = result.avatar;

        // roles must be a non-empty array
        if (!role) {
          reject('getInfo: roles must be a non-null array!')
        }
        var roles = new Array();
        roles.push(role);
        commit('SET_ROLES', roles);
        commit('SET_NAME', username);
        commit('SET_AVATAR', avatar);
        resolve(result);
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        console.log("logout-============")
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

