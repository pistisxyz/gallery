<script>
// @ts-nocheck

    import { addToast } from "$lib/stores/toastStore";
    import { goto } from '$app/navigation';

    import store from '$lib/stores/store'

    let username = "";
    let password = "";

    async function login(){
        let data = new FormData()

        data.append("username", username)
        data.append("password", password)

        try {
            let result = await fetch("/login?/login", {
                method: 'POST',
                body: data
            })
            let text = await result.json();
            if(text.status == 200){
                addToast({
                    message: "logged in!",
                    type: "success",
                    dismissible: true,
                    timeout: 1*1000 // n*second
                })
                store.set('auth', true)
                goto("/gallery");
            } else {
                let res_data = JSON.parse(text.data);
                addToast({
                    message: res_data[1],
                    type: "error",
                    dismissible: true,
                    timeout: 5*1000 // n*second
                })
            };
        } catch (error) {
            console.log('Error:', error);
        }
    }
</script>

<form class="max-w-md pt-8 m-auto mt-24" on:submit|preventDefault>
    <h1 class="flex justify-center text-3xl mb-5 textmb-2 text-indigo-500 font-semibold">Login</h1>
    <hr class="opacity-50">
    <div>
        <label class="block mb-2 text-indigo-500 font-semibold" for="username" >Username</label>
        <input class="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" bind:value={username} type="text" name="username">
    </div>
    <div>
        <label class="block mb-2 text-indigo-500 font-semibold" for="password">Password</label>
        <input  class="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" bind:value={password} type="password" name="password">
    </div>
    <div class="flex justify-between items-center">
        <div class="mb-5">
            <input type="checkbox" class="">
            <lable class="text-indigo-500 font-semibold">Remember me?</lable>
        </div>
        <div class="mb-5">
            <!-- Добави forgot password page -->
            <a href="/" class="text-amber-100 font-semibold">Forgot Password</a>
        </div>
    </div>
    <div>          
        <button class="w-full bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded" on:click={login}>Login</button>
    </div>
</form>
