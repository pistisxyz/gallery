<template>
    <form @submit.prevent="userLogin" class="loginform max-w-md pt-8">
        <div>
            <label class="block mb-2 text-indigo-500" for="username">Username</label>
            <input v-model="login.username" class="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" type="text" name="username">
        </div>
        <div>
            <label class="block mb-2 text-indigo-500" for="password">Password</label>
            <input v-model="login.password" class="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" type="password" name="password">
        </div>
        <div>          
            <input class="w-full bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded" type="submit">
        </div>
    </form>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            login: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        async userLogin() {
            if(this.login.password.length < 3 && this.login.username.length < 3){
                return alert('please enter your username and password')
            }

            try {
                let response = await axios.post(`/apis/login/`, 'pss='+this.login.password+'&name='+this.login.username, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                console.log(response.headers)
                if(response.headers['Set-Cookie']){
                    // var setting = browser.cookies.set(
                    //     details               // object
                    // )
                    console.log(settings)
                    console.log(response.headers['Set-Cookie']+';path=/')
                    document.cookie = response.headers['Set-Cookie']+';path=/';
                }
                
                var send;
                var info = response.data.split(':');
                if(info[0] == 'true'){
                    this.$store.commit('authCheck', info[1]);
                    console.log(info.length)
                    console.log(info)
                    if(info.length > 3){
                        this.$store.commit('admin', true);
                    }
                    send = info[2];
                    this.$router.push('/profile');
                }else{
                    send = response.data;
                }

                this.$notify({
                    'group': 'foo',
                    'title': 'alert',
                    'text': send
                })
            } catch (err) {
                console.log(err)
            }
        }
    }
}
</script>

<style>
.loginform {
    margin: auto;
}
</style>