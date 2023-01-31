<script>
// @ts-nocheck
    // import { onMount } from 'svelte';
    
    let images = [];
    
    for(let i = 50; i<80; i++){
        images.push({
                alt: "",
                src: `https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(${i}).webp`
        })
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

<div class="bg-gray-900 select-none">
    <div class="w-full pt-8">
        <p class="m-auto w-fit text-gray-400  text-4xl p-5 bg-gray-800 block">Image Gallery</p>
    </div>
    <section class="overflow-hidden text-gray-700 ">
        <div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
            <div class="flex flex-wrap -m-1 md:-m-2">
                {#each images as image}
                    <div class="flex flex-wrap w-1/3">
                        <div class="w-full p-1 md:p-2">
                            <img class="block object-cover object-center w-full h-full rounded-lg"
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