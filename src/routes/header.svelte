<script>
// @ts-nocheck

    import piko from '$lib/images/pikologo.svg';
    import ProfileIcon from '$lib/icons/ProfileIcon.svelte';
    import { goto } from '$app/navigation';

    import { fly } from 'svelte/transition';

    import store from '$lib/stores/store'
    import { onMount } from 'svelte';
    import { getCookie } from '$lib/cookies.js'

    let loggedIn = store.get('auth')

    onMount(async () => {
        if(loggedIn){
            if (getCookie("token") == "") {
                loggedIn.set(false)
            }
        }
	});

    let mobileMenu = false;
    let ProfileMenu = false;

	function toggleMobile() {
		mobileMenu = !mobileMenu;
	}

    function signout() {
        toggleProfile();
        store.set('auth', false)
        fetch("/login?/logout", {
            method: 'POST',
            body: new FormData()
        })

        goto("/login");
    }

    function toggleProfile(){
        ProfileMenu= !ProfileMenu
    }

</script>


<nav class="bg-gray-800 w-screen">
    <div class="mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-expanded="false">
            {#if !mobileMenu }
                <svg on:click={toggleMobile} class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            {:else}
                <svg on:click={toggleMobile} class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            {/if}
          </button>
        </div>
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex-shrink-0 flex items-center pb-2">
            <img class="block lg:hidden h-8 w-auto logo " src="{piko}" alt="logo">
            <img class="hidden lg:block h-8 w-auto logo " src="{piko}" alt="logo">
          </div>
          <div class="hidden sm:block sm:ml-6 pt-1 ">
            <div class="flex space-x-4">
                <a href="/" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
                {#if $loggedIn}
                    <a href="/gallery"  class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Gallery</a>
                    <a href="/upload"   class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Upload</a>
                {:else}
                    <a href="/login"    class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sign In</a>
                {/if}
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span class="sr-only">View notifications</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div class="ml-3 relative">
            <div>
                {#if $loggedIn }
                    <button on:click={toggleProfile} class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu" aria-haspopup="true">
                        <span class="sr-only">Open user menu</span>
                        <ProfileIcon width="1.4em" color="text-gray-400 hover:text-white"/>
                    </button>
                {/if}
            </div>
            {#if ProfileMenu}
                <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                 <a on:click={toggleProfile} href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</a>
                 <a on:click={signout} href="#logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</a>
                </div>
            {/if}
          </div>
        </div>
      </div>
    </div>


    {#if mobileMenu}
        <div transition:fly="{{ y: -20, duration: 400}}">
            <div on:click={toggleMobile} on:keydown class="sm:hidden ease-linear">
                <div class="px-2 pt-2 pb-3 space-y-1">
                    <a href="/" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
                    {#if $loggedIn }
                        <a href="/gallery" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Gallery</a>
                        <a href="/upload" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Upload</a>
                    {:else}
                        <a href="/login" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sign In</a>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</nav>

<style>
    .logo{
        filter: brightness(0) invert(1);
    }
</style>