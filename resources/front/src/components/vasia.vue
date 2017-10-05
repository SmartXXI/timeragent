<template>
    <div>
        <h1>{{ title }}</h1>
        <p>{{ msg }}</p>
    </div>
</template>
<script>
    //    import Template from './template';

    export default {
        props: ['msg', 'title'],
        components: {},
    };
</script>
<style>
</style>