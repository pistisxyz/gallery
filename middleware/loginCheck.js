import axios from 'axios';
export default async function ({ store, redirect }) {
  if(store.state.authenticated === null){
    const answer = await axios.post('./apis/checklogin');
    console.log(answer.data)
    store.commit('authCheck', answer.data)
  }
}