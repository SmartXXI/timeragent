<template>
    <div>
        <header>
            <nav class="navbar navbar-default container">
                <!-- BEGIN LOGO -->
                <span class="logo">
                    <router-link to="/">
                        <img class="logo" src="../../assets/images/logo.svg" alt="logo"/>
                    </router-link>

                </span>
                <!-- END LOGO -->
                <!-- BEGIN TIMER ACTIONS -->
                <span class="timer-actions">
                    <div class="timer-buttons">
                        <button title="Start timer" class="btn btn-timer-start" v-if="!timerStarted" @click="startTimer">
                            <i class="fa fa-play"></i>
                        </button>
                        <button class="btn btn-tier-continue" v-if="timerStarted">
                            <i class="fa fa-plus"></i>
                        </button>
                        <button title="Stop timer" class="btn btn-timer-stop" @click="stopTimer" :disabled="!timerStarted">
                            <i class="fa fa-stop"></i>
                        </button>
                    </div>
                </span>
                <!-- END TIMER ACTIONS -->
                <!-- BEGIN NAVIGATION MENU -->
                <div class="main-menu">
                    <ul class="nav navbar-nav">
                        <router-link tag="li" to="/"  exact>
                            <router-link to="/" class="navbar-link bold text-uppercase"  exact>
                                        <span>time</span>
                            </router-link>
                        </router-link>
                        <li class="dropdown">
                            <a href class="dropdown-toggle bold text-uppercase"
                               v-on:click.prevent="showSubMenu('Reports')"
                               v-bind:class="{ expanded: isOpened == 'Reports'}"
                               @blur="hideSubMenu"
                            >
                                <span>Reports</span>
                                <span><i class="fa fa-angle-down"></i></span>
                            </a>
                            <ul class="dropdown-menu"
                                v-bind:class="{ open: isOpened == 'Reports'}">
                                <li>
                                    <a href="">
                                        <span>projectsSummary</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <span>tasksSummary</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <span>teamSummary</span>
                                    </a>
                                </li>
                                <li role="separator" class="divider"></li>
                                <li>
                                    <a href="">
                                        <span>detailedReport</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li class="dropdown"
                            :class="{
                                'router-link-active': subIsActive('/teams') ||
                                subIsActive('/projects') ||
                                subIsActive('/clients')
                        }">
                            <a href class="dropdown-toggle bold text-uppercase"
                               v-on:click.prevent="showSubMenu('Manage')"
                               v-bind:class="{ expanded: isOpened == 'Manage'}"
                               @blur="hideSubMenu"
                            >
                                <span>Manage</span>
                                <span><i class="fa fa-angle-down"></i></span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-default"
                                v-bind:class=" { open : isOpened == 'Manage' }">
                                <li>
                                    <router-link to="/teams">
                                        Teams
                                    </router-link> 
                                </li>
                                <li class="divider"></li>
                                <li>
                                    <router-link to="/clients">
                                        <span>Clients</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/projects">
                                        <span>Projects</span>
                                    </router-link>  
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <!-- END NAVIGATION MENU -->
                <!-- BEGIN SIDE MENU -->
                <ul class="nav navbar-nav pull-right user-menu">
                    <li>
                        <a href="https://timeragent.com/help" target="_blank" title="Help">
                            <i class="fa fa-question-circle"></i>
                        </a>
                    </li>
                    <!-- BEGIN LOGIN MENU -->
                    <li class="dropdown pull-right"
                        :class="{
                                'router-link-active': subIsActive('/profile')
                        }"
                    >
                        <a href=""
                           class="dropdown-toggle"
                           data-toggle="dropdown"
                           data-close-others="true"
                           v-on:click.prevent="showSubMenu('User')"
                           v-bind:class="{ expanded: isOpened == 'User'}"
                           @blur="hideSubMenu"
                        >
                            <span class="login-info">
                                <span v-if="user" class="bold text-overflow">{{ user.name }}</span>
                            </span>
                            <span><i class="fa fa-angle-down"></i></span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-default login-dropdown-menu pull-right"
                            v-bind:class=" { open : isOpened == 'User' }">

                            <li>
                                <router-link to="/profile">
                                    <span>My Profile</span>
                                </router-link>
                            </li>

                            <li>
                                <a href="">
                                    Log off
                                </a>
                            </li>
                        </ul>
                    </li>
                    <!-- END LOGIN MENU -->
                </ul>
                <!-- END SIDE MENU -->
            </nav>
        </header>

    </div>
</template>

<script>
    import {HTTP} from '../../main.js';
    export default {
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
            }
        },
        methods: {
            showSubMenu(name) {
                this.isOpened = (this.isOpened === null) ? name : null;
            },
            // startTimer() {
            //     this.$emit('start-timer');
            // },
            // stopTimer() {
            //     this.$emit('stop-timer');
            // },
            startTimer() {
                this.$store.dispatch('startTimer');
                this.$store.dispatch('createTask');
            },
            stopTimer() {
                let taskIndex = this.$store.state.activeTask;
                let activeTask = this.$store.state.tasks[taskIndex];
                this.$store.dispatch('stopTimer');
                this.$store.dispatch('stopTask', { task_id: activeTask.id, index: taskIndex, task: activeTask });
            },
            subIsActive(input) {
                const paths = Array.isArray(input) ? input : [input];
                return paths.some(path => {
                    return this.$route.path.indexOf(path) === 0 // current path starts with this path string
                })
            },
            hideSubMenu() {
                setTimeout(() => this.isOpened = null, 300);
            }
        },
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
        .logo {
            width: 240px;
            height: 70px;
        }

    body {
        font-family: "Open Sans", sans-serif;
        font-size: 14px;
        line-height: 1.42857;
        color: #525252;

        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1000;
            display: none;
            min-width: 160px;
            padding: 6px 0;
            margin: 5px 0 0;
            list-style: none;
            font-size: 14px;
            text-align: left;
            background-color: #fff;
            border: 1px solid rgba(0, 0, 0, .15);
            border-radius: 3px;
            -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
            box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
            background-clip: padding-box;
        }

        .btn {
            font-size: 18px;
        }

        header {

            display: block;
            flex-grow: 0;
            background-color: #464646;
            box-shadow: 0 2px 3px 0 rgba(47, 47, 47, .25) !important;

            .fa {
                font-size: 0.9em;
            }

            .navbar {
                display: flex;
                justify-content: space-between;
                margin: auto !important;
                border: 0 !important;
                border-radius: unset;

                img {
                    vertical-align: middle;
                }

                .dropdown {

                    .dropdown-menu {

                        position: absolute;
                        left: 0;
                        z-index: 1000;
                        display: none;
                        min-width: 160px;
                        padding: 6px 0;
                        margin: 5px 0 0;
                        list-style: none;
                        font-size: 14px;
                        text-align: left;
                        border-radius: 3px;
                        -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
                        background-clip: padding-box;
                        background-color: #393939;
                        border: none;
                        top: 65px;
                        box-shadow: 2px 2px 3px 0 rgba(47, 47, 47, .25) !important;

                        li {

                            a {
                                color: rgba(255, 255, 255, .5);
                                display: block;
                                padding: 6px 25px;
                                font-weight: 400;
                            }

                            a:hover {
                                color: rgba(255, 255, 255, .75);
                                background-color: #444;
                            }
                        }

                    }

                    .open {
                        display: block;

                        a {
                            background-color: #393939;
                            color: #fff;
                        }
                    }

                }

                * {
                    display: inline-block;
                    vertical-align: top;
                    margin: 0;
                    line-height: inherit;
                }

                .logo {
                    line-height: 70px;
                }

                .timer-buttons {


                    .btn {
                        height: 48px;
                        width: 48px;
                        min-width: 0;
                        margin: 11px 3px;
                        border-radius: 48px;
                        box-shadow: 0 2px 6px rgba(0,0,0,.2)!important;
                    
                        color: #fff;
                        background-color: #00bc6a;
                    }

                    .btn-timer-start:hover {
                        background-color: #00a35c;
                        border-color: #00a35c;
                    }

                    .btn-timer-continue:hover {
                        background-color: #00a35c;
                        border-color: #00a35c;
                    }

                    .btn-timer-stop {
                        height: 36px;
                        width: 36px;
                        margin: 17px 3px;
                        border-radius: 36px;
                        padding: 6px 0;

                        color: #fff;
                        background-color: #e26a6a;
                    }

                    .btn-timer-stop:hover {
                        background-color: #de5555;
                        border-color: #de5555;
                    }
                }

            }

            .navbar-default {

                background-color: #464646;

                .navbar-nav {

                        a.router-link-active {
                            color: #fff;
                            background-color: #393939;
                            border-top: 4px solid transparent;
                            border-bottom: 4px solid #fff;
                            padding-top: 21px;
                            padding-bottom: 21px;
                        }
                        a.router-link-active:hover {
                            color: #fff;
                        }
                    .router-link-active  {

                        a {
                            color: #fff;
                            background-color: #393939;
                            border-top: 4px solid transparent ;
                            border-bottom: 4px solid #fff;
                            padding-top: 21px;
                            padding-bottom: 21px;
                        }
                        .open {
                            a.router-link-active {
                                color: #fff;
                                background-color: #393939;
                            }

                            a.router-link-active:hover {
                                color: #fff;
                            }

                            a {
                                display: block;
                                padding: 6px 25px;
                                font-weight: 400;
                                color: #333;
                                color: rgba(255, 255, 255, .5);
                                border: none;
                            }
                        }
                    }

                    .open a {
                        display: block;
                        padding: 6px 25px;
                        font-weight: 400;
                        color: #333;
                        color: rgba(255,255,255,.5);

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
                        background-color: #393939;
                        color: #fff;
                    }

                    a:focus {
                        color: rgba(255, 255, 255, .75);
                        background-color: #404040;
                    }

                    li {

                        a {
                            color: rgba(255, 255, 255, .5);
                            font-weight: bold;
                            max-height: 70px;
                            padding-top: 25px;
                            padding-bottom: 25px;
                        }
                    }
                }
            }
        }
    }

</style>
