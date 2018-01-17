<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
    };
</script>

<style>
    @import '../node_modules/font-awesome/css/font-awesome.min.css';
    @import url('https://fonts.googleapis.com/css?family=Montserrat');
    @import url('https://fonts.googleapis.com/css?family=Lato');
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    @import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
    @import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js');

    body {
        font-family : "Open Sans", Helvetica, Arial, sans-serif;
        font-size   : 14px;
        line-height : 1.42857143;
        color       : #676f7a;
    }

    .has-error {
        border-bottom : 2px solid #e02c48 !important;
        color         : #e02c48 !important;
    }

    .has-error:focus {
        border-bottom : 2px solid #e02c48 !important;
    }

    .error-icon {
        position : relative;
        margin   : 5px;
        color    : #e02c48;
    }

    .error-icon:before {
        position  : relative;
        font-size : 20px;
        margin    : 5px;
        color     : #e02c48;
        display   : block;
    }

    .errors {
        display          : none;
        position         : absolute;
        left             : 4px;
        bottom           : 0;
        right            : 0;
        top              : 33px;
        width            : 130px;
        height           : 50px;
        background-color : #f2dede;
        border           : 1px solid #ebcccc;
        color            : #a94442;
        font-size        : initial;
        padding          : 10px;
    }

    .errors:before {
        border-bottom : 8px solid #f2dede;
        border-left   : 8px solid transparent;
        border-right  : 8px solid transparent;
        content       : '';
        left          : 0px;
        position      : absolute;
        top           : -8px;
    }

    .error-icon:hover .errors {
        display : block;
    }

    a {
        cursor : pointer;
    }

    .el-table td:first-child .cell, .el-table th:first-child .cell {
        padding-left: 10px;
    }

    .el-collapse-item__header {
        padding: 0 10px;
    }

    .member-item {
        padding: 0;
    }

    .rate {
        float: right;
        margin-right: 10px;
    }
</style>