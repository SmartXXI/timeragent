<template>
    <div id="app">
        <!--<img src="./assets/logo.png">-->
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
    };
</script>

<style>

    @import url('https://fonts.googleapis.com/css?family=Montserrat');
    @import url('https://fonts.googleapis.com/css?family=Lato');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    @import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

    @font-face {
        font-family: 'FontAwesome';
        src: url('assets/fonts/font-awesome/fonts/fontawesome-webfont.eot?v=4.2.0');
        src: url('assets/fonts/font-awesome/fonts/fontawesome-webfont.eot?#iefix&v=4.2.0') format('embedded-opentype'), url('assets/fonts/font-awesome/fonts/fontawesome-webfont.woff?v=4.2.0') format('woff'), url('assets/fonts/font-awesome/fonts/fontawesome-webfont.ttf?v=4.2.0') format('truetype'), url('assets/fonts/font-awesome/fonts/fontawesome-webfont.svg?v=4.2.0#fontawesomeregular') format('svg');
        font-weight: normal;
        font-style: normal
    }

    body {
        font-family: "Open Sans", Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.42857143;
        color: #676f7a;
    }

    .fa {
        display: inline-block;
        font: normal normal normal 14px/1 FontAwesome;
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        line-height: inherit;
    }
</style>
