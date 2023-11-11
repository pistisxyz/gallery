<script>
    import { page } from '$app/stores';
    let navItems = [
        { route: "/gallery", text: "gallery"},
        { route: "/gallery/tags", text: "Tags and albums"}
    ];
</script>

<nav class="flex w-full bg-gray-900 justify-center h-full">
    <div class="bg-gray-800 w-8 rounded-bl-full"></div>
    <div class="bg-gray-800 text-white flex justify-center h-full border-t-2 border-gray-600">
        {#each navItems as item}
            <a href={item.route} class:active={$page.url.pathname == item.route} class="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 pt-2 pb-3 text-base font-medium">
                {item.text}
            </a>
        {/each}
    </div>
    <div class="bg-gray-800 w-8 rounded-br-full"></div>
</nav>

<slot></slot>