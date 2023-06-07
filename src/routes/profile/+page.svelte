<script>
    import { PUBLIC_GALLERY_BACKEND_URL } from '$env/static/public';
    import { onMount } from 'svelte';
    import cookies from "$lib/cookies.js"

    import { addToast } from "$lib/stores/toastStore";
    
    $: username = "~"

    async function get_profile_data(){
        try {
            let result = await fetch(PUBLIC_GALLERY_BACKEND_URL+`/profile`, {
                method: 'POST',
                headers: {
                    'Authorization': "Bearer " + cookies.get("token"),
                },
            })

            let data = await result.json();
            username = data.Username;
        } catch (error) {
            addToast({
                message: "there was an error getting one or more of the images!",
                type: "error",
                dismissible: true,
                timeout: 1*2000 // n*second
            })
            console.log('Error:', error);
        }
    }

    onMount(async () => {
        get_profile_data()
    })
</script>

<div class="p-16">
    <div class="p-8 bg-white shadow mt-24">
        <div class="grid grid-cols-1 md:grid-cols-3">
            <div class="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
                <div>
                    <p class="font-bold text-gray-700 text-xl">0</p>
                    <p class="text-gray-400">Uploads</p>
                </div>
                <div>
                    <p class="font-bold text-gray-700 text-xl">0</p>
                    <p class="text-gray-400">Invites</p>
                </div>
                <div>
                    <p class="font-bold text-gray-700 text-xl">0</p>
                    <p class="text-gray-400">Comments</p>
                </div>
            </div>
            <div class="relative">
                <div class="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
            <div class="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
                <button class="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">View invites (not working in beta)</button> 
                <button class="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">EDIT PROFILE (not working in beta)</button>
            </div>                                      
        </div>
     
        <div class="mt-20 text-center border-b pb-12">
            <h1 class="text-4xl font-medium text-gray-700">{username}</h1>
            <p class="font-light text-gray-600 mt-3">Joined on:💀</p>
        </div>
        
        <div class="mt-12 flex flex-col justify-center">
            <p class="text-gray-600 text-center font-semibold lg:px-16">beta 1.73</p>
            <button class="text-indigo-500 py-2 px-4  font-medium mt-4 Sh ow more ebuttyon">

        </div>
    </div>
</div>