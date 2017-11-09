<template>
    <div>
        <!--<header>-->
            <!--<nav class="navbar navbar-default container">-->
                <!--&lt;!&ndash; BEGIN LOGO &ndash;&gt;-->
                <!--<span class="logo">-->
                    <!--<router-link to="/">-->
                        <!--<img class="logo" src="../../assets/images/logo.svg" alt="logo"/>-->
                    <!--</router-link>-->

                <!--</span>-->
                <!--&lt;!&ndash; END LOGO &ndash;&gt;-->
                <!--&lt;!&ndash; BEGIN TIMER ACTIONS &ndash;&gt;-->
                <!--<span class="timer-actions">-->
                    <!--<div class="timer-buttons">-->
                        <!--<button title="Start timer" class="btn btn-timer-start" v-if="!timerStarted"-->
                                <!--@click="startTimer">-->
                            <!--<i class="fa fa-play"></i>-->
                        <!--</button>-->
                        <!--<button class="btn btn-tier-continue" v-if="timerStarted">-->
                            <!--<i class="fa fa-plus"></i>-->
                        <!--</button>-->
                        <!--<button title="Stop timer" class="btn btn-timer-stop" @click="stopTimer"-->
                                <!--:disabled="!timerStarted">-->
                            <!--<i class="fa fa-stop"></i>-->
                        <!--</button>-->
                    <!--</div>-->
                <!--</span>-->
                <!--&lt;!&ndash; END TIMER ACTIONS &ndash;&gt;-->
                <!--&lt;!&ndash; BEGIN NAVIGATION MENU &ndash;&gt;-->
                <!--<div class="main-menu">-->
                    <!--<ul class="nav navbar-nav">-->
                        <!--<router-link tag="li" to="/" exact>-->
                            <!--<router-link to="/" class="navbar-link bold text-uppercase" exact>-->
                                <!--<span>time</span>-->
                            <!--</router-link>-->
                        <!--</router-link>-->
                        <!--<li class="dropdown">-->
                            <!--<a href class="dropdown-toggle bold text-uppercase"-->
                               <!--v-on:click.prevent="showSubMenu('Reports')"-->
                               <!--v-bind:class="{ expanded: isOpened == 'Reports'}"-->
                               <!--@blur="hideSubMenu"-->
                            <!--&gt;-->
                                <!--<span>Reports</span>-->
                                <!--<span><i class="fa fa-angle-down"></i></span>-->
                            <!--</a>-->
                            <!--<ul class="dropdown-menu"-->
                                <!--v-bind:class="{ open: isOpened == 'Reports'}">-->
                                <!--<li>-->
                                    <!--<a href="">-->
                                        <!--<span>projectsSummary</span>-->
                                    <!--</a>-->
                                <!--</li>-->
                                <!--<li>-->
                                    <!--<a href="">-->
                                        <!--<span>tasksSummary</span>-->
                                    <!--</a>-->
                                <!--</li>-->
                                <!--<li>-->
                                    <!--<a href="">-->
                                        <!--<span>teamSummary</span>-->
                                    <!--</a>-->
                                <!--</li>-->
                                <!--<li role="separator" class="divider"></li>-->
                                <!--<li>-->
                                    <!--<a href="">-->
                                        <!--<span>detailedReport</span>-->
                                    <!--</a>-->
                                <!--</li>-->
                            <!--</ul>-->
                        <!--</li>-->
                        <!--<li class="dropdown"-->
                            <!--:class="{-->
                                <!--'router-link-active': subIsActive('/teams') ||-->
                                <!--subIsActive('/projects') ||-->
                                <!--subIsActive('/clients')-->
                        <!--}">-->
                            <!--<a href class="dropdown-toggle bold text-uppercase"-->
                               <!--v-on:click.prevent="showSubMenu('Manage')"-->
                               <!--v-bind:class="{ expanded: isOpened == 'Manage'}"-->
                               <!--@blur="hideSubMenu"-->
                            <!--&gt;-->
                                <!--<span>Manage</span>-->
                                <!--<span><i class="fa fa-angle-down"></i></span>-->
                            <!--</a>-->
                            <!--<ul class="dropdown-menu dropdown-menu-default"-->
                                <!--v-bind:class=" { open : isOpened == 'Manage' }">-->
                                <!--<li>-->
                                    <!--<router-link to="/teams">-->
                                        <!--Teams-->
                                    <!--</router-link>-->
                                <!--</li>-->
                                <!--<li class="divider"></li>-->
                                <!--<li>-->
                                    <!--<router-link to="/clients">-->
                                        <!--<span>Clients</span>-->
                                    <!--</router-link>-->
                                <!--</li>-->
                                <!--<li>-->
                                    <!--<router-link to="/projects">-->
                                        <!--<span>Projects</span>-->
                                    <!--</router-link>-->
                                <!--</li>-->
                            <!--</ul>-->
                        <!--</li>-->
                    <!--</ul>-->
                <!--</div>-->
                <!--&lt;!&ndash; END NAVIGATION MENU &ndash;&gt;-->
                <!--&lt;!&ndash; BEGIN SIDE MENU &ndash;&gt;-->
                <!--<ul class="nav navbar-nav pull-right user-menu">-->
                    <!--<li>-->
                        <!--<a href="https://timeragent.com/help" target="_blank" title="Help">-->
                            <!--<i class="fa fa-question-circle"></i>-->
                        <!--</a>-->
                    <!--</li>-->
                    <!--&lt;!&ndash; BEGIN LOGIN MENU &ndash;&gt;-->
                    <!--<li class="dropdown pull-right"-->
                        <!--:class="{-->
                                <!--'router-link-active': subIsActive('/profile')-->
                        <!--}"-->
                    <!--&gt;-->
                        <!--<a href=""-->
                           <!--class="dropdown-toggle"-->
                           <!--data-toggle="dropdown"-->
                           <!--data-close-others="true"-->
                           <!--v-on:click.prevent="showSubMenu('User')"-->
                           <!--v-bind:class="{ expanded: isOpened == 'User'}"-->
                           <!--@blur="hideSubMenu"-->
                        <!--&gt;-->
                            <!--<span class="login-info">-->
                                <!--<span v-if="user" class="bold text-overflow">{{ user.name }}</span>-->
                            <!--</span>-->
                            <!--<span><i class="fa fa-angle-down"></i></span>-->
                        <!--</a>-->
                        <!--<ul class="dropdown-menu dropdown-menu-default login-dropdown-menu pull-right"-->
                            <!--v-bind:class=" { open : isOpened == 'User' }">-->

                            <!--<li>-->
                                <!--<router-link to="/profile">-->
                                    <!--<span>My Profile</span>-->
                                <!--</router-link>-->
                            <!--</li>-->

                            <!--<li>-->
                                <!--<a href="">-->
                                    <!--Log off-->
                                <!--</a>-->
                            <!--</li>-->
                        <!--</ul>-->
                    <!--</li>-->
                    <!--&lt;!&ndash; END LOGIN MENU &ndash;&gt;-->
                <!--</ul>-->
                <!--&lt;!&ndash; END SIDE MENU &ndash;&gt;-->
            <!--</nav>-->
        <!--</header>-->
        <!----------------------------------------------------------------------------------------------->

        <!--<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">-->
            <!--<el-menu-item index="1">Processing Center</el-menu-item>-->
            <!--<el-submenu index="2">-->
                <!--<template slot="title">Workspace</template>-->
                <!--<el-menu-item index="2-1">item one</el-menu-item>-->
                <!--<el-menu-item index="2-2">item two</el-menu-item>-->
                <!--<el-menu-item index="2-3">item three</el-menu-item>-->
            <!--</el-submenu>-->
            <!--<el-menu-item index="3"><a href="https://www.ele.me" target="_blank">Orders</a></el-menu-item>-->
        <!--</el-menu>-->
        <!--<div class="line"></div>-->
        <el-header>
            <el-row>
                <el-col :span="16" :offset="4">
                    <span class="logo">
                        <router-link to="/">
                            <img class="logo" src="../../assets/images/logo.svg" alt="logo"/>
                        </router-link>
                    </span>
                    <el-menu
                            class="el-menu-demo"
                            :router="true" :default-active="$route.path"
                            mode="horizontal"
                        >
                        <el-menu-item index="/">
                            <router-link to="/">
                                <span>Time</span>
                            </router-link>
                        </el-menu-item>
                        <el-menu-item index="2">Processing Center</el-menu-item>
                        <el-submenu index="3">
                            <template slot="title">Manage</template>
                            <el-menu-item index="/teams">
                                <router-link to="/teams">
                                    Teams
                                </router-link>
                            </el-menu-item>
                            <el-menu-item index="/clients">
                                <router-link to="/clients">
                                    <span>Clients</span>
                                </router-link>
                            </el-menu-item>
                            <el-menu-item index="/projects">
                                <router-link to="/projects">
                                    <span>Projects</span>
                                </router-link>
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">Orders</a></el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
        </el-header>

    </div>
</template>

<script>
    import ElRow from 'element-ui/packages/row/src/row';

    export default {
        components: { ElRow },
        data() {
            return {
                isOpened: null,
            };
        },
        created() {
            this.$store.dispatch('getUser');
        },
        computed: {
            timerStarted() {
                return this.$store.state.timerStarted;
            },
            user() {
                return this.$store.state.user;
            },
        },
        methods: {
            showSubMenu(name) {
                this.isOpened = (this.isOpened === null) ? name : null;
            },
            startTimer() {
                this.$store.dispatch('startTimer');
                this.$store.dispatch('createTask');
            },
            stopTimer() {
                const taskIndex = this.$store.state.activeTask;
                const activeTask = this.$store.state.tasks[taskIndex];
                this.$store.dispatch('stopTimer');
                this.$store.dispatch('stopTask', { task_id: activeTask.id, index: taskIndex, task: activeTask });
            },
            subIsActive(input) {
                const paths = Array.isArray(input) ? input : [input];

                // current path starts with this path string
                return paths.some(path => this.$route.path.indexOf(path) === 0);
            },
            hideSubMenu() {
                setTimeout(() => {
                    this.isOpened = null;
                }, 300);
            },
        },
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
    .logo {
        width  : 240px;
        height : 70px;
        float: left;
    }

    .el-menu-demo {
        float: right;
        margin-right: 8em;
    }

    .el-header {
        background-color: #fff;
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
