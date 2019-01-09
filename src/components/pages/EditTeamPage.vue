<template>
  <div>
    <el-main v-loading="loading">
      <el-row>
        <el-col
          :span="16"
          :offset="4">
          <div class="pull-right">
            <div>
              <el-button
                :disabled="saving"
                type="plain"
                @click.prevent="cancel"
              > Cancel
              </el-button>
              <el-button
                v-if="isEditing"
                :disabled="formInvalid || saving"
                type="success"
                title="Click to save"
                @click.prevent="updateTeam"
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
                title="Click to create"
                @click.prevent="createTeam"
              >
                <i
                  v-if="saving"
                  class="el-icon-loading"/>
                Save
              </el-button>
            </div>
            <!--<div v-if="$route.params.segment === 'organization'">-->
            <!--<el-button type="plain"-->
            <!--@click.prevent="$router.go(-1)"-->
            <!--&gt; Cancel </el-button>-->
            <!--<el-button type="success"-->
            <!--v-if="isEditing"-->
            <!--title="Click to save"-->
            <!--@click.prevent="updateOrganizationTeam"-->
            <!--:disabled="formInvalid"-->
            <!--&gt; Save </el-button>-->
            <!--<el-button type="success"-->
            <!--v-if="isCreating"-->
            <!--title="Click to create"-->
            <!--@click.prevent="createOrganizationTeam"-->
            <!--:disabled="formInvalid"-->
            <!--&gt; Save </el-button>-->
            <!--</div>-->

          </div>
          <span
            v-if="isCreating"
            class="page-title"> New Team </span>
          <span
            v-if="isEditing"
            class="page-title"> Edit Team </span>
          <el-col :span="24">
            <el-card>
              <el-row>
                <el-col
                  :span="16"
                  :offset="4">
                  <div>
                    <label>Name</label>
                    <el-input
                      :class="{ 'has-error': $v.localTeam.name.$error }"
                      v-model="localTeam.name"
                      placeholder="Enter team name"
                      @input="$v.localTeam.name.$touch()"
                    />
                    <div
                      v-if="$v.localTeam.name.$error"
                      class="errors">
                      <span
                        v-if="!$v.localTeam.name.required"
                        class="error-message"
                      >Field is required</span>
                    </div>
                  </div>

                  <el-tabs v-model="activeTabName">
                    <el-tab-pane
                      label="Members"
                      name="members">

                      <el-row
                        type="flex"
                        justify="space-around">
                        <el-col :span="24">
                          <el-autocomplete
                            v-model="queryString"
                            :fetch-suggestions="querySearch"
                            :trigger-on-focus="false"
                            placeholder="Search members"
                            value-key="name"
                            class="members-search-input"
                            @select="addMember"
                          >
                            <template slot-scope="{ item }">
                              <span>{{ item.name }}  </span>
                              <span
                                class="green-text"
                              >({{
                                item.email.substr(0, queryString.length)
                              }}</span><span
                                class="gray-text"
                              >{{
                                item.email.slice(queryString.length, item.email.length)
                              }})</span>
                            </template>
                          </el-autocomplete>
                        </el-col>
                      </el-row>
                      <el-row
                        type="flex"
                        justify="space-around"
                        class="transfer">
                        <el-table
                          :data="localTeam.users"
                          :default-sort="{ prop: 'name' }"
                          stripe
                        >
                          <el-table-column
                            prop="name"
                            label="Name"
                            sortable
                          />
                          <el-table-column width="80">
                            <template slot-scope="scope">
                              <el-button
                                :disabled="scope.row.uuid === user.uuid"
                                type="danger"
                                plain
                                size="mini"
                                icon="el-icon-delete"
                                @click="removeMember(scope.row.uuid)"
                              />
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-row>

                    </el-tab-pane>
                  </el-tabs>
                  <div>
                    <el-button
                      v-if="isEditing"
                      type="text"
                      class="delete_button"
                      @click="showConfirmModal = true"
                    >Delete team
                    </el-button>
                  </div>
                  <!-- Confirm delete team modal form -->

                  <el-dialog
                    v-if="isEditing"
                    :visible.sync="showConfirmModal"
                    title="Delete team"
                    width="30%">
                    <p>
                      It will not be undone. Please
                      enter team name to continue: <br>({{ team.name }})</p>
                    <el-input
                      v-model="teamName"
                      placeholder="Enter team name"/>
                    <span
                      slot="footer"
                      class="dialog-footer">
                      <el-button
                        @click.prevent="showConfirmModal = false"
                      >Cancel</el-button>
                      <el-button
                        :disabled="!confirmDeleteTeam"
                        type="danger"
                        @click.prevent="deleteTeam"
                      >Delete</el-button>
                    </span>
                  </el-dialog>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-col>
      </el-row>
    </el-main>
    <div v-show="false">{{ team }}</div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters, mapActions } from 'vuex';
import Team from '../../models/Team';
import notification from '../../mixins/notification';
import loading from '../../mixins/loading';

export default {
  mixins: [notification, loading],
  props: {
    teamUuid: {
      type: String,
      default: () => {
      },
    },
  },
  data() {
    return {
      localTeam: new Team(),
      isCreating: false,
      isEditing: false,
      showModal: false,
      showConfirmModal: false,
      queryString: '',
      queryUsers: [],
      activeTabName: 'members',
      teamName: '',
      querySent: false,
      saving: false,
    };
  },
  computed: {
    formInvalid() {
      return this.$v.$invalid;
    },
    ...mapGetters([
      'team',
      'user',
      'allUsers',
      'organizationMembers',
    ]),
    confirmDeleteTeam() {
      return this.teamName === this.team.name;
    },
  },
  watch: {
    queryString(value) {
      if (value.length < 3) {
        this.querySent = false;
      }
    },
  },
  created() {
    if (this.$route.name === 'editTeam') {
      this.localTeam = this.deepClone(this.team);
      this.isEditing = true;
    }
    if (this.$route.name === 'newTeam') {
      this.isCreating = true;
      this.localTeam.users.push(this.user);
    }
    if (this.$route.name === 'newOrgTeam') {
      this.isCreating = true;
      this.localTeam.users.push(this.user);
    }
    if (this.$route.name === 'editOrgTeam') {
      this.localTeam = this.deepClone(this.team);
      this.isEditing = true;
    }
  },
  destroyed() {
    this.$store.dispatch('clearTeam');
  },
  methods: {
    ...mapActions([
      'getOneTeam',
      'searchOrganizationMembers',
      'searchAllUsers',
    ]),
    querySearch(queryString, cb) {
      if (queryString.length > 2 && !this.querySent) {
        if (this.$route.params.segment === 'personal') {
          this.searchAllUsers({ queryString })
            .then(() => {
              this.queryUsers = this.allUsers;
              this.querySent = true;
            });
        }
        if (this.$route.params.segment === 'organization') {
          this.searchOrganizationMembers({
            queryString,
            orgUuid: this.$route.params.organizationUuid,
          })
            .then(() => {
              this.queryUsers = this.organizationMembers;
              this.querySent = true;
            });
        }
      }
      const members = Object.assign(this.queryUsers);
      const results = queryString ? members.filter(this.createFilter(queryString)) : [];
      // call callback function to return suggestions
      cb(results);
    },
    createFilter(queryString) {
      return member => (member.email.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    },
    addMember(user) {
      this.queryString = '';
      if (this.localTeam.users.find(member => member.uuid === user.uuid)) {
        return;
      }
      this.localTeam.users.push(user);
    },
    removeMember(userUuid) {
      console.log(
        userUuid === this.user.uuid,
        userUuid,
        this.user.uuid,
      );
      if (userUuid === this.user.uuid) return;
      this.localTeam.users = this.localTeam
        .users
        .filter(teamUser => teamUser.uuid !== userUuid);
    },
    createTeam() {
      if (this.$v.$invalid) return;
      this.saving = true; // start spinner

      if (this.$route.params.segment === 'personal') {
        this.localTeam.ownerType = 'user';
        this.localTeam.ownerUuid = this.user.uuid;
      }

      if (this.$route.params.segment === 'organization') {
        this.localTeam.ownerType = 'organization';
        this.localTeam.ownerUuid = this.$route.params.organizationUuid;
      }

      this.$store.dispatch('createTeam', {
        team: this.localTeam,
      })
        .then(() => {
          this.showSuccess('Team saved successful');
          this.$router.go(-1);
        })
        .catch(() => {
          this.showError();
          this.saving = false;
        });
    },
    updateTeam() {
      if (this.$v.$invalid) return;
      this.saving = true; // start spinner
      this.$store.dispatch('updateTeam', {
        team: this.localTeam,
      })
        .then(() => {
          this.showSuccess('Team saved successful');
          this.$router.go(-1);
        })
        .catch(() => {
          this.showError();
          this.saving = false;
        });
    },
    deleteTeam() {
      if (!this.confirmDeleteTeam) return;
      this.showConfirmModal = false;
      this.$store.dispatch('deleteTeam', { uuid: this.team.uuid })
        .then(() => {
          this.showSuccess('Team deleted successful');
          this.$router.go(-1);
        })
        .catch(() => {
          this.showError();
        });
    },
    deepClone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
  },
  validations: {
    localTeam: {
      name: {
        required,
      },
    },
  },
};
</script>
<style lang="scss"
       rel="stylesheet/css"
       scoped>
  .transfer {
    margin-top : 20px;
  }

  .el-tabs {
    margin-top : 30px;
  }

  .delete_button {
    color : #FA5555;
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
</style>

<style>
  .members-search-input {
    width : 100%;
  }
</style>
