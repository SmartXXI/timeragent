<template>
    <div>
        <el-container direction="vertical">
        <nav-menu-auth></nav-menu-auth>
        <el-main
                v-loading.fullscreen.lock="loading"
                element-loading-background="rgba(255, 255, 255, 1)"
        >
            <el-row>
                <el-col :span="16" :offset="4">
                <div class="pull-right">
                    <!--personal-->
                    <div v-if="profile === 'personal'">
                        <el-button type="plain"
                                   @click.prevent="$router.go(-1)"
                        > Cancel </el-button>
                    <el-button type="success"
                               title="Save project"
                               v-if="isEditing"
                               @click.prevent="updatePersonalProject"
                               :disabled="formInvalid"
                    > Save </el-button>
                    <el-button v-if="isCreating"
                               type="success"
                               title="Add Project"
                               @click.prevent="createPersonalProject"
                               :disabled="formInvalid"
                    > Save </el-button>
                    </div>
                     <!--organization-->
                    <div v-if="profile === 'organization'">
                        <el-button type="plain"
                                   @click.prevent="$router.go(-1)"
                        > Cancel </el-button>
                    <el-button type="success"
                               title="Save project"
                               v-if="isEditing"
                               @click.prevent="updateOrganizationProject"
                               :disabled="formInvalid"
                    > Save </el-button>
                    <el-button v-if="isCreating"
                               type="success"
                               title="Add Project"
                               @click.prevent="createOrganizationProject"
                               :disabled="formInvalid"
                    > Save </el-button>
                    </div>
                </div>
                <span v-if="isEditing" class="page-title"> Edit Project </span>
                <span v-if="isCreating" class="page-title"> New Project </span>
            	<el-col :span="24">
            		<el-card>
                          <el-row>
                        <el-col :span="16" :offset="4">
                            <div>
                                <el-row>
                                <label>Name</label>
                                    <el-input :class="{ 'has-error': $v.project.name.$error }"
                                              placeholder="Enter project name"
                                              v-model="project.name"
                                              @input="$v.project.name.$touch()"
                                    ></el-input>
                                    <div class="errors" v-if="$v.project.name.$error">
                                        <span class="error-message" v-if="!$v.project.name.required">Field is required</span>
                                    </div>
                                </el-row>
                            </div>
                            <div v-if="profile === 'organization'">
                                <el-row>
                                    <label>Client</label>
                                    <div>
                                    <el-select
                                            v-model="project.client_id"
                                            :disabled="clients.length > 0 ? false : true"
                                            @input="$v.project.client_id.$touch()"
                                    >
                                        <el-option
                                                value=""
                                                label="No project"
                                        ></el-option>
                                        <el-option
                                                v-for="(client, index) in clients"
                                                :label="client.name"
                                                :value="client.id"
                                                :key="client.id"
                                        ></el-option>
                                    </el-select>
                                    </div>
                                </el-row>
                                <div class="errors" v-if="$v.project.client_id.$error">
                                    <span class="error-message" v-if="!$v.project.client_id.required">Field is required</span>
                                </div>
                            </div>

                            <el-tabs v-model="activeTabName">
                                <el-tab-pane label="Teams" name="teams">
                                    <el-row type="flex" justify="space-around">
                                        <el-autocomplete
                                                v-model="queryTeamsString"
                                                placeholder="Search teams"
                                                :fetch-suggestions="searchTeams"
                                                value-key="name"
                                                :trigger-on-focus="false"
                                                class="members-search-input"
                                                @select="setTeamRate"
                                        ></el-autocomplete>
                                    </el-row>
                                    <el-row type="flex" justify="space-around">

                                        <el-table :data="project.teams"
                                                  stripe
                                                  :default-sort="{ prop: 'name' }"
                                                  empty-text="No Teams"
                                        >
                                            <el-table-column prop="name"
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
                                                            <el-table-column width="374" property="name" label="name"></el-table-column>
                                                        </el-table>
                                                    </el-popover>
                                                    <el-button
                                                            type="text"
                                                            v-popover:members
                                                            @click="teamMembers = scope.row.users"
                                                    >
                                                        {{ scope.row.name }}
                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                            <el-table-column width="80">
                                                <template slot-scope="scope">
                                                    <el-button type="danger"
                                                               plain
                                                               size="mini"
                                                               icon="el-icon-delete"
                                                               @click="removeTeam(scope.row.id)"
                                                    >

                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-row>
                                </el-tab-pane>
                                <el-tab-pane label="Users" name="users">
                                    <el-row type="flex" justify="space-around">
                                        <el-autocomplete
                                                v-model="queryUsersString"
                                                placeholder="Search users"
                                                :fetch-suggestions="searchUsers"
                                                value-key="name"
                                                :trigger-on-focus="false"
                                                class="members-search-input"
                                                @select="setUserRate"
                                        ></el-autocomplete>
                                    </el-row>
                                    <el-row type="flex" justify="space-around">

                                        <el-table :data="project.users"
                                                  stripe
                                                  :default-sort="{ prop: 'name' }"
                                                  empty-text="No Users"
                                        >
                                            <el-table-column prop="name"
                                                             label="Name"
                                                             sortable
                                            ></el-table-column>
                                            <el-table-column
                                                    label="Rate"
                                            >
                                                <template slot-scope="scope">
                                                    {{ scope.row.pivot.cost_rate }} {{ scope.row.pivot.cost_currency }}
                                                </template>
                                            </el-table-column>
                                            <el-table-column width="80">
                                                <template slot-scope="scope">
                                                    <el-button type="danger"
                                                               plain
                                                               size="mini"
                                                               icon="el-icon-delete"
                                                               @click="removeUser(scope.row.id)"
                                                    >

                                                    </el-button>
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
                                        title="Delete team"
                                        :visible.sync="showConfirmModal"
                                        width="30%">
                                    <p>
                                        It will not be undone. Please enter project name to continue: <br>
                                        ({{ project.name }})
                                    </p>
                                    <el-input
                                            v-model="projectName"
                                            placeholder="Enter project name"
                                    ></el-input>
                                    <span slot="footer" class="dialog-footer">
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
                                <el-dialog title="Users rate in project"
                                           :visible.sync="showTeamRate"
                                           width="60%"
                                >
                                    <el-table :data="teamForChangeRate.users">
                                        <el-table-column
                                                label="Name"
                                                prop="name"
                                                :width="300"
                                        ></el-table-column>
                                        <el-table-column
                                                label="Rate"
                                                :width="200"
                                        >
                                            <template slot-scope="scope">
                                                <el-input-number
                                                        v-model="scope.row.cost_rate"
                                                        :step="1"
                                                        :min="0"
                                                ></el-input-number>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Currency">
                                            <template slot-scope="scope">
                                                <el-radio-group v-model="scope.row.cost_currency">
                                                    <el-radio-button
                                                            label="$"
                                                            title="Dollar USA"
                                                    ></el-radio-button>
                                                    <el-radio-button
                                                            label="€"
                                                            title="Euro"
                                                    ></el-radio-button>
                                                    <el-radio-button
                                                            label="₴"
                                                            title="Hryvna"
                                                    ></el-radio-button>
                                                    <el-radio-button
                                                            label="£"
                                                            title="Funt sterling"
                                                    ></el-radio-button>
                                                </el-radio-group>
                                            </template>
                                        </el-table-column>
                                        <el-table-column :width="100">
                                            <template slot-scope="scope">
                                                <el-button type="plain"
                                                           title="Reset"
                                                           size="mini"
                                                           @click="resetTeamUserRate(scope.$index)">
                                                    <span class="fa fa-undo"></span>
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <span slot="footer">
                                        <el-button
                                                type="plain"
                                                @click="resetAllTeamRate"
                                        >
                                            Reset All
                                        </el-button>
                                        <el-button
                                                type="success"
                                                @click="addTeam(teamForChangeRate)"
                                        >
                                            Apply
                                        </el-button>
                                    </span>
                                </el-dialog>
                                <!---->
                                <!--Set user rate dialog-->
                                <el-dialog title="Change rates"
                                           :visible.sync="showUserRate"
                                >
                                    <el-table :data="userForChangeRate">
                                        <el-table-column
                                                label="Name"
                                                prop="name"
                                        ></el-table-column>
                                        <el-table-column label="Rate">
                                            <template slot-scope="scope">
                                                <el-input-number
                                                        v-model="scope.row.cost_rate"
                                                        :step="1"
                                                        :min="0"
                                                ></el-input-number>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Currency">
                                            <template slot-scope="scope">
                                                <el-radio-group v-model="scope.row.cost_currency">
                                                    <el-radio-button
                                                            label="$"
                                                            title="Dollar USA"
                                                    ></el-radio-button>
                                                    <el-radio-button
                                                            label="€"
                                                            title="Euro"
                                                    ></el-radio-button>
                                                    <el-radio-button
                                                            label="₴"
                                                            title="Hryvna"
                                                    ></el-radio-button>
                                                    <el-radio-button
                                                            label="£"
                                                            title="Funt sterling"
                                                    ></el-radio-button>
                                                </el-radio-group>
                                            </template>
                                        </el-table-column>
                                        <el-table-column :width="100">
                                            <template slot-scope="scope">
                                                <el-button type="plain"
                                                           title="Reset"
                                                           size="mini"
                                                           @click="resetUserRate(scope.$index)">
                                                    <i class="fa fa-undo"></i>
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <span slot="footer">
                                        <el-button type="success" @click="addUser(userForChangeRate[0])">Apply</el-button>
                                    </span>
                                </el-dialog>
                                <!---->
                        </el-col>
                          </el-row>
            		</el-card>
            	</el-col>
                </el-col>
            </el-row>
        </el-main>
        </el-container>
    </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters, mapActions } from 'vuex';
import NavMenuAuth from '../blocks/NavMenuAuth';
import notification from '../../mixins/notification';

export default {
    props : ['projectId'],
    mixins: [notification],
    data() {
        return {
            loading   : true,
            isCreating: false,
            isEditing : false,

            queryTeams      : [],
            queryUsers      : [],
            queryTeamsSent  : false,
            queryUsersSent  : false,
            queryTeamsString: '',
            queryUsersString: '',
            showConfirmModal: false,
            activeTabName   : 'teams',
            projectName     : '',

            showUserRate     : false,
            userForChangeRate: [],
            oldUserRate      : {},

            showTeamRate     : false,
            teamForChangeRate: {},
            oldTeamRate      : {},
            teamMembers      : [],
        };
    },
    created() {
        if (this.$route.name === 'newProject') {
            this.isCreating = true;
            this.clearProject();
            this.loading = false;
        }
        if (this.$route.name === 'editProject') {
            this.isEditing = true;
            this.getOneProject({ projectId: this.projectId })
                .then(() => {
                    this.loading = false;
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        this.showError('Access denied');
                        this.$router.go(-1);
                        this.loading = false;
                    }
                });
        }
        if (this.$route.name === 'editProjectOrg') {
            this.isEditing = true;
            this.getOrganizationProject({
                orgId    : this.$route.params.organizationId,
                projectId: this.projectId,
            })
                .then(() => {
                    this.loading = false;
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        this.showError('Access denied');
                        this.$router.go(-1);
                        this.loading = false;
                    }
                });
        }
        if (this.$route.name === 'newProjectOrg') {
            this.isCreating = true;
            this.clearProject();
            this.loading = false;
        }
        if (this.$route.params.segment === 'organization') {
            this.getClients({
                organization_id: this.$route.params.organizationId,
            })
                .catch(() => {
                    this.showError('Something went wrong in loading clients...');
                });
        }
    },
    computed: {
        // Checking is form valid
        formInvalid() {
            return this.$v.$invalid;
        },
        // Getters
        ...mapGetters([
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
            return localStorage.getItem('profile');
        },
    },
    destroyed() {
        // Clear project variable in store
        this.$store.dispatch('clearProject');
    },
    methods: {
        ...mapActions([
            'clearProject',
            'getOneProject',
            'getOrganizationProject',
            'getClients',
            'getPersonalTeams',
            'getOrganizationTeams',
            'getAllUsers',
            'getOrganizationMembers',
        ]),
        searchTeams(queryString, cb) {
            if (queryString.length > 2 && !this.queryTeamsSent) {
                if (this.$route.params.segment === 'personal') {
                    this.getPersonalTeams({ queryString })
                        .then(() => {
                            this.queryTeams = this.personalTeams;
                            this.queryTeamsSent = true;
                        });
                }
                if (this.$route.params.segment === 'organization') {
                    this.getOrganizationTeams({
                        orgId: this.$route.params.organizationId,
                    })
                        .then(() => {
                            this.queryTeams = this.organizationTeams;
                            this.queryTeamsSent = true;
                        });
                }
            }
            const teams = Object.assign(this.queryTeams);
            const results = queryString ? teams.filter(this.createFilter(queryString)) : [];
            // call callback function to return suggestions
            cb(results);
        },
        searchUsers(queryString, cb) {
            if (queryString.length > 2 && !this.queryUsersSent) {
                if (this.$route.params.segment === 'personal') {
                    this.getAllUsers({ queryString })
                        .then(() => {
                            this.queryUsers = this.allUsers;
                            this.queryUsersSent = true;
                        });
                }
                if (this.$route.params.segment === 'organization') {
                    this.getOrganizationMembers({
                        orgId: this.$route.params.organizationId,
                    })
                        .then(() => {
                            this.queryUsers = this.organizationMembers;
                            this.queryUsersSent = true;
                        });
                }
            }
            const members = Object.assign(this.queryUsers);
            const results = queryString ? members.filter(this.createFilter(queryString)) : [];
            // call callback function to return suggestions
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return (item.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        addTeam(team) {
            this.showTeamRate = false;
            this.teamForChangeRate = {};
            this.project.teams.push(team);
        },
        removeTeam(teamId) {
            this.project.teams = this.project.teams
                .filter(projectTeam => projectTeam.id !== teamId);
        },
        addUser(user) {
            Object.assign(user, {
                pivot: {
                    cost_rate    : user.cost_rate,
                    cost_currency: user.cost_currency,
                },
            });
            this.showUserRate = false;
            this.userForChangeRate = [];
            this.project.users.push(user);
        },
        removeUser(userId) {
            this.project.users = this.project.users
                .filter(projectUser => projectUser.id !== userId);
        },
        // Add project
        createPersonalProject() {
            if (this.$v.$invalid) return;
            this.$store.dispatch('createPersonalProject', {
                project     : this.project,
                projectTeams: this.project.teams,
                projectUsers: this.project.users,
            })
                .then(() => {
                    this.showSuccess('Project saved successful');
                    this.$router.go(-1);
                })
                .catch(() => {
                    this.showError();
                });
        },
        // Update project
        updatePersonalProject() {
            if (this.$v.$invalid) return;
            this.$store.dispatch('updatePersonalProject', {
                projectId   : this.project.id,
                project     : this.project,
                projectTeams: this.project.teams,
                projectUsers: this.project.users,
            })
                .then(() => {
                    this.showSuccess('Project saved successful');
                    this.$router.go(-1);
                })
                .catch((error) => {
                    this.showError(error);
                });
        },
        // Org projects
        createOrganizationProject() {
            if (this.$v.$invalid) return;
            this.$store.dispatch('createOrganizationProject', {
                orgId       : this.$route.params.organizationId,
                project     : this.project,
                projectTeams: this.project.teams,
                projectUsers: this.project.users,
            })
                .then(() => {
                    this.showSuccess('Project saved successful');
                    this.$router.go(-1);
                })
                .catch((error) => {
                    this.showError(error);
                });
        },
        updateOrganizationProject() {
            if (this.$v.$invalid) return;
            this.$store.dispatch('updateOrganizationProject', {
                orgId       : this.$route.params.organizationId,
                projectId   : this.project.id,
                project     : this.project,
                projectTeams: this.project.teams,
                projectUsers: this.project.users,
            })
                .then(() => {
                    this.showSuccess('Project saved successful');
                    this.$router.go(-1);
                })
                .catch((error) => {
                    this.showError(error);
                });
        },
        // Delete project
        deleteProject() {
            if (!this.confirmDeleteProject) return;
            this.showConfirmModal = false;
            this.$store.dispatch('deleteProject', { projectId: this.project.id })
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
            if (this.project.teams.find(teamInArray => teamInArray.id === team.id)) {
                this.showWarning('This team is already added to the project');
                this.queryTeamsString = '';
                return;
            }
            this.oldTeamRate = this.cloneDeep(team);
            this.queryTeamsString = '';
            this.showTeamRate = true;
            this.teamForChangeRate = team;
        },
        resetTeamUserRate(index) {
            Object.assign(this.teamForChangeRate.users[index], {
                cost_rate    : this.oldTeamRate.users[index].cost_rate,
                cost_currency: this.oldTeamRate.users[index].cost_currency,
            });
        },
        resetAllTeamRate() {
            this.teamForChangeRate = this.cloneDeep(this.oldTeamRate);
        },
        setUserRate(user) {
            if (this.project.users.find(userInArray => userInArray.id === user.id)) {
                this.showWarning('This user is already added to the project');
                this.queryUsersString = '';
                return;
            }
            this.userForChangeRate = [];
            this.oldUserRate = this.cloneDeep(user);
            this.queryUsersString = '';
            this.showUserRate = true;
            this.userForChangeRate[0] = user;
        },
        resetUserRate() {
            this.userForChangeRate = [this.cloneDeep(this.oldUserRate)];
        },
    },
    components: {
        NavMenuAuth,
    },
    validations() {
        if (this.profile === 'organization') {
            return {
                project: {
                    name: {
                        required,
                    },
                    client_id: {
                        required,
                    },
                },
            };
        }
        return {
            project: {
                name: {
                    required,
                },
            },
        };
    },
};
</script>
<style lang="scss" rel="stylesheet/css" scoped>

    .el-tabs {
        margin-top: 30px;
    }

    .el-row {
        margin-top: 20px;
    }
    .teams {
        margin-top: 40px;
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

    .members-search-input {
        width: 100%;
    }
</style>