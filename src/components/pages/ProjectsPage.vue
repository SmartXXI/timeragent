<template>
  <div>
    <el-main v-loading="loading">
      <el-row>
        <el-col
          :span="16"
          :offset="4">
          <span class="page-title"> Projects </span>
          <el-card>
            <div
              slot="header"
              class="clearfix">
              <router-link
                v-if="$route.params.segment === 'personal' || statusInOrganization === 1"
                to="projects/new"
                class="el-button el-button--primary is-plain"
              >
              <i class="el-icon-plus"/> New Project</router-link>
            </div>
            <el-table
              :data="projects"
              :default-sort="{ prop: 'name' }"
              stripe
            >
              <el-table-column
                prop="name"
                label="Name"
                sortable
              />
              <el-table-column
                v-if="profile === 'personal'"
                prop="ownerName"
                label="Owner"
              />
              <el-table-column
                v-if="profile === 'organization'"
                prop="clientName"
                label="Client"
              />
              <el-table-column label="Members">
                <template slot-scope="scope">
                  <template v-if="scope.row.teams.length && scope.row.teams.length < 4">
                    Teams:
                    <template v-for="(team, index) in scope.row.teams">
                      <el-button
                        type="text"
                        @click="showTeamMembers(team)"
                      >
                        {{ team.name }}
                        <span v-if="index !== scope.row.teams.length - 1">,</span>
                      </el-button>
                    </template>
                  </template>
                  <template v-if="scope.row.teams.length > 3">
                    <el-button
                      type="text"
                      @click="showTeams(scope.row.teams)"
                    >Teams</el-button>
                  </template>
                  <div v-if="scope.row.users.length === 1">
                    User: {{ scope.row.users[0].name }}
                  </div>
                  <div v-if="scope.row.users.length === 2">
                    Users: {{ scope.row.users[0].name }}
                    and {{ scope.row.users[1].name }}
                  </div>
                  <div v-if="scope.row.users.length === 3">
                    Users: {{ scope.row.users[0].name }},
                    {{ scope.row.users[1].name }} and
                    {{ scope.row.users[2].name }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                width="80">
                <template slot-scope="scope">
                  <div v-if="scope.row.ownerUuid === user.uuid">
                    <el-button
                      type="plain"
                      size="mini"
                      @click="goToProject(scope.row.uuid)"
                    >Edit</el-button>
                  </div>
                  <div v-if="scope.row.ownerType === 'organization' && statusInOrganization === 1">
                    <el-button
                      type="plain"
                      size="mini"
                      @click="goToOrgProject(scope.row.uuid)"
                    >Edit</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog
              :visible.sync="teamsTableVisible"
              title="Teams">
              <el-table
                :data="teams"
                :default-sort="{prop: 'name'}">
                <el-table-column
                  property="name"
                  label="Name"
                  sortable
                />
                <el-table-column
                  property="ownerName"
                  label="Owner(Team lead)"
                />
                <el-table-column
                  label="Members"
                >
                  <template slot-scope="scope">
                    <div v-for="user in scope.row.users">
                      {{ user.name }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <span
                slot="footer"
                class="dialog-footer">
                <el-button
                  @click="teamsTableVisible = false"
                >Close</el-button>
              </span>
            </el-dialog>
            <el-dialog
              :visible.sync="teamMembersTableVisible"
              title="Team Members">
              <el-table
                :data="teamMembers"
                :default-sort="{prop: 'name'}">
                <el-table-column
                  property="name"
                  label="Name"
                  sortable
                />
              </el-table>
              <span
                slot="footer"
                class="dialog-footer">
                <el-button
                  @click="teamMembersTableVisible = false"
                >Close</el-button>
              </span>
            </el-dialog>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import notification from '../../mixins/notification';
import loading from '../../mixins/loading';
import accessRights from '../../mixins/accessRights';

export default {
  mixins: [notification, loading, accessRights],
  data() {
    return {
      teamsTableVisible: false,
      teamMembersTableVisible: false,
      teamMembers: [],

      teams: [],
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'organization',
      'projects',
    ]),
    profile() {
      return this.$route.params.segment;
    },
  },
  destroyed() {
    this.$store.dispatch('clearProjects');
  },
  methods: {
    goToProject(projectUuid) {
      this.startLoading();
      this.$router.push({ name: 'editProject', params: { projectUuid } });
    },
    goToOrgProject(projectUuid) {
      this.startLoading();
      this.$router.push({ name: 'editOrgProject', params: { projectUuid } });
    },
    showTeams(teams) {
      this.teams = teams;
      this.teamsTableVisible = true;
    },
    showTeamMembers(team) {
      this.teamMembersTableVisible = true;
      this.teamMembers = team.users;
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
