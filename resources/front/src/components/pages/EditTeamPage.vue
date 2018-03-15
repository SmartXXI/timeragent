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
                                   v-if="isEditing"
                                   title="Click to save"
                                    @click.prevent="updateTeam"
                                   :disabled="formInvalid"
                        > Save </el-button>
                        <el-button type="success"
                                   v-if="isCreating"
                                   title="Click to create"
                                    @click.prevent="createPersonalTeam"
                                   :disabled="formInvalid"
                        > Save </el-button>
                    </div>
                    <span v-if="isCreating" class="page-title"> New Team </span>
                    <span v-if="isEditing" class="page-title"> Edit Team </span>
                    <el-col :span="24">
                        <el-card>
                            <el-row>
                            <el-col :span="16" :offset="4">
                                <div>
                                    <label >Name</label>
                                        <el-input :class="{ 'has-error': $v.team.name.$error }"
                                                  placeholder="Enter team name"
                                                  v-model="team.name"
                                                  @input="$v.team.name.$touch()"
                                        ></el-input>
                                        <div class="errors" v-if="$v.team.name.$error">
                                            <span class="error-message" v-if="!$v.team.name.required">Field is required</span>
                                        </div>
                                </div>

                                <el-tabs v-model="activeTabName">
                                    <el-tab-pane label="Members" name="members">

                                        <el-row type="flex" justify="space-around">
                                            <el-col :span="17">
                                                <!--<el-input :class="{ 'has-error': $v.members.$error }"-->
                                                          <!--placeholder="Enter user email..."-->
                                                          <!--v-model="members"-->
                                                          <!--@input="$v.members.$touch()"-->
                                                <!--&gt;</el-input>-->
                                                <!--<i class="fa fa-exclamation-circle error-icon" v-if="$v.members.$error">-->
                                                    <!--<div class="errors">-->
                                                        <!--<span class="error-message" v-if="!$v.members.email">Invalid email</span>-->
                                                    <!--</div>-->
                                                <!--</i>-->
                                                <el-select v-model="membersEmails"
                                                           multiple
                                                           filterable
                                                           allow-create
                                                           placeholder="Type members emails here"
                                                           class="members-emails"
                                                >
                                                </el-select>
                                            </el-col>
                                        </el-row>
                                        <el-row type="flex" justify="space-around" class="transfer">
                                                <el-transfer v-model="teamUsers"
                                                             :data="membersData"
                                                             :titles="['Exists Members', 'To Add']"
                                                >
                                                </el-transfer>
                                        </el-row>
                                        <el-row type="flex" justify="space-around" class="transfer">
                                            <el-table :data="members"
                                                      stripe
                                                      :default-sort="{ prop: 'name' }"
                                            >
                                                <el-table-column prop="name"
                                                                 label="Name"
                                                                 sortable
                                                ></el-table-column>
                                            </el-table>
                                        </el-row>

                                    </el-tab-pane>
                                </el-tabs>
                                <div>
                                    <el-button type="text"
                                                class="delete_button"
                                                v-if="isEditing"
                                                @click="showConfirmModal = true"
                                    >Delete team</el-button>
                                </div>
                                <!-- Confirm delete team modal form -->

                                <el-dialog
                                        title="Delete team"
                                        v-if="isEditing"
                                        :visible.sync="showConfirmModal"
                                        width="30%">
                                    <p>It will not be undone. Please enter team name to continue: <br>({{ team.name }})</p>
                                    <el-input v-model="teamName"
                                              placeholder="Enter team name"></el-input>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click.prevent="showConfirmModal = false">Cancel</el-button>
                                        <el-button :disabled="!confirmDeleteTeam"
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
        </el-container>
    </div>
</template>

<script>
    import { required } from 'vuelidate/lib/validators';
    import { mapGetters, mapActions } from 'vuex';
    import NavMenuAuth from '../blocks/NavMenuAuth';
    import notification from '../../mixins/notification';

    export default {
        props : ['teamId'],
        mixins: [notification],
        data() {
            return {
                loading         : true,
                isCreating      : false,
                isEditing       : false,
                showModal       : false,
                showConfirmModal: false,
                membersEmails   : [],
                teamUsers       : [],
                members         : [],
                activeTabName   : 'members',
                teamName        : '',
                teamsGenerated  : false,
            };
        },
        created() {
            if (this.$route.name === 'editTeam') {
                this.getOneTeam({ teamId: this.teamId })
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
                this.isEditing = true;
                this.getExistsMembers()
                    .then(() => {
                        this.members = this.existsMembers;
                    });
            }
            if (this.$route.name === 'newTeam') {
                this.isCreating = true;
                this.loading = false;
                this.getExistsMembers();
            }
            if (this.$route.name === 'editTeamOrg') {
                this.getOrganizationTeam({
                    orgId : this.$route.params.organizationId,
                    teamId: this.teamId,
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
                this.getOrganizationMembers({
                    orgId: this.$route.params.organizationId,
                })
                    .then(() => {
                        this.members = this.organizationMembers;
                    });
                this.isEditing = true;
            }
        },
        computed: {
            formInvalid() {
                return this.$v.$invalid;
            },
            ...mapGetters([
                'team',
                'existsMembers',
                'organizationMembers',
            ]),
            confirmDeleteTeam() {
                return this.teamName === this.team.name;
            },
            membersData() {
                const data = [];
                this.members.forEach((member) => {
                    data.push({
                        key  : member.id,
                        label: member.name,
                    });
                });
                if (!this.teamsGenerated && this.team.users) {
                    this.team.users.map((user) => {
                        this.teamUsers.push(user.id);
                        return user;
                    });
                    this.teamsGenerated = true;
                }
                return data;
            },
        },
        destroyed() {
            this.$store.dispatch('clearTeam');
        },
        methods: {
            ...mapActions([
                'getOneTeam',
                'getOrganizationTeam',
                'getOrganizationMembers',
                'getExistsMembers',
            ]),
            createPersonalTeam() {
                if (this.$v.$invalid) return;
                this.$store.dispatch('createPersonalTeam', {
                    team          : this.team,
                    teamUsers     : this.teamUsers,
                    emailsToInvite: this.membersEmails,
                })
                    .then(() => {
                        this.showSuccess('Team saved successful');
                        this.$router.push('/teams');
                    })
                    .catch(() => {
                        this.showError();
                    });
            },
            updatePersonalTeam() {
                if (this.$v.$invalid) return;
                this.$store.dispatch('updatePersonalTeam', {
                    team          : this.team,
                    teamUsers     : this.teamUsers,
                    emailsToInvite: this.membersEmails,
                })
                    .then(() => {
                        this.showSuccess('Team saved successful');
                        this.$router.push('/teams');
                    })
                    .catch(() => {
                        this.showError();
                    });
            },
            updateOrganizationTeam() {
                if (this.formInvalid) return;
                this.$store.dispatch('updateOrganizationTeam', {
                    team     : this.team,
                    teamUsers: this.teamUsers,
                });
            },
            deleteTeam() {
                if (!this.confirmDeleteTeam) return;
                this.showConfirmModal = false;
                this.$store.dispatch('deleteTeam', { teamId: this.team.id })
                    .then(() => {
                        this.showSuccess('Team deleted successful');
                        this.$router.push('/teams');
                    })
                    .catch(() => {
                        this.showError();
                    });
            },
        },
        components: {
            NavMenuAuth,
        },
        validations: {
            team: {
                name: {
                    required,
                },
            },
        },
    };
</script>
<style lang="scss" rel="stylesheet/css" scoped>
    .transfer {
        margin-top: 20px;
    }

    .el-tabs {
        margin-top: 30px;
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

<style>
    .members-emails {
        width: 100%;
    }
</style>
