<script>    
    import '../styles/tailwind.css';
    import piko from '$lib/images/pikologo.svg';
    import Header from './header.svelte';
    import BGsharan from'$lib/images/sharan.svg';
</script>

<style>
    :global(body){
        background-image: url('$lib/images/sharan.svg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
</style>

<Header />

<slot></slot>