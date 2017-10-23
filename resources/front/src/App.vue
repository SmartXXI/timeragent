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
    /*@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');*/
    @import './assets/fonts/font-awesome/css/font-awesome.min.css';

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

    .has-error {
        border-bottom: 2px solid #e02c48 !important;
        color: #e02c48 !important;
    }
    .has-error:focus {
        border-bottom: 2px solid #e02c48 !important;
    }
    .error-icon {
        position: relative;
        margin: 5px;
        color: #e02c48;
    }
    .error-icon:before {
        position: relative;
        font-size: 20px;
        margin: 5px;
        color: #e02c48;
        display: block;
    }
    .errors {
        display: none;
        position: absolute;
        left: 4px;
        bottom:0;
        right:0;
        top: 33px;
        width: 130px;
        height: 50px;
        background-color: #f2dede;
        border: 1px solid #ebcccc;
        color: #a94442;
        font-size: initial;
        padding: 10px;
    }
    .errors:before {
        border-bottom: 8px solid #f2dede;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        content: '';
        left: 0px;
        position: absolute;
        top: -8px;
    }
    .error-icon:hover .errors {
        display: block;
    }
    a {
        cursor: pointer;
    }
</style>
