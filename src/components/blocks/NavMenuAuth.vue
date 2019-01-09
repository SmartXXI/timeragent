<template>
  <div>
    <el-header>
      <el-row>
        <el-col
          :span="16"
          :offset="4">
          <span class="logo">
            <router-link to="/">
              <img
                class="logo"
                src="./../../assets/images/logo.svg"
                alt="logo">
            </router-link>
          </span>
          <el-menu
            :router="true"
            :default-active="$route.path"
            class="el-menu-demo"
            mode="horizontal"
            @select="startLoading"
          >
            <el-menu-item :index="generateUrl('tasks')">
              <router-link :to="generateUrl('tasks')">
                <span>Tasks</span>
              </router-link>
            </el-menu-item>
            <el-menu-item
              v-if="isOrganization"
              :index="generateUrl('members')">
              <router-link :to="generateUrl('members')">
                <span>Members</span>
              </router-link>
            </el-menu-item>
            <el-menu-item
              v-if="isOrganization"
              :index="generateUrl('projects')">
              <router-link :to="generateUrl('projects')">
                <span>Projects</span>
              </router-link>
            </el-menu-item>
            <el-menu-item
              v-if="isOrganization"
              :index="generateUrl('teams')">
              <router-link :to="generateUrl('teams')">
                Teams
              </router-link>
            </el-menu-item>
            <el-menu-item
              v-if="isOrganization"
              :index="generateUrl('clients')">
              <router-link :to="generateUrl('clients')">
                <span>Clients</span>
              </router-link>
            </el-menu-item>
            <el-submenu
              v-if="isPersonal"
              index="3">
              <template slot="title">Manage</template>
              <el-menu-item
                v-if="isPersonal"
                :index="generateUrl('teams')">
                <router-link :to="generateUrl('teams')">
                  Teams
                </router-link>
              </el-menu-item>
              <el-menu-item
                v-if="isPersonal"
                :index="generateUrl('projects')">
                <router-link :to="generateUrl('projects')">
                  <span>Projects</span>
                </router-link>
              </el-menu-item>
            </el-submenu>
            <el-submenu
              v-if="isPersonal"
              index="4">
              <template slot="title">{{ user.firstName }} {{ user.lastName }}</template>
              <div
                v-for="organization in user.organizations"
                :key="organization.uuid"
              >
                <el-menu-item :index="`/organization/${organization.uuid}/tasks`">
                  <router-link
                    :to="{
                      name: 'tasksOrg',
                      params: {
                        segment: 'organization',
                        organizationUuid: organization.uuid
                      }
                  }">
                    {{ organization.name }}
                  </router-link>
                </el-menu-item>
              </div>
              <el-menu-item :index="generateUrl('organizations/new')">
                <router-link :to="generateUrl('organizations/new')">
                  <i class="el-icon-plus"/> New Organization
                </router-link>
              </el-menu-item>
              <el-menu-item :index="generateUrl('profile')">
                <router-link :to="generateUrl('profile')">
                  Profile
                </router-link>
              </el-menu-item>
              <el-menu-item
                index=""
                @click="logout">
                <router-link to="" >
                  <span>Log out</span>
                </router-link>
              </el-menu-item>
            </el-submenu>
            <el-submenu
              v-if="isOrganization"
              index="4">
              <template slot="title">{{ organization.name }}</template>
              <div
                v-for="owner in organization.owners"
                :key="owner.uuid"
              >
                <el-menu-item index="/personal/tasks">
                  <router-link
                    :to="{
                      name: 'tasks',
                      params: {
                        segment: 'personal'
                      }
                  }">
                    {{ user.firstName }} {{ user.lastName }}
                  </router-link>
                </el-menu-item>
              </div>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </el-header>

  </div>
</template>

<script>
import ElRow from 'element-ui/packages/row/src/row';
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
import loading from '../../mixins/loading';

export default {
  components: {
    ElRow,
  },
  mixins: [loading],
  data() {
    return {
      isOpened: null,
      task: {
        id: 0,
        description: '',
        project_id: null,
        task_id: null,
      },
      users: '',
    };
  },
  computed: {
    ...mapGetters([
      'organization',
      'user',
    ]),
    date() {
      return moment().format('YYYY-MM-DD');
    },
    isOrganization() {
      return this.$route.params.segment === 'organization';
    },
    isPersonal() {
      return this.$route.params.segment === 'personal';
    },
    profile() {
      return this.isPersonal() ? 'personal' : 'organization';
    },
  },
  created() {
    if (this.$route.params.segment === 'organization') {
      if (this.organization.uuid === undefined) {
        this.getOneOrganization({
          uuid: this.$route.params.organizationUuid,
        });
      }
    }
  },
  destroyed() {
    if (this.$route.params.segment === 'personal') {
      this.$store.dispatch('clearOrganization');
    }
  },
  methods: {
    ...mapActions([
      'getOneOrganization',
    ]),
    showSubMenu(name) {
      this.isOpened = (this.isOpened === null) ? name : null;
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
    generateUrl(url) {
      if (this.isOrganization) {
        return `/${this.$route.params.segment}/${this.$route.params.organizationUuid}/${url}`;
      }
      return `/${this.$route.params.segment}/${url}`;
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.go('/');
    },
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
