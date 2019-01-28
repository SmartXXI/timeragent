<template>
  <div class="NavMenu">
    <el-header>
      <el-row>
        <el-col
          :span="16"
          :offset="4"
        >
          <span class="logo">
            <router-link to="/">
              <img
                class="logo"
                src="./../../assets/images/logo.svg"
                alt="logo"
              >
            </router-link>
          </span>
          <el-menu
            :router="true"
            :default-active="$route.path"
            class="el-menu-demo"
            mode="horizontal"
          >
            <el-menu-item index="/login">
              <router-link to="/login">
                <span>
                  Login
                </span>
              </router-link>
            </el-menu-item>
            <el-menu-item index="/register">
              <router-link to="/register">
                <span>
                  Register
                </span>
              </router-link>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-header>
  </div>
</template>

<script>
import ElRow from 'element-ui/packages/row/src/row';

export default {
  components: {
    ElRow,
  },
  data() {
    return {
      isOpened: null,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>

    .el-menu-item a {
        display: block;
        width: 100%;
    }

    .control-buttons {
        padding: 17px;
    }
    .logo {
        width  : 240px;
        height : 55px;
        float: left;
    }

    .el-menu-demo {
        float: right;
        margin-right: 8em;
    }

    .el-header {
        background-color: #fff;
      // background: linear-gradient(to bottom, #6287bc 0%, #96e4c4 100%);
      /*background-color: #6287bc;*/
      /*background: @include filter-gradient(#6287bc, #96e4c4, vertical);*/
      /*background: @include background-image(linear-gradient(top, #6287bc 0%, #96e4c4 100%));*/
    }

    a {
        text-decoration: none;
    }

    a:hover {
        text-decoration: none;
    }

    body {
        font-family : "Open Sans", sans-serif;
        font-size   : 14px;
        line-height : 1.42857;
        color       : #525252;

        .dropdown-menu {
            position           : absolute;
            top                : 100%;
            left               : 0;
            z-index            : 1000;
            display            : none;
            min-width          : 160px;
            padding            : 6px 0;
            margin             : 5px 0 0;
            list-style         : none;
            font-size          : 14px;
            text-align         : left;
            background-color   : #fff;
            border             : 1px solid rgba(0, 0, 0, .15);
            border-radius      : 3px;
            -webkit-box-shadow : 0 6px 12px rgba(0, 0, 0, .175);
            box-shadow         : 0 6px 12px rgba(0, 0, 0, .175);
            background-clip    : padding-box;
        }

        .btn {
            font-size : 18px;
        }

        header {

            display          : block;
            flex-grow        : 0;
            /*background-color : #464646;*/
            box-shadow       : 0 2px 3px 0 rgba(47, 47, 47, .25) !important;

            .fa {
                font-size : 0.9em;
            }

            .navbar {
                display         : flex;
                justify-content : space-between;
                margin          : auto !important;
                border          : 0 !important;
                border-radius   : unset;

                img {
                    vertical-align : middle;
                }

                .dropdown {

                    .dropdown-menu {

                        position           : absolute;
                        left               : 0;
                        z-index            : 1000;
                        display            : none;
                        min-width          : 160px;
                        padding            : 6px 0;
                        margin             : 5px 0 0;
                        list-style         : none;
                        font-size          : 14px;
                        text-align         : left;
                        border-radius      : 3px;
                        -webkit-box-shadow : 0 6px 12px rgba(0, 0, 0, .175);
                        background-clip    : padding-box;
                        background-color   : #393939;
                        border             : none;
                        top                : 65px;
                        box-shadow         : 2px 2px 3px 0 rgba(47, 47, 47, .25) !important;

                        li {

                            a {
                                color       : rgba(255, 255, 255, .5);
                                display     : block;
                                padding     : 6px 25px;
                                font-weight : 400;
                            }

                            a:hover {
                                color            : rgba(255, 255, 255, .75);
                                background-color : #444;
                            }
                        }

                    }

                    .open {
                        display : block;

                        a {
                            background-color : #393939;
                            color            : #fff;
                        }
                    }

                }

                * {
                    display        : inline-block;
                    vertical-align : top;
                    margin         : 0;
                    line-height    : inherit;
                }

                .logo {
                    line-height : 70px;
                }

                .timer-buttons {

                    .btn {
                        height           : 48px;
                        width            : 48px;
                        min-width        : 0;
                        margin           : 11px 3px;
                        border-radius    : 48px;
                        box-shadow       : 0 2px 6px rgba(0, 0, 0, .2) !important;

                        color            : #fff;
                        background-color : #00bc6a;
                    }

                    .btn-timer-start:hover {
                        background-color : #00a35c;
                        border-color     : #00a35c;
                    }

                    .btn-timer-continue:hover {
                        background-color : #00a35c;
                        border-color     : #00a35c;
                    }

                    .btn-timer-stop {
                        height           : 36px;
                        width            : 36px;
                        margin           : 17px 3px;
                        border-radius    : 36px;
                        padding          : 6px 0;

                        color            : #fff;
                        background-color : #e26a6a;
                    }

                    .btn-timer-stop:hover {
                        background-color : #de5555;
                        border-color     : #de5555;
                    }
                }

            }

            .navbar-default {

                background-color : #464646;

                .navbar-nav {

                    a.router-link-active {
                        color            : #fff;
                        background-color : #393939;
                        border-top       : 4px solid transparent;
                        border-bottom    : 4px solid #fff;
                        padding-top      : 21px;
                        padding-bottom   : 21px;
                    }
                    a.router-link-active:hover {
                        color : #fff;
                    }
                    .router-link-active {

                        a {
                            color            : #fff;
                            background-color : #393939;
                            border-top       : 4px solid transparent;
                            border-bottom    : 4px solid #fff;
                            padding-top      : 21px;
                            padding-bottom   : 21px;
                        }
                        .open {
                            a.router-link-active {
                                color            : #fff;
                                background-color : #393939;
                            }

                            a.router-link-active:hover {
                                color : #fff;
                            }

                            a {
                                display     : block;
                                padding     : 6px 25px;
                                font-weight : 400;
                                color       : #333;
                                color       : rgba(255, 255, 255, .5);
                                border      : none;
                            }
                        }
                    }

                    .open a {
                        display     : block;
                        padding     : 6px 25px;
                        font-weight : 400;
                        color       : #333;
                        color       : rgba(255, 255, 255, .5);

                    }

                    /*.open {*/
                    /*a.router-link-active {*/
                    /*color: #fff;*/
                    /*background-color: #393939;*/
                    /*}*/
                    /*a.router-link-active:hover {*/
                    /*color: #fff;*/
                    /*}*/
                    /*}*/

                    a.expanded {
                        background-color : #393939;
                        color            : #fff;
                    }

                    a:focus {
                        color            : rgba(255, 255, 255, .75);
                        background-color : #404040;
                    }

                    li {

                        a {
                            color          : rgba(255, 255, 255, .5);
                            font-weight    : bold;
                            max-height     : 70px;
                            padding-top    : 25px;
                            padding-bottom : 25px;
                        }
                    }
                }
            }
        }
    }

</style>

<style>
    .logo {
        position: relative;
    }
</style>
