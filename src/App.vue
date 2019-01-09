<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters([
      'user',
    ]),
  },
  // created() {
  //     this.$store.dispatch('getMe', { email: localStorage.getItem('email') })
  //         .catch((error) => {
  //             if (error.networkError) {
  //                 console.log(error.networkError.statusCode);
  //                 if (error.networkError.statusCode === 401) {
  //                     localStorage.removeItem('access_token');
  //                     localStorage.removeItem('refresh_token');
  //                     localStorage.removeItem('expires_in');
  //                     this.$router.push({ name: 'login' });
  //                 }
  //             } else {
  //                 this.$router.push({ name: 'login' });
  //             }
  //     });
  // },
};
</script>

<style lang="scss"
       rel="stylesheet/css">
  /*@import '../node_modules/font-awesome/css/font-awesome.min.css';*/
  @import url('https://fonts.googleapis.com/css?family=Montserrat');
  @import url('https://fonts.googleapis.com/css?family=Lato');
  @import url('https://fonts.googleapis.com/css?family=Open+Sans');
  @import url('https://use.fontawesome.com/releases/v5.3.1/css/all.css');

  body {
    font-family : "Open Sans", Helvetica, Arial, sans-serif;
    font-size   : 14px;
    line-height : 1.42857143;
    color       : #676f7a;
  }

  .has-error {
    color : #e02c48 !important;
  }

  .has-error input {
    border-bottom-color : #e02c48 !important;
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

  .error-message {
    display    : block;
    color      : red;
    margin-top : 2px;
    font-size  : 13px;
  }

  .error-icon:hover .errors {
    display : block;
  }

  a {
    cursor : pointer;
  }

  .el-table td:first-child .cell, .el-table th:first-child .cell {
    padding-left : 10px;
  }

  .el-collapse-item__header {
    padding : 0 10px;
  }

  .member-item {
    padding : 0;
  }

  .rate {
    float        : right;
    margin-right : 10px;
  }

  .el-transfer {
    display : inline-block;
  }

  .delete_button {
    color : #FA5555;
  }

  .delete_button:active {
    color : #FA5555;
  }

  .delete_button:hover {
    color : #FA5555;
  }

  .delete_button:focus {
    color : #FA5555;
  }

  .gray-text {
    color : #b4bccc;
  }

  .green-text {
    color: #67c23a;
  }

  .el-icon-plus {
    font-size : 14px;
  }

  .pull-right {
    float: right;
  }
</style>
