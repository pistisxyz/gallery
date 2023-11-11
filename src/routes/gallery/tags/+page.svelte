<script>

    import { PUBLIC_GALLERY_BACKEND_URL } from '$env/static/public';
    import cookies from "$lib/cookies.js"
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import { addToast } from "$lib/stores/toastStore";

    let tags = [];

    async function load_tags(){
        try {
            let result = await fetch(PUBLIC_GALLERY_BACKEND_URL+`/tags`, {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + cookies.get("token"),
                },
            })

            let data = await result.json();
            data.forEach(v => v.image_path = `${PUBLIC_GALLERY_BACKEND_URL}/compressed/${v.image_path.split('/').pop().split('.').shift()}.webp`)
            tags = data;
        } catch (error) {
            addToast({
                message: "There was an error getting one or more of the images!",
                type: "error",
                dismissible: true,
                timeout: 1*2000 // n*second
            })
            console.log('Error:', error);
        }
    }
    onMount(async () => {
        load_tags()
    })

    function open_tag(name){
        goto(`/gallery?searchTags=${name}`)
    }


</script>

<div class="bg-gray-900 select-none min-h-screen w-screen text-white">
    <div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32 pb-10">
        <div class="flex flex-wrap -m-1 md:-m-2">
            {#each tags as tag}
                <button
                    on:click={()=>{open_tag(tag.tag_name)}}
                    class="2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full"
                >
                    <div class="w-fit m-auto p-1 md:p-2 hover:scale-110 transition duration-200 ease-in-out cursor-pointer unselectable select-none">
                        <img
                            class="block object-cover object-center h-3/4 rounded-lg"
                            loading="lazy"
                            alt={tag.tag_name}
                            src={tag.image_path}
                        />
                        <div class="w-fit m-auto">{tag.tag_name}</div>
                    </div>
                </button>
            {/each}
        </div>
    </div>
</div>