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
                                        <el-option value="" label="No project"></el-option>
                                        <el-option v-for="(client, index) in clients" :label="client.name" :value="client.id" :key="client.id"></el-option>
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

                                        <project-teams-transfer
                                                :isEditing="isEditing"
                                                :isCreating="isCreating"
                                                :project="project"
                                                :ownTeams="ownTeams"
                                                :projectUsers="projectUsers"
                                                @set-project-teams="setProjectTeams"
                                        ></project-teams-transfer>

                                    </el-row>
                                </el-tab-pane>
                                <el-tab-pane label="Users" name="users">
                                    <el-row type="flex" justify="space-around">

                                        <project-users-transfer
                                                isEditing="isEditing"
                                                isCreating="isCreating"
                                                :project="project"
                                                :ownUsers="ownUsers"
                                                :projectTeams="projectTeams"
                                                @set-project-users="setProjectUsers"
                                        ></project-users-transfer>

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
import ProjectTeamsTransfer from './edit-project-page/ProjectTeamsTransfer';
import ProjectUsersTransfer from './edit-project-page/ProjectUsersTransfer';

export default {
    props : ['projectId'],
    mixins: [notification],
    data() {
        return {
            loading   : true,
            isCreating: false,
            isEditing : false,
            showModal : false,

            projectTeams: [],
            projectUsers: [],

            showConfirmModal: false,
            activeTabName   : 'teams',
            projectName     : '',
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
        if (this.$route.name === 'editProjectOrg') {
            this.isEditing = true;
            this.$store.dispatch('getOrganizationProject', {
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
            this.$store.dispatch('clearProject');
            this.loading = false;
        }
        if (this.$route.params.segment === 'organization') {
            this.$store.dispatch('getClients', {
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
            'ownTeams',
            'ownUsers',
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
        // Add project
        createPersonalProject() {
            if (this.$v.$invalid) return;
            this.$store.dispatch('createPersonalProject', {
                project     : this.project,
                projectTeams: this.projectTeams,
                projectUsers: this.projectUsers,
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
                projectTeams: this.projectTeams,
                projectUsers: this.projectUsers,
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
                projectTeams: this.projectTeams,
                projectUsers: this.projectUsers,
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
                projectTeams: this.projectTeams,
                projectUsers: this.projectUsers,
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
        setProjectTeams(teams) {
            this.projectTeams = this.cloneDeep(teams);
        },
        setProjectUsers(users) {
            this.projectUsers = this.cloneDeep(users);
        },
        cloneDeep(object) {
            return JSON.parse(JSON.stringify(object));
        },
    },
    components: {
        NavMenuAuth,
        ProjectTeamsTransfer,
        ProjectUsersTransfer,
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
</style>