<template>
    <div>
        <el-container direction="vertical">
        <nav-menu-auth></nav-menu-auth>
        <el-main>
            <el-row>
                <el-col :span="16" :offset="4">
                <div class="pull-right">
                    <el-button type="plain"
                               @click.prevent="$router.go(-1)"
                    > Cancel </el-button>
                    <el-button type="success"
                               title="Save project"
                               v-if="$route.name === 'editProject'"
                               @click.prevent="updateProject"
                               :disabled="formInvalid"
                    > Save </el-button>
                    <el-button v-if="$route.name === 'newProject'"
                               type="success"
                               title="Add Project"
                               @click.prevent="addProject"
                               :disabled="formInvalid"
                    > Save </el-button>
                </div>
                <span v-if="$route.name === 'editProject'" class="page-title"> Edit Project </span>
                <span v-if="$route.name === 'newProject'" class="page-title"> New Project </span>
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
                                    <i class="fa fa-exclamation-circle error-icon" v-if="$v.project.name.$error">
                                        <div class="errors">
                                            <span class="error-message" v-if="!$v.project.name.required">Field is required</span>
                                        </div> 
                                    </i>
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
                                            <el-transfer v-model="projectTeams"
                                                         :data="teamsData"
                                                         :titles="['My Teams', 'To Add']"
                                                         :render-content="renderTeams"
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
                                        </el-col>
                                    </el-row>

                                    <div class="teams" v-if="isEditing">
                                        <el-collapse v-model="activePanels">
                                            <el-collapse-item v-for="(team, index) in project.teams" :key="team.id" :title="team.name" :name="team.name">
                                                <el-table :data="team.users"
                                                          :default-sort="{ prop: 'name' }"
                                                >
                                                    <el-table-column label="Name" prop="name"></el-table-column>
                                                    <el-table-column label="Cost rate">
                                                        <template slot-scope="scope">
                                                    <span v-for="user in project.users" :scope="scope">
                                                        <span v-if="user.id === scope.row.id && user.pivot.cost_rate != ''">
                                                            $ {{ user.pivot.cost_rate }}
                                                        </span>
                                                    </span>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                                <el-col :span="8" :offset="17">
                                                    <div>
                                                        <el-button type="text" class="delete_button" @click="deleteTeam(index, team.id)"> <i class="el-icon-close"></i> Delete team from project</el-button>
                                                    </div>
                                                </el-col>
                                            </el-collapse-item>
                                        </el-collapse>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="Users" name="users">
                                    <el-row>
                                        <el-col :offset="4">
                                            <el-transfer v-model="projectUsers"
                                                         :data="usersData"
                                                         :titles="['All Users', 'To Add']"
                                                         :render-content="renderUsers">

                                            </el-transfer>
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
                                          placeholder="Enter team name"></el-input>
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
import ElTabPane from "../../../node_modules/element-ui/packages/tabs/src/tab-pane.vue";

export default {
    props : ['projectId'],
    mixins: [notification],
    data() {
        return {
            isCreating      : false,
            isEditing       : false,
            showModal       : false,
            showConfirmModal: false,
//            addedTeams      : [],
//            addedMembers    : [],
//            deletedTeams    : [],
            activeTabName   : 'teams',
            activePanels    : [],
            projectName     : '',
            membersDataTable: [],
            projectTeams    : [],
            projectUsers    : [],
            teamsGenerated  : false,
            usersGenerated  : false,
        };
    },
    created() {
        this.$store.dispatch('getOwnTeams');
        this.$store.dispatch('getOwnUsers');
        if (this.$route.name === 'newProject') {
            this.isCreating = true;
        }
        if (this.$route.name === 'editProject') {
            this.isEditing = true;
            this.$store.dispatch('getOneProject', { projectId: this.projectId });
        }
    },
    computed: {
        formInvalid() {
            return this.$v.$invalid;
        },
        ...mapGetters([
            'project',
            'ownTeams',
            'ownUsers',
        ]),
        confirmDeleteProject() {
            return this.projectName === this.project.name;
        },
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
                if (!this.teamsGenerated) {
                    this.project.teams.map((team) => {
                        this.projectTeams.push(team.id);
                        return team;
                    });
                    this.teamsGenerated = true;
                }
            }
            return data;
        },
        usersData() {
            const data = [];
            const users = this.ownUsers;
            users.forEach((user) => {
                let userIsInProject = null;
                if (this.$route.name === 'editProject') {
                    userIsInProject = this.project.users.find((userInProject) => {
                        return user.id === userInProject.id ? userInProject : null;
                    });
                    if (!this.usersGenerated) {
                        this.project.users.map((user) => {
                            this.projectUsers.push(user.id);
                            return user;
                        });
                        this.usersGenerated = true;
                    }
                }
                data.push({
                    key          : user.id,
                    label        : user.name,
                    cost_rate    : (userIsInProject) ? userIsInProject.pivot.cost_rate : null,
                    billable_rate: (userIsInProject) ? userIsInProject.pivot.billable_rate : null,
                });
            });
            return data;
        },
    },
    methods: {
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
        updateProject() {
            if (this.$v.$invalid) return;
            this.$store.dispatch('updateProject', {
                projectId   : this.project.id,
                project     : this.project,
//                addedTeams  : this.addedTeams,
//                deletedTeams: this.deletedTeams,
                projectTeams: this.projectTeams,
//                addedMembers: this.addedMembers,
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
//        deleteTeam(index, teamId) {
//            this.deletedTeams.push(teamId);
//            this.project.teams.splice(index);
//        },
//        addTeams() {
//            this.addedTeams.map((teamId) => {
//                const teamIndex = this.ownTeams.findIndex(obj => obj.id === teamId);
//                const index = this.project.teams.findIndex(obj => obj.id === teamId);
//                if (index === -1) {
//                    const team = this.ownTeams[teamIndex];
//                    this.project.teams.push(team);
//                }
//                return teamId;
//            });
//            this.showModal = false;
//        },
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
        renderUsers(h, option) {
            return h('span', [
                option.label,
                h('span',
                    {
                        class: {
                            rate: true,
                        },
                        attrs: {
                            title: 'Project rate',
                        },
                    },
                    [
                        (option.cost_rate) ? ' $' : '',
                        option.cost_rate,
                    ]
                ),
            ]);
        },
    },
    components: {
        ElTabPane,
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

    .container {
        margin-top: 70px;
    }

    .panel {
        display: flex;
        justify-content: center;
        padding: 20px;
    }
    .container-center {
        width: 50%;
    }

    .btn-primary {
    	color: #fff;
    	background-color: #545454;
    	border-color: #545454;
    }

	.btn-primary:hover {
		color: #fff;
    	background-color: #3b3b3b;
    	border-color: #3b3b3b;
	}

    .form-control {
        width: 100%;
        height: 34px;
        padding: 6px 0;
        background-color: transparent;
        background-image: none;
        border: none;
        border-bottom: 1px solid #e0e0e0;
        border-radius: 0;
        -webkit-box-shadow: none;
        transition: border-color ease-in-out .2s;
    }

    .form-control:focus {
        border-bottom: 2px solid #178fe5;
        outline: 0;
        padding: 6px 0 5px;
    }

    .actions {
        display: flex;
        align-items: center;
        text-align: left;
    }

    .margin-top-20 {
        margin-top: 20px !important;
    }

    .btn-primary {
        color: #fff;
        background-color: #545454;
        border-color: #545454;
    }

    .btn-primary:hover {
        color: #fff;
        background-color: #474747;
        border-color: #474747;
    }

    .btn-default {
        color: #525252;
        background-color: rgba(0, 0, 0, .05);
        border-color: rgba(0, 0, 0, .07);
    }

    .btn-icon-default {
        display: inline-block;
        width: 34px;
        height: 34px;
        line-height: 34px;
        border-radius: 17px !important;
        padding: 0 !important;
        color: #525252;
        background-color: transparent;
        border-color: transparent;
        font-size: 20px !important;
    }

    .nav-tabs {
        border: none;
        margin: 0;
        display: flex;
        justify-content: center;

        li.active {
            border-bottom: 2px solid #178fe5;
            a {
                color: #178fe5;
            }
        }

        a {
            margin: 0;
            border: 0!important;
            padding-left: 15px;
            padding-right: 15px;
            padding-bottom: 20px;
            background: 0 0!important;
            color: #525252;
            font-size: 18px;
            line-height: 1.1;
        }
    }

    .modal {
        display: block;
    }
    .modal-backdrop {
        opacity: .5;
    }
    .modal-dialog {
        z-index: 1050;
    }
    .modal-content {
        margin-top: 120px;
    }
    .modal-header {
        padding: 25px;
    }
    .modal-body {
        padding: 25px;
    }

    .form-control {
        width: 100%;
        height: 34px;
        padding: 6px 0;
        background-color: transparent;
        background-image: none;
        border: none;
        border-bottom: 1px solid #e0e0e0;
        border-radius: 0;
        -webkit-box-shadow: none;
        transition: border-color ease-in-out .2s;
    }
    .modal-footer {
        padding: 25px;
        text-align: left;
        border-top: 1px solid #e0e0e0;
    }
    .list-group {
        margin-top: 10px;
    }
    .list-group-item {
        margin-top: 5px;
        margin-bottom: 5px;
    }
    .fa-times {
        cursor: pointer;
    }
</style>