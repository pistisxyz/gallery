<script>
    // @ts-nocheck
    
    import { PUBLIC_GALLERY_BACKEND_URL } from '$env/static/public';
    import cookies from "$lib/cookies.js"
    import { onMount } from 'svelte';
    import { addToast } from "$lib/stores/toastStore";

    //images
    let images = [];
    let allCount = 0;

    //pages
    let page = 1;
    let pageLimit = 25;

    // tags
    let tagInput = '';
    let tags = [];
    let allTags = [];
    let matchingTags = [];
    let searchSugestions = false;

    async function get_images() {
        try {
            let result = await fetch(PUBLIC_GALLERY_BACKEND_URL+`/images?page=${page}&limit=${pageLimit}`, {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + cookies.get("token"),
                },
            })

            let data = await result.json();
            allCount = data.Count
            images = [];
            for(let img of data.Images){
                let name = img.Path.split("/").pop().split(".").shift();
                images.push({
                    type: img.Type,
                    source: img.Path,
                    alt: "",
                    src: `${PUBLIC_GALLERY_BACKEND_URL}/compressed/${name}.webp`
                })
            }

            images = images
        } catch (error) {
            addToast({
                message: "there was an error getting one or more of the images!",
                type: "error",
                dismissible: true,
                timeout: 2000
            })
            console.log('Error:', error);
        }
    }

    async function get_tags() {
        try {
            let response = await fetch(PUBLIC_GALLERY_BACKEND_URL+'/search', {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + cookies.get("token"),
                },
            });

            if(response.body == "") return

            let data = await response.json();
            allTags = data.map(v => v.tag_name)
        } catch (e) {
            console.error(e)
        }
    }

    async function search_images() {
        try {
            let form = new FormData()
            form.append("tags", JSON.stringify(tags))
            form.append("page", page)
            form.append("limit", pageLimit)
            let response = await fetch(PUBLIC_GALLERY_BACKEND_URL+'/search', {
                method: 'POST',
                headers: {
                    'Authorization': "Bearer " + cookies.get("token"),
                },
                body: form
            });

            let data = await response.json()
            if (!data.Images) return images = []

            allCount = data.Count
            images = [];
            for (let img of data.Images) {
                let name = img.Path.split("/").pop().split(".").shift();
                images.push({
                    type: img.Type,
                    source: img.Path,
                    alt: "",
                    src: `${PUBLIC_GALLERY_BACKEND_URL}/compressed/${name}.webp`
                })
            }

            images = images
        } catch (e) {
            addToast({
                message: "there was an error getting one or more of the images!",
                type: "error",
                dismissible: true,
                timeout: 1_000 // n*second
            })
            console.log('Error:', e);
        }
    }
    
    onMount(async () => {
        get_images()
        get_tags()
    })
    
    function showImage(img){
        overlay_content = {
            type: img.type,
            source: `${PUBLIC_GALLERY_BACKEND_URL}/image/${img.source.split("/").pop()}`
        }
        overlay = true
    }

    function hideImage(){
        overlay = false
    }

    function add_tag({ key }) {
        if (key == 'Enter')  {
            let tag = tagInput.toLowerCase();
            if (tag.length > 2) {
                if (!allTags.includes(tag)) return addToast({
                    message: "no tag with that name!",
                    type: "error",
                    timeout: 1_000 // n*second
                })
                page = 1;
                tags.unshift(tag)
                tags = [...new Set(tags)]
                search_images()
            }
            tagInput = ''
            matchingTags = [];
            searchSugestions = false;
        } else {
            if (tagInput.length > 0){
                matchingTags = allTags.filter(item => item.toLowerCase().includes(tagInput.toLowerCase()));
                searchSugestions = true;
            }else {
                matchingTags = [];
                searchSugestions = false;
            }
        }
    }

    function add_tag_sugestion (tag) {
        searchSugestions = false;
        matchingTags = [];
        tagInput = '';
        tags.unshift(tag.toLowerCase())
        tags = [...new Set(tags)]
        search_images()
    }

    function remove_tag(index) {
        tags.splice(index, 1)
        tags = [...new Set(tags)]
        if (tags.length > 0) search_images()
        else {
            page = 1
            get_images()
        }
    }

    function to_page(p){
        page = p;
        if(tags.length > 0) search_images()
        else {
            get_images()
        }
        topbox.scrollIntoView()
    }

    let overlay = false;
    let overlay_content = {}
    let topbox;

    $: pageTabulation = Array(Math.min(Math.ceil(allCount / pageLimit), 20))
</script>
<div class="bg-gray-900 select-none min-h-screen w-screen">
    <div bind:this={topbox}></div>
    {#if overlay}
        <div
            on:click={() => hideImage()}
            on:keypress
            class="bigImage bg-gray-900/75" >
            <div class="text-neutral-700 dark:text-neutral-200 m-auto bg-gray-900/95 p-10 rounded-lg">
                {#if overlay_content.type == "image"}
                    <img src={overlay_content.source} alt="big overview of selected item" class="max-h-[80vh]">
                {:else if overlay_content.type == "video"}
                    <!-- svelte-ignore a11y-media-has-caption -->
                    <video controls src={overlay_content.source} class="max-h-[80vh]"></video>
                {/if}
            </div>
        </div>
    {/if}
    <div class="flex justify-center pt-4">
        <div class="mb-3 w-1/2">
            <div class="relative mb-4 flex w-full flex-wrap items-stretch">
                <input autocomplete="off" bind:value={tagInput} on:keyup={add_tag} on:focus={()=>{ searchSugestions = true }} on:blur={()=>{setTimeout(_=>searchSugestions = false, 100)}} id="tags" class="mt-2 mb-2 p-1 dark:bg-gray-700 bg-white w-full text-base text-indigo-500 font-semibold rounded-md outline-none dark:hover:bg-gray-800 hover:bg-neutral-200" type="text">
                {#if searchSugestions && matchingTags.length > 0}
                    <ul class="absolute z-10 top-10 bg-gray-700 border border-gray-700 w-full mt-2 text-white">
                        {#each matchingTags as item}
                            <li on:click={_=>add_tag_sugestion(item)} on:keydown class="pl-8 pr-2 py-1 border-b-2 border-gray-700 relative cursor-pointer hover:bg-gray-600 hover:text-gray-900">
                                <svg class="absolute w-4 h-4 left-2 top-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                </svg>
                                {item}
                            </li>
                        {/each}
                    </ul>
                {/if}
                {#each tags as tag, i}
                    <div class="center relative inline-block select-none whitespace-nowrap rounded-md bg-indigo-800 py-2 m-1 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-white">
                        <div class="flex mt-px">
                            <div class="h-fit m-auto pl-1"> {tag} </div>
                            <div role="button" tabindex="0" class="h-5 w-5 p-1" on:click={_=>remove_tag(i)} on:keypress>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="3"
                                >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
    <section class="overflow-hidden text-gray-700 ">
        <div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
            <div class="flex flex-wrap -m-1 md:-m-2">
                {#if images.length == 0}
                    <div class="text-white m-auto w-fit"> No images found 💩 </div>
                {/if}
                {#each images as image}
                    <div class="flex flex-wrap 2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full"
                        on:click={_=>showImage(image)}
                        on:keypress
                    >
                        <div class="w-full p-1 md:p-2">
                            <img class="block object-cover object-center w-full h-full rounded-lg
                            hover:scale-110 transition duration-200 ease-in-out cursor-pointer unselectable select-none"
                            loading="lazy"
                            source={image.source}
                            alt={image.alt}
                            src={image.src}>
                        </div>
                    </div>
                {/each}
            </div>
            <div class="w-fit text-white my-4 m-auto flex"> 
                {#each pageTabulation as _, i }
                    <div class="{(i+1==page?"bg-indigo-700":"bg-indigo-500")} cursor-pointer text-white hover:bg-indigo-700 hover:text-white block px-4 py-2 mx-1 rounded-md text-base font-medium w-fit"
                        on:keypress on:click={()=>{to_page(i+1)}}>
                        {i + 1}
                    </div>
                {/each}
            </div>
        </div>
    </section>
</div>

<style>
    .bigImage {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        z-index: 700;
    }
    .unselectable {
        user-select: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
</style>