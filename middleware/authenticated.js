import axios from 'axios';
export default async function ({ store, redirect }) {
  if(store.state.authenticated === null){
    const answer = await axios.post('./apis/checklogin');
    if(typeof answer.data != 'boolean'){
      store.commit('authCheck', answer.data.split(':')[0])
      store.commit('setAdmin', true)
    }else{
      store.commit('authCheck', answer.data)
    }
  }
  if (!store.state.authenticated) {
    return redirect('/login')
  }
}