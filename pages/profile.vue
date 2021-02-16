<template>
  <div class="pt-8 px-10">
    <h1>ПИКО НА ФИЛИЯ ЗА {{name.toUpperCase()}}</h1>
    <div v-if="admin">
        welcome admin

        <form @submit.prevent="addUser" class="loginform max-w-md pt-8">
            <div>
                <label class="block mb-2 text-indigo-500" for="username">Username</label>
                <input v-model="register.username" class="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" type="text" name="username">
            </div>
            <div>
                <label class="block mb-2 text-indigo-500" for="password">Password</label>
                <input v-model="register.password" class="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" type="password" name="password">
            </div>
            <div>          
                <input class="w-full bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded" type="submit">
            </div>
        </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    transition: 'slide-bottom',
    middleware: 'authenticated',
    computed:{
        name(){
            return this.$store.state.authenticated
        },
        admin(){
            return this.$store.state.admin
        }
    },
    methods:{
        async addUser(){
            console.log(' teasdf')
            if(this.register.password.length < 3 && this.register.username.length < 3){
                this.$notify({
                    'group': 'foo',
                    'title': 'alert',
                    'text': 'please enter your username and password'
                })
                return;
            }
            let response = await axios.post(`/apis/register/`, 'pss='+this.register.password+'&name='+this.register.username, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            this.$notify({
                'group': 'foo',
                'title': 'alert',
                'text': response.data
            })
        }
    },
    data(){
        return {
            register: {
                username: '',
                password: ''
            }
        }
    },
    head() {
        return {
            title: 'profile',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Home Page',
                },
            ],
        }
    },
}
</script>

<style></style>
