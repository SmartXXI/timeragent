<template>
  <div>
    <el-main
      v-loading="loading"
    >
      <el-row>
        <el-col
          :span="16"
          :offset="4">
          <div class="pull-right">
            <!--personal-->
            <div>
              <el-button
                :disabled="saving"
                type="plain"
                @click.prevent="cancel"
              > Cancel
              </el-button>
              <el-button
                v-if="isEditing"
                :disabled="formInvalid|| saving"
                type="success"
                title="Save project"
                @click.prevent="updateProject"
              >
                <i
                  v-if="saving"
                  class="el-icon-loading"/>
                Save
              </el-button>
              <el-button
                v-if="isCreating"
                :disabled="formInvalid || saving"
                type="success"
                title="Add Project"
                @click.prevent="createProject"
              >
                <i
                  v-if="saving"
                  class="el-icon-loading"/>
                Save
              </el-button>
            </div>
          </div>
          <span
            v-if="isEditing"
            class="page-title"> Edit Project </span>
          <span
            v-if="isCreating"
            class="page-title"> New Project </span>
          <el-col :span="24">
            <el-card>
              <el-row>
                <el-col
                  :span="16"
                  :offset="4">
                  <div>
                    <el-row>
                      <label>Name</label>
                      <el-input
                        :class="{ 'has-error': $v.localProject.name.$error }"
                        v-model="localProject.name"
                        placeholder="Enter project name"
                        @input="$v.localProject.name.$touch()"
                      />
                      <div
                        v-if="$v.localProject.name.$error"
                        class="errors">
                        <span
                          v-if="!$v.localProject.name.required"
                          class="error-message"
                        >Field is required</span>
                      </div>
                    </el-row>
                  </div>
                  <div v-if="profile === 'organization'">
                    <el-row>
                      <label>Client</label>
                      <div>
                        <el-select
                          v-model="localProject.clientUuid"
                          :disabled="clients.length > 0 ? false : true"
                          @input="$v.localProject.clientUuid.$touch()"
                        >
                          <el-option
                            value=""
                            label="No project"
                          />
                          <el-option
                            v-for="client in clients"
                            :label="client.name"
                            :value="client.uuid"
                            :key="client.uuid"
                          />
                        </el-select>
                      </div>
                    </el-row>
                    <div
                      v-if="$v.localProject.clientUuid.$error"
                      class="errors">
                      <span
                        v-if="!$v.localProject.clientUuid.required"
                        class="error-message"
                      >Field is required</span>
                    </div>
                  </div>

                  <el-tabs v-model="activeTabName">
                    <el-tab-pane
                      label="Teams"
                      name="teams">
                      <el-row
                        type="flex"
                        justify="space-around">
                        <el-autocomplete
                          v-model="queryTeamsString"
                          :fetch-suggestions="searchTeams"
                          :trigger-on-focus="false"
                          placeholder="Search teams"
                          value-key="name"
                          class="members-search-input"
                          @select="setTeamRate"
                        />
                      </el-row>
                      <el-row
                        type="flex"
                        justify="space-around">

                        <el-table
                          :data="localProject.teams"
                          :default-sort="{ prop: 'name' }"
                          stripe
                          empty-text="No Teams"
                        >
                          <el-table-column
                            prop="name"
                            label="Name"
                            sortable
                          >
                            <template slot-scope="scope">
                              <el-popover
                                ref="members"
                                placement="right"
                                width="400"
                                trigger="click">
                                <el-table :data="teamMembers">
                                  <el-table-column
                                    width="230"
                                    property="name"
                                    label="name"
                                  />
                                  <el-table-column
                                    property="options.costRate"
                                    label="Rate"
                                  />
                                </el-table>
                              </el-popover>
                              <el-button
                                v-popover:members
                                type="text"
                                @click="teamMembers = scope.row.users"
                              >
                                {{ scope.row.name }}
                              </el-button>
                            </template>
                          </el-table-column>
                          <el-table-column width="80">
                            <template slot-scope="scope">
                              <el-button
                                type="danger"
                                plain
                                size="mini"
                                icon="el-icon-delete"
                                @click="removeTeam(scope.row.uuid)"
                              />
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-row>
                    </el-tab-pane>
                    <el-tab-pane
                      label="Users"
                      name="users">
                      <el-row
                        type="flex"
                        justify="space-around">
                        <el-autocomplete
                          v-model="queryUsersString"
                          :fetch-suggestions="searchUsers"
                          :trigger-on-focus="false"
                          placeholder="Search users (enter email)"
                          class="members-search-input"
                          @select="setUserRate"
                        >
                          <template slot-scope="{ item }">
                            <span>{{ item.name }}  </span>
                            <span
                              class="green-text"
                            >({{
                              item.email.substr(0, queryUsersString.length)
                            }}</span><span
                              class="gray-text"
                            >{{
                              item.email.slice(queryUsersString.length, item.email.length)
                            }})</span>
                          </template>
                        </el-autocomplete>
                      </el-row>
                      <el-row
                        type="flex"
                        justify="space-around">

                        <el-table
                          :data="localProject.users"
                          :default-sort="{ prop: 'name' }"
                          stripe
                          empty-text="No Users"
                        >
                          <el-table-column
                            prop="name"
                            label="Name"
                            sortable
                          />
                          <el-table-column
                            label="Rate"
                          >
                            <template slot-scope="scope">
                              {{ scope.row.options.costRate }}
                            </template>
                          </el-table-column>
                          <el-table-column width="80">
                            <template slot-scope="scope">
                              <el-button
                                type="danger"
                                plain
                                size="mini"
                                icon="el-icon-delete"
                                @click="removeUser(scope.row.uuid)"
                              />
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-row>
                    </el-tab-pane>
                  </el-tabs>

                  <div v-if="isEditing">
                    <div>
                      <el-button
                        type="text"
                        class="delete_button"
                        @click="showConfirmModal = true"
                      >
                        Delete Project
                      </el-button>
                    </div>

                    <!-- Confirm delete project modal form -->
                    <el-dialog
                      :visible.sync="showConfirmModal"
                      title="Delete team"
                      width="30%">
                      <p>
                        It will not be undone.
                        Please enter project name to continue: <br>
                        ({{ project.name }})
                      </p>
                      <el-input
                        v-model="projectName"
                        placeholder="Enter project name"
                      />
                      <span
                        slot="footer"
                        class="dialog-footer">
                        <el-button
                          @click.prevent="showConfirmModal = false"
                        >
                          Cancel
                        </el-button>
                        <el-button
                          :disabled="!confirmDeleteProject"
                          type="danger"
                          @click.prevent="deleteProject"
                        >
                          Delete
                        </el-button>
                      </span>
                    </el-dialog>
                  </div>
                  <!--Set team rate dialog-->
                  <team-rates-dialog
                    v-if="showTeamRate"
                    :team="teamForChangeRate"
                    @add-team="addTeam"
                  />
                  <!---->
                  <!--Set user rate dialog-->
                  <user-rate-dialog
                    v-if="showUserRate"
                    :users="userForChangeRate"
                    @add-user="addUser"
                  />
                  <!---->
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters, mapActions } from 'vuex';
import notification from '../../mixins/notification';
import loading from '../../mixins/loading';
import TeamRatesDialog from './edit-project-page/TeamRateDialog';
import UserRateDialog from './edit-project-page/UserRateDialog';
import Project from '../../models/Project';

export default {
  components: {
    TeamRatesDialog,
    UserRateDialog,
  },
  mixins: [notification, loading],
  props: {
    projectUuid: {
      type: String,
      default: () => {
      },
    },
  },
  data() {
    return {
      isCreating: false,
      isEditing: false,

      localProject: new Project(),
      queryTeams: [],
      queryUsers: [],
      queryTeamsSent: false,
      queryUsersSent: false,
      queryTeamsString: '',
      queryUsersString: '',

      showConfirmModal: false,
      activeTabName: 'teams',
      projectName: '',

      showUserRate: false,
      userForChangeRate: {},
      oldUserRate: {},

      showTeamRate: false,
      teamForChangeRate: {},
      teamMembers: [],

      saving: false,
    };
  },
  computed: {
    // Checking is form valid
    formInvalid() {
      return this.$v.$invalid;
    },
    // Getters
    ...mapGetters([
      'user',
      'organization',
      'project',
      'allUsers',
      'organizationMembers',
      'personalTeams',
      'organizationTeams',
      'clients',
    ]),
    // Checking is verifying name equal project name to confirm deleting
    confirmDeleteProject() {
      return this.projectName === this.project.name;
    },
    profile() {
      return this.$route.params.segment;
    },
  },
  created() {
    if (this.$route.name === 'newProject') {
      this.isCreating = true;
      this.clearProject();
    }
    if (this.$route.name === 'editProject') {
      this.isEditing = true;
      this.localProject = this.cloneDeep(this.project);
    }
    if (this.$route.name === 'editOrgProject') {
      this.isEditing = true;
      this.localProject = this.cloneDeep(this.project);
    }
    if (this.$route.name === 'newOrgProject') {
      this.isCreating = true;
      this.clearProject();
    }
    if (this.$route.params.segment === 'organization') {
      this.getClients({
        orgUuid: this.$route.params.organizationUuid,
      })
        .catch(() => {
          this.showError('Something went wrong in loading clients...');
        });
    }
  },
  destroyed() {
    // Clear project variable in store
    this.$store.dispatch('clearProject');
  },
  methods: {
    ...mapActions([
      'clearProject',
      'getProject',
      'getClients',
      'searchPersonalTeams',
      'searchOrganizationTeams',
      'searchAllUsers',
      'searchOrganizationMembers',
    ]),
    searchTeams(queryString, cb) {
      if (queryString.length > 2 && !this.queryTeamsSent) {
        if (this.$route.params.segment === 'personal') {
          this.searchPersonalTeams({
            queryString,
            userUuid: this.user.uuid,
          })
            .then(() => {
              this.queryTeams = this.personalTeams;
              this.queryTeamsSent = true;
            });
        }
        if (this.$route.params.segment === 'organization') {
          this.searchOrganizationTeams({
            queryString,
            orgUuid: this.$route.params.organizationUuid,
          })
            .then(() => {
              this.queryTeams = this.organizationTeams;
              this.queryTeamsSent = true;
            });
        }
      } else {
        this.queryTeamsSent = false;
      }
      const teams = Object.assign(this.queryTeams);
      const results = queryString ? teams.filter(this.createTeamsFilter(queryString)) : [];
      // call callback function to return suggestions
      cb(results);
    },
    searchUsers(queryString, cb) {
      if (queryString.length > 2 && !this.queryUsersSent) {
        if (this.$route.params.segment === 'personal') {
          this.searchAllUsers({ queryString })
            .then(() => {
              this.queryUsers = this.allUsers;
              this.queryUsersSent = true;
            });
        }
        if (this.$route.params.segment === 'organization') {
          this.searchOrganizationMembers({
            queryString,
            orgUuid: this.$route.params.organizationUuid,
          })
            .then(() => {
              this.queryUsers = this.organizationMembers;
              this.queryUsersSent = true;
            });
        }
      } else {
        this.queryUsersSent = false;
      }
      const members = Object.assign(this.queryUsers);
      const results = queryString ? members.filter(this.createUsersFilter(queryString)) : [];
      // call callback function to return suggestions
      cb(results);
    },
    createUsersFilter(queryString) {
      return item => (item.email.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    },
    createTeamsFilter(queryString) {
      return item => (item.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    },
    addTeam(team) {
      this.showTeamRate = false;
      this.teamForChangeRate = {};
      this.localProject.teams.push(team);
    },
    removeTeam(teamUuid) {
      this.localProject.teams = this.localProject.teams
        .filter(projectTeam => projectTeam.uuid !== teamUuid);
    },
    addUser(user) {
      this.showUserRate = false;
      this.userForChangeRate = [];
      this.localProject.users.push(user);
    },
    removeUser(userUuid) {
      this.localProject.users = this.localProject.users
        .filter(projectUser => projectUser.uuid !== userUuid);
    },
    // Add project
    createProject() {
      if (this.$v.$invalid) return;
      this.saving = true;
      if (this.$route.params.segment === 'personal') {
        this.localProject.ownerType = 'user';
        this.localProject.ownerUuid = this.user.uuid;
      } else {
        this.localProject.ownerType = 'organization';
        this.localProject.ownerUuid = this.organization.uuid;
      }
      this.$store.dispatch('createProject', {
        project: this.localProject,
      })
        .then(() => {
          this.showSuccess('Project saved successful');
          this.$router.go(-1);
        })
        .catch(() => {
          this.showError();
          this.saving = false;
        });
    },
    // Update project
    updateProject() {
      if (this.$v.$invalid) return;
      this.saving = true; // Start spinner
      if (this.$route.params.segment === 'personal') {
        this.localProject.ownerType = 'user';
        this.localProject.ownerUuid = this.user.uuid;
      } else {
        this.localProject.ownerType = 'organization';
        this.localProject.ownerUuid = this.organization.uuid;
      }
      this.$store.dispatch('updateProject', {
        project: this.localProject,
      })
        .then(() => {
          this.showSuccess('Project saved successful');
          this.$router.go(-1);
        })
        .catch((error) => {
          this.showError(error);
          this.saving = false;
        });
    },
    // Delete project
    deleteProject() {
      if (!this.confirmDeleteProject) return;
      this.showConfirmModal = false;
      this.$store.dispatch('deleteProject', { uuid: this.localProject.uuid })
        .then(() => {
          this.showSuccess('Project deleted successful');
          this.$router.go(-1);
        })
        .catch(() => {
          this.showError();
        });
    },
    cloneDeep(object) {
      return JSON.parse(JSON.stringify(object));
    },
    setTeamRate(team) {
      if (this.localProject.teams.find(teamInArray => teamInArray.uuid === team.uuid)) {
        this.showWarning('This team is already added to the project');
        this.queryTeamsString = '';
        return;
      }
      this.queryTeamsString = '';
      this.showTeamRate = true;
      this.teamForChangeRate = team;
    },
    setUserRate(user) {
      if (this.localProject.users.find(member => member.uuid === user.uuid)) {
        this.showWarning('This user is already added to the project');
        this.queryUsersString = '';
        return;
      }
      this.userForChangeRate = [];
      this.queryUsersString = '';
      this.showUserRate = true;
      this.userForChangeRate[0] = user;
    },
    resetUserRate() {
      this.userForChangeRate = [this.cloneDeep(this.oldUserRate)];
    },
  },
  validations() {
    if (this.profile === 'organization') {
      return {
        localProject: {
          name: {
            required,
          },
          clientUuid: {
            required,
          },
        },
      };
    }
    return {
      localProject: {
        name: {
          required,
        },
      },
    };
  },
};
</script>
<style lang="scss"
       rel="stylesheet/css"
       scoped>

  .el-tabs {
    margin-top : 30px;
  }

  .el-row {
    margin-top : 20px;
  }

  .teams {
    margin-top : 40px;
  }

  .page-title {
    padding     : 0;
    font-size   : 28px;
    line-height : 33px;
    display     : block;
    margin      : 0 0 25px;
    height      : 40px;
    word-break  : break-all;
  }

  body {
    background-color : #efefef;
  }

  .members-search-input {
    width : 100%;
  }
</style>
