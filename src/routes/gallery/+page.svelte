<script>
// @ts-nocheck
    // import { onMount } from 'svelte';
    
    let images = [];
    
    for(let i = 30; i<80; i++){
        images.push({
                alt: "",
                src: `https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(${i}).webp`
        })
    }
    
    function showImage(url){
        alert("BOMBA")
        console.log(url)
    }
    // onMount(async () => {
    // //   images = await fetch('/api/images').then(res => res.json());

    //     for(let i = 70; i<80; i++){
    //         images.push({
    //             alt: "",
    //             src: `https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(${i}).webp`
    //         })
    //     }
    // });
</script>

<div class="bg-gray-900 select-none min-h-screen w-screen">
    <div class="flex justify-center">
        <div class="mb-3 md:w-full">
            <input
                type="search"
                class="
                  form-control
                  block
                  w-full
                  px-3
                  py-1.5
                  text-base
                  font-normal
                  text-gray-700
                  bg-white bg-clip-padding
                  border border-solid border-gray-300
                  rounded
                  transition
                  ease-in-out
                  m-0
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                "
                id="exampleSearch"
                placeholder="Type query"
            />
        </div>
    </div>
    <section class="overflow-hidden text-gray-700 ">
        <div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
            <div class="flex flex-wrap -m-1 md:-m-2">
                {#each images as image}
                    <div class="flex flex-wrap 2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full"
                        on:click={() => showImage(image.src)}
                        on:keypress
                    >
                        <div class="w-full p-1 md:p-2">
                            <img class="block object-cover object-center w-full h-full rounded-lg
                            hover:scale-110 transition duration-200 ease-in-out cursor-pointer unselectable"
                            loading="lazy"
                            alt={image.alt}
                            src={image.src}>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </section>
</div>

<style>
    .unselectable {
        user-drag: none; 
        user-select: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
</style>