<script>    
    import '../styles/tailwind.css';
    import Header from './header.svelte';

    import Toasts from "$lib/components/Toasts.svelte";

    export let data;
</script>

<style>
    :global(body){
        background-image: url('$lib/images/sharan.svg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
</style>
<Toasts />

<Header loggedin={data.loggedin}/>

<slot></slot>