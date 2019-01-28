<template>
  <div class="TeamsPage">
    <el-main v-loading="loading">
      <el-row>
        <el-col
          :span="16"
          :offset="4"
        >
          <span class="page-title">
            Teams
          </span>
          <el-card>
            <div
              slot="header"
              class="clearfix"
            >
              <router-link
                v-if="$route.params.segment === 'personal' || statusInOrganization === 1"
                to="teams/new"
                class="el-button el-button--primary is-plain"
              >
                <i class="el-icon-plus"/>
                New Team
              </router-link>
            </div>
            <el-table
              :data="teams"
              :default-sort = "{prop: 'name'}"
              stripe>
              <el-table-column
                prop="name"
                label="Name"
                sortable
              />
              <el-table-column
                v-if="$route.params.segment === 'personal'"
                prop="ownerName"
                label="Owner(Team lead)"
              />
              <el-table-column label="Members">
                <template slot-scope="scope">
                  <div v-if="scope.row.users !== null">
                    <div v-if="scope.row.users.length < 1 ">
                      No members
                    </div>
                    <div v-if="scope.row.users.length === 1">
                      {{ scope.row.users[0].name }}
                    </div>
                    <div v-if="scope.row.users.length === 2">
                      {{ scope.row.users[0].name }} and
                      {{ scope.row.users[1].name }}
                    </div>
                    <div v-if="scope.row.users.length === 3">
                      {{ scope.row.users[0].name }},
                      {{ scope.row.users[1].name }} and
                      {{ scope.row.users[2].name }}
                    </div>
                    <div v-if="scope.row.users.length > 3">
                      {{ scope.row.users[0].name }},
                      {{ scope.row.users[1].name }},
                      {{ scope.row.users[2].name }} and
                      <el-button
                        type="text"
                        @click="showMembers(scope.row.users)"
                      >
                        others...
                      </el-button>
                    </div>
                  </div>
                  <div v-else>
                    No members
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label=""
                width="80"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.ownerUuid === user.uuid">
                    <el-button
                      type="plain"
                      size="mini"
                      @click="goToTeam(scope.row.uuid)"
                    >
                      Edit
                    </el-button>
                  </div>
                  <div v-if="scope.row.ownerType === 'organization' && statusInOrganization === 1">
                    <el-button
                      type="plain"
                      size="mini"
                      @click="goToOrgTeam(scope.row.uuid)"
                    >
                      Edit
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!--members modal-->
            <el-dialog
              :visible.sync="membersTableVisible"
              title="Members">
              <el-table
                :data="members"
                :default-sort="{name: 'name'}"
              >
                <el-table-column
                  property="name"
                  label="Name"
                  sortable
                />
                <el-table-column
                  property="email"
                  label="Email"
                />
              </el-table>
              <span
                slot="footer"
                class="dialog-footer">
                <el-button
                  @click="membersTableVisible = false"
                >
                  Close
                </el-button>
              </span>
            </el-dialog>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import notification from '../../mixins/notification';
import loading from '../../mixins/loading';
import accessRights from '../../mixins/accessRights';

export default {
  mixins: [notification, loading, accessRights],
  data() {
    return {
      membersTableVisible: false,
      members: [],
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'teams',
    ]),
  },
  destroyed() {
    this.$store.dispatch('clearTeams');
  },
  methods: {
    ...mapActions([
      'getTeams',
    ]),
    goToTeam(teamUuid) {
      this.startLoading();
      this.$router.push({ name: 'editTeam', params: { teamUuid } });
    },
    goToOrgTeam(teamUuid) {
      this.startLoading();
      this.$router.push({ name: 'editOrgTeam', params: { teamUuid } });
    },
    showMembers(members) {
      this.members = members;
      this.membersTableVisible = true;
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/css" scoped>

    a.el-button {
        text-decoration: none;
    }

    a.el-button:hover {
        text-decoration: none;
    }
    a.el-button:focus {
        text-decoration: none;
    }

    .page-title {
        padding: 0;
        font-size: 28px;
        line-height: 33px;
        display: block;
        margin: 0 0 25px;
        height: 40px;
        word-break: break-all;
    }

    body {
        background-color: #efefef;
    }
</style>
