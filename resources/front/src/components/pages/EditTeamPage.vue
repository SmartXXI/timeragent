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
                        <div v-if="$route.params.segment === 'personal'">
                            <el-button type="plain"
                                       @click.prevent="$router.go(-1)"
                            > Cancel </el-button>
                            <el-button type="success"
                                       v-if="isEditing"
                                       title="Click to save"
                                        @click.prevent="updatePersonalTeam"
                                       :disabled="formInvalid"
                            > Save </el-button>
                            <el-button type="success"
                                       v-if="isCreating"
                                       title="Click to create"
                                        @click.prevent="createPersonalTeam"
                                       :disabled="formInvalid"
                            > Save </el-button>
                        </div>
                        <div v-if="$route.params.segment === 'organization'">
                                <el-button type="plain"
                                           @click.prevent="$router.go(-1)"
                                > Cancel </el-button>
                                <el-button type="success"
                                           v-if="isEditing"
                                           title="Click to save"
                                           @click.prevent="updateOrganizationTeam"
                                           :disabled="formInvalid"
                                > Save </el-button>
                                <el-button type="success"
                                           v-if="isCreating"
                                           title="Click to create"
                                           @click.prevent="createOrganizationTeam"
                                           :disabled="formInvalid"
                                > Save </el-button>
                        </div>

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
                                            <el-col :span="24">
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
                                                <!--<el-select v-model="membersEmails"-->
                                                           <!--multiple-->
                                                           <!--filterable-->
                                                           <!--allow-create-->
                                                           <!--placeholder="Type members emails here"-->
                                                           <!--class="members-emails"-->
                                                <!--&gt;-->
                                                <!--</el-select>-->
                                                <el-autocomplete
                                                        v-model="queryString"
                                                        placeholder="Search members"
                                                        :fetch-suggestions="querySearch"
                                                        value-key="name"
                                                        :trigger-on-focus="false"
                                                        class="members-search-input"
                                                        @select="addMember"
                                                >

                                                </el-autocomplete>
                                            </el-col>
                                        </el-row>
                                        <el-row type="flex" justify="space-around" class="transfer">
                                            <el-table :data="team.users"
                                                      stripe
                                                      :default-sort="{ prop: 'name' }"
                                            >
                                                <el-table-column prop="name"
                                                                 label="Name"
                                                                 sortable
                                                ></el-table-column>
                                                <el-table-column width="80">
                                                    <template slot-scope="scope">
                                                        <el-button type="danger"
                                                                   plain
                                                                   size="mini"
                                                                   icon="el-icon-delete"
                                                                   @click="removeMember(scope.row.id)"
                                                        >

                                                        </el-button>
                                                    </template>
                                                </el-table-column>
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
        <div v-show="false">{{ team }}</div>
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
//                membersEmails   : [],
                queryString     : '',
                queryUsers      : [],
                activeTabName   : 'members',
                teamName        : '',
                querySent       : false,
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
            }
            if (this.$route.name === 'newTeam') {
                this.isCreating = true;
                this.loading = false;
            }
            if (this.$route.name === 'newOrgTeam') {
                this.isCreating = true;
                this.loading = false;
            }
            if (this.$route.name === 'editOrgTeam') {
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
                this.isEditing = true;
            }
        },
        watch: {
            queryString(value) {
                if (value.length < 3) {
                    this.querySent = false;
                }
            },
        },
        computed: {
            formInvalid() {
                return this.$v.$invalid;
            },
            ...mapGetters([
                'team',
                'allUsers',
                'organizationMembers',
            ]),
            confirmDeleteTeam() {
                return this.teamName === this.team.name;
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
                'getAllUsers',
            ]),
            querySearch(queryString, cb) {
                if (queryString.length > 2 && !this.querySent) {
                    if (this.$route.params.segment === 'personal') {
                        this.getAllUsers({ queryString })
                            .then(() => {
                                this.queryUsers = this.allUsers;
                                this.querySent = true;
                            });
                    }
                    if (this.$route.params.segment === 'organization') {
                        this.getOrganizationMembers({
                            orgId: this.$route.params.organizationId,
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
                return (member) => {
                    return (member.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            addMember(user) {
                this.team.users.push(user);
                this.queryString = '';
            },
            removeMember(userId) {
                this.team.users = this.team.users.filter(teamUser => teamUser.id !== userId);
            },
            createPersonalTeam() {
                if (this.$v.$invalid) return;
                this.$store.dispatch('createPersonalTeam', {
                    team     : this.team,
                    teamUsers: this.team.users,
                })
                    .then(() => {
                        this.showSuccess('Team saved successful');
                        this.$router.go(-1);
                    })
                    .catch(() => {
                        this.showError();
                    });
            },
            updatePersonalTeam() {
                if (this.$v.$invalid) return;
                this.$store.dispatch('updatePersonalTeam', {
                    team     : this.team,
                    teamUsers: this.team.users,
                })
                    .then(() => {
                        this.showSuccess('Team saved successful');
                        this.$router.go(-1);
                    })
                    .catch(() => {
                        this.showError();
                    });
            },
            createOrganizationTeam() {
                if (this.formInvalid) return;
                this.$store.dispatch('createOrganizationTeam', {
                    orgId    : this.$route.params.organizationId,
                    team     : this.team,
                    teamUsers: this.team.users,
                })
                    .then(() => {
                        this.showSuccess('Team created successfully');
                        this.$router.go(-1);
                    })
                    .catch(() => {
                        this.showError();
                    });
            },
            updateOrganizationTeam() {
                if (this.formInvalid) return;
                this.$store.dispatch('updateOrganizationTeam', {
                    orgId    : this.$route.params.organizationId,
                    team     : this.team,
                    teamUsers: this.team.users,
                })
                    .then(() => {
                        this.showSuccess('Team updated successfully');
                        this.$router.go(-1);
                    })
                    .catch(() => {
                        this.showError();
                    });
            },
            deleteTeam() {
                if (!this.confirmDeleteTeam) return;
                this.showConfirmModal = false;
                this.$store.dispatch('deleteTeam', { teamId: this.team.id })
                    .then(() => {
                        this.showSuccess('Team deleted successful');
                        this.$router.go(-1);
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
    .members-search-input {
        width: 100%;
    }
</style>
