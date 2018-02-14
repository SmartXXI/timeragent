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
                    <el-button type="plain"
                               @click.prevent="$router.go(-1)"
                    > Cancel </el-button>
                    <el-button type="success"
                               title="Save project"
                               v-if="isEditing"
                               @click.prevent="updateProject"
                               :disabled="formInvalid"
                    > Save </el-button>
                    <el-button v-if="isCreating"
                               type="success"
                               title="Add Project"
                               @click.prevent="addProject"
                               :disabled="formInvalid"
                    > Save </el-button>
                </div>
                <span v-if="isEditing" class="page-title"> Edit Project </span>
                <span v-if="isCreating" class="page-title"> New Project </span>
            	<el-col :span="24">
            		<el-card>
                          <el-row>
                        <el-col :span="16" :offset="4">
                            <div>
                                <label>Name</label>
                                    <el-input :class="{ 'has-error': $v.project.name.$error }"
                                              placeholder="Enter project name"
                                              v-model="project.name"
                                              @input="$v.project.name.$touch()"
                                    ></el-input>
                                    <div class="errors" v-if="$v.project.name.$error">
                                        <span class="error-message" v-if="!$v.project.name.required">Field is required</span>
                                    </div>
                            </div>

                            <el-tabs v-model="activeTabName">
                                <el-tab-pane label="Teams" name="teams">
                                    <!--<div>-->
                                        <!--<el-button type="primary"-->
                                                   <!--plain-->
                                                   <!--@click="showModal = true"-->
                                        <!--&gt; Add teams to project </el-button>-->
                                    <!--</div>-->

                                    <el-row>
                                        <el-col :offset="4">
                                            <!--<el-transfer v-model="addedTeams"-->
                                            <el-transfer v-model="teamsInTransfer"
                                                         :data="teamsData"
                                                         :titles="['My Teams', 'Project Teams']"
                                                         :render-content="renderTeams"
                                                         @change="moveTeams"
                                            >
                                            </el-transfer>

                                            <!-- Show team members modal form -->
                                            <el-dialog title="Members"
                                                       :visible.sync="showModal"
                                                       width="40%">
                                                <el-table :data="membersDataTable">
                                                    <el-table-column label="Name" prop="name"></el-table-column>
                                                </el-table>
                                                <span slot="footer">
                                                    <el-button @click="showModal = false">Close</el-button>
                                                </span>
                                            </el-dialog>

                                            <el-dialog title="Users rate in project"
                                                       :visible.sync="showTeamUsersRates"
                                                       :show-close="false"
                                                       width="60%"
                                            >
                                                    <el-collapse v-model="openedTeams">
                                                        <el-collapse-item v-for="(team, index) in teamsForChangeRates.newValue" :key="team.id" :title="team.name" :name="team.name">
                                                            <el-table :data="team.users">
                                                                <el-table-column label="Name" prop="name" :width="300"></el-table-column>
                                                                <el-table-column label="Rate" :width="200">
                                                                    <template slot-scope="scope">
                                                                        <el-input-number v-model="scope.row.cost_rate" :step="1" :min="0"></el-input-number>
                                                                    </template>
                                                                </el-table-column>
                                                                <el-table-column label="Currency">
                                                                    <template slot-scope="scope">
                                                                        <el-radio-group v-model="scope.row.cost_currency">
                                                                            <el-radio-button label="$" title="Dollar USA"></el-radio-button>
                                                                            <el-radio-button label="€" title="Euro"></el-radio-button>
                                                                            <el-radio-button label="₴" title="Hryvna"></el-radio-button>
                                                                            <el-radio-button label="£" title="Funt sterling"></el-radio-button>
                                                                        </el-radio-group>
                                                                    </template>
                                                                </el-table-column>
                                                                <el-table-column :width="100">
                                                                    <template slot-scope="scope">
                                                                        <el-button type="plain"
                                                                                   title="Reset"
                                                                                   size="mini"
                                                                                   @click="resetTeamUserRate(index, scope.$index)">
                                                                            <span class="el-icon-refresh"></span>
                                                                        </el-button>
                                                                    </template>
                                                                </el-table-column>
                                                            </el-table>
                                                        </el-collapse-item>
                                                    </el-collapse>
                                                <span slot="footer">
                                                        <el-button type="plain" @click="resetAllTeamsRates">Reset All</el-button>
                                                        <el-button type="success" @click="setTeamsRates">Apply</el-button>
                                                    </span>
                                            </el-dialog>
                                        </el-col>
                                    </el-row>

                                    <!--<div class="teams" v-if="isEditing">-->
                                        <!--<el-collapse v-model="activePanels">-->
                                            <!--<el-collapse-item v-for="(team, index) in project.teams" :key="team.id" :title="team.name" :name="team.name">-->
                                                <!--<el-table :data="team.users"-->
                                                          <!--:default-sort="{ prop: 'name' }"-->
                                                <!--&gt;-->
                                                    <!--<el-table-column label="Name" prop="name"></el-table-column>-->
                                                    <!--<el-table-column label="Cost rate">-->
                                                        <!--<template slot-scope="scope">-->
                                                    <!--<span v-for="user in project.users" :scope="scope">-->
                                                        <!--<span v-if="user.id === scope.row.id && user.pivot.cost_rate != ''">-->
                                                            <!--$ {{ user.pivot.cost_rate }}-->
                                                        <!--</span>-->
                                                    <!--</span>-->
                                                        <!--</template>-->
                                                    <!--</el-table-column>-->
                                                <!--</el-table>-->
                                                <!--<el-col :span="8" :offset="17">-->
                                                    <!--<div>-->
                                                        <!--<el-button type="text" class="delete_button" @click="deleteTeam(index, team.id)"> <i class="el-icon-close"></i> Delete team from project</el-button>-->
                                                    <!--</div>-->
                                                <!--</el-col>-->
                                            <!--</el-collapse-item>-->
                                        <!--</el-collapse>-->
                                    <!--</div>-->
                                </el-tab-pane>
                                <el-tab-pane label="Users" name="users">
                                    <el-row>
                                        <el-col :offset="4">
                                            <el-transfer v-model="usersInTransfer"
                                                         :data="usersData"
                                                         :titles="['All Users', 'Project Users']"
                                                         :render-content="renderUsers"
                                                         @change="moveUsers"
                                            >

                                            </el-transfer>
                                            <!-- Set rates dialog-->
                                            <el-dialog title="Change rates"
                                                       :visible.sync="showUsersRates"
                                                       :show-close="false"
                                            >
                                                <el-table :data="usersForChangeRates.newValue">
                                                    <el-table-column label="Name" prop="name"></el-table-column>
                                                    <el-table-column label="Rate">
                                                        <template slot-scope="scope">
                                                            <el-input-number v-model="scope.row.cost_rate" :step="1" :min="0"></el-input-number>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="Currency">
                                                            <template slot-scope="scope">
                                                                <el-radio-group v-model="scope.row.cost_currency">
                                                                    <el-radio-button label="$" title="Dollar USA"></el-radio-button>
                                                                    <el-radio-button label="€" title="Euro"></el-radio-button>
                                                                    <el-radio-button label="₴" title="Hryvna"></el-radio-button>
                                                                    <el-radio-button label="£" title="Funt sterling"></el-radio-button>
                                                                </el-radio-group>
                                                            </template>
                                                    </el-table-column>
                                                    <el-table-column :width="100">
                                                        <template slot-scope="scope">
                                                            <el-button type="plain"
                                                                       title="Reset"
                                                                       size="mini"
                                                                       @click="resetUserRate(scope.$index)">
                                                                <span class="el-icon-refresh"></span>
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                                <span slot="footer">
                                                    <el-button type="plain" @click="resetAllUsersRates">Reset All</el-button>
                                                    <el-button type="success" @click="setUsersRates">Apply</el-button>
                                                </span>
                                            </el-dialog>
                                        </el-col>
                                    </el-row>
                                </el-tab-pane>
                            </el-tabs>

                            <div v-if="isEditing">
                            <div><el-button type="text" class="delete_button" @click="showConfirmModal = true">Delete Project</el-button></div>

                            <!-- Confirm delete project modal form -->
                            <el-dialog
                                    title="Delete team"
                                    :visible.sync="showConfirmModal"
                                    width="30%">
                                <p>It will not be undone. Please enter project name to continue: <br>({{ project.name }})</p>
                                <el-input v-model="projectName"
                                          placeholder="Enter project name"></el-input>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click.prevent="showConfirmModal = false">Cancel</el-button>
                                    <el-button :disabled="!confirmDeleteProject" type="danger" @click.prevent="deleteProject">Delete</el-button>
                                </span>
                            </el-dialog>
                            </div>
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
import { mapGetters } from 'vuex';
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
            showModal : false,

            showConfirmModal: false,
            activeTabName   : 'teams',
            openedTeams     : [],
            projectName     : '',
            membersDataTable: [],
            teamsInTransfer : [],
            usersInTransfer : [],
            teamsGenerated  : false,
            usersGenerated  : false,
            projectUsers    : [],
            projectTeams    : [],
            showUsersRates  : false,

            showTeamUsersRates : false,
            usersForChangeRates: {
                oldValue: [],
                newValue: [],
            },
            teamsForChangeRates: {
                oldValue: [],
                newValue: [],
            },
        };
    },
    created() {
        this.$store.dispatch('getOwnTeams');
        this.$store.dispatch('getOwnUsers');
        if (this.$route.name === 'newProject') {
            this.isCreating = true;
            this.$store.dispatch('clearProject');
            this.loading = false;
        }
        if (this.$route.name === 'editProject') {
            this.isEditing = true;
            this.$store.dispatch('getOneProject', { projectId: this.projectId })
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
    },
    computed: {
        // Checking is form valid
        formInvalid() {
            return this.$v.$invalid;
        },
        // Getters
        ...mapGetters([
            'project',
            'ownTeams',
            'ownUsers',
        ]),
        // Checking is verifying name equal project name to confirm deleting
        confirmDeleteProject() {
            return this.projectName === this.project.name;
        },
        // Generating teams data for transfer
        teamsData() {
            const data = [];
            const teams = this.ownTeams;
            teams.forEach((team) => {
                data.push({
                    key  : team.id,
                    label: team.name,
                    users: team.users,
                });
            });
            if (this.isEditing) {
                if (!this.teamsGenerated && this.project.teams) {
                    this.project.teams.map((team) => {
                        this.teamsInTransfer.push(team.id);
                        this.projectTeams.push({
                            id   : team.id,
                            users: team.users,
                        });
                        return team;
                    });
                    this.teamsGenerated = true;
                }
            }
            return data;
        },
        // Generating users data for transfer
        usersData() {
            const data = [];
            const users = this.ownUsers;
            users.forEach((user) => {
                let userIsInProject = null;
                if (this.isEditing && this.project.teams) {
                    userIsInProject = this.project.users.find(userInProject => (
                        user.id === userInProject.id ? userInProject : null
                    ));
                    if (!this.usersGenerated) {
                        this.project.users.map((localUser) => {
                            this.usersInTransfer.push(localUser.id);
                            this.projectUsers.push({
                                id               : localUser.id,
                                cost_rate        : localUser.pivot.cost_rate,
                                cost_currency    : localUser.pivot.cost_currency,
                                billable_rate    : localUser.pivot.billable_rate,
                                billable_currency: localUser.pivot.billable_currency,
                            });
                            return localUser;
                        });
                        this.usersGenerated = true;
                    }
                }
                data.push({
                    key  : user.id,
                    label: user.name,

                    cost_rate: userIsInProject
                        ? userIsInProject.pivot.cost_rate
                        : null,

                    cost_currency: userIsInProject
                        ? userIsInProject.pivot.cost_currency
                        : null,

                    billable_rate: userIsInProject
                        ? userIsInProject.pivot.billable_rate
                        : null,
                });
            });
            return data;
        },
    },
    destroyed() {
        // Clear project variable in store
        this.$store.dispatch('clearProject');
    },
    methods: {
        // Handle function for transfer users adding
        moveUsers(value, direction, movedKeys) {
            if (direction === 'right') {
                movedKeys.forEach((key) => {
                    const user = {};
                    const oldUser = {};
                    const userInArray = this.getUser(key);

                    if (this.userIsInProject(userInArray.id)) {
                        setTimeout(() => {
                            this.showWarning(`${userInArray.name} is already added to project`);
                        });
                        this.usersInTransfer = this.usersInTransfer
                            .filter(userId => userId !== key);
                        return key;
                    }

                    this.showUsersRates = true;

                    if (userInArray) {
                        Object.assign(user, userInArray);
                        Object.assign(oldUser, userInArray);
                    }
                    this.usersForChangeRates.oldValue.push(oldUser);
                    this.usersForChangeRates.newValue.push(user);
                    return key;
                });
            } else {
                this.projectUsers = this.projectUsers.filter(userData => (
                    !movedKeys.find(userId => (
                        userId === userData.id
                    ))
                ));
            }
        },
        // Handle function for transfer teams adding
        moveTeams(value, direction, movedKeys) {
            if (direction === 'right') {
                movedKeys.forEach((key) => {
                    let team = {};
                    let oldTeam = {};
                    const teamInArray = this.getTeam(key);

                    const usersInProject = teamInArray.users
                        .filter(user => this.userIsInProject(user.id));


                    if (usersInProject.length) {
                        const names = usersInProject.map(user => user.name);

                        setTimeout(() => {
                            this.showWarning(`${names.join(', ')} ${(names.length === 1) ? 'is' : 'are'} already added to project`);
                        });

                        this.teamsInTransfer = this.teamsInTransfer
                            .filter(teamId => teamId !== key);
                        return key;
                    }

                    this.showTeamUsersRates = true;

                    teamInArray.users.forEach((user) => {
                        if (this.userIsInProject(user.id)) {
                            this.showWarning(`${user.name} is already added to project`);
                        }
                    });

                    if (teamInArray) {
                        team = this.cloneDeep(teamInArray);
                        oldTeam = this.cloneDeep(teamInArray);
                    }
                    this.teamsForChangeRates.oldValue.push(oldTeam);
                    this.teamsForChangeRates.newValue.push(team);
                    return key;
                });
                if (this.teamsForChangeRates.newValue.length === 1) {
                    this.openedTeams.push(this.teamsForChangeRates.newValue[0].name);
                }
            } else {
                this.projectTeams = this.projectTeams.filter(teamData => (
                    !movedKeys.find(teamId => teamId === teamData.id)
                ));
            }
        },
        cloneDeep(object) {
            return JSON.parse(JSON.stringify(object));
        },
        // Add project
        addProject() {
            if (this.$v.$invalid) return;
            this.$store.dispatch('addProject', {
                project     : this.project,
                projectTeams: this.projectTeams,
                projectUsers: this.projectUsers,
            })
                .then(() => {
                    this.showSuccess('Project saved successful');
                    this.$router.push('/projects');
                })
                .catch(() => {
                    this.showError();
                });
        },
        // Update project
        updateProject() {
            if (this.$v.$invalid) return;
            this.$store.dispatch('updateProject', {
                projectId   : this.project.id,
                project     : this.project,
                projectTeams: this.projectTeams,
                projectUsers: this.projectUsers,
            })
                .then(() => {
                    this.showSuccess('Project saved successful');
                    this.$router.push('/projects');
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
                    this.$router.push('/projects');
                })
                .catch(() => {
                    this.showError();
                });
        },
        // Render one team row in transfer
        renderTeams(h, option) {
            return h('span', [h('el-button', {
                class: {
                    'member-item': true,
                },
                attrs: {
                    type: 'text',
                },
                on: {
                    click: () => {
                        this.membersDataTable = option.users;
                        this.showModal = true;
                    },
                },
            }, option.label)]);
        },
        // Render one user row in transfer
        renderUsers(h, option) {
            return h('span', [
                option.label,
                h('span', //eslint-disable-line
                    {
                        class: {
                            rate: true,
                        },
                        attrs: {
                            title: 'Project rate',
                        },
                    },
                    [
                        (option.cost_currency) ? option.cost_currency : '',
                        option.cost_rate,
                    ]
                ),
            ]);
        },
        // Set users rates
        setUsersRates() {
            this.showUsersRates = false;
            this.usersForChangeRates.newValue.forEach((user) => {
                this.projectUsers.push(user);
            });
            this.usersForChangeRates.oldValue = [];
            this.usersForChangeRates.newValue = [];
        },
        // Set teams rates
        setTeamsRates() {
            this.showTeamUsersRates = false;
            this.teamsForChangeRates.newValue.forEach((team) => {
                this.projectTeams.push(team);
            });
            this.teamsForChangeRates.oldValue = [];
            this.teamsForChangeRates.newValue = [];
            this.openedTeams = [];
        },
        resetTeamUserRate(teamIndex, userIndex) {
            this.teamsForChangeRates
                .newValue[teamIndex]
                .users[userIndex]
                .cost_rate = this.teamsForChangeRates
                    .oldValue[teamIndex]
                    .users[userIndex]
                    .cost_rate;
            this.teamsForChangeRates
                .newValue[teamIndex]
                .users[userIndex]
                .cost_currency = this.teamsForChangeRates
                    .oldValue[teamIndex]
                    .users[userIndex]
                    .cost_currency;
        },
        resetAllTeamsRates() {
            this.teamsForChangeRates
                .newValue = this.cloneDeep(this.teamsForChangeRates.oldValue);
        },
        resetUserRate(userIndex) {
            this.usersForChangeRates
                .newValue[userIndex]
                .cost_rate = this.usersForChangeRates
                    .oldValue[userIndex]
                    .cost_rate;
            this.usersForChangeRates
                .newValue[userIndex]
                .cost_currency = this.usersForChangeRates
                    .oldValue[userIndex]
                    .cost_currency;
        },
        resetAllUsersRates() {
            this.usersForChangeRates.newValue = this.cloneDeep(this.usersForChangeRates.oldValue);
        },
        getUser(userId) {
            return this.ownUsers.find(user => user.id === userId);
        },
        getTeam(teamId) {
            return this.ownTeams.find(team => team.id === teamId);
        },
        // Check if the user is already attached to project
        userIsInProject(userId) {
            const inTeams = !!this.projectTeams
                .filter(team => (
                    !!team.users
                        .find(user => user.id === userId)
                ))
                .length;
            const inProject = !!this.projectUsers
                .find(user => user.id === userId);
            return inTeams || inProject;
        },
    },
    components: {
        NavMenuAuth,
    },
    validations: {
        project: {
            name: {
                required,
            },
        },
    },
};
</script>
<style lang="scss" rel="stylesheet/css" scoped>

    .el-tabs {
        margin-top: 30px;
    }

    .teams {
        margin-top: 40px;
    }

    .delete_button {
        color: #FA5555;
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