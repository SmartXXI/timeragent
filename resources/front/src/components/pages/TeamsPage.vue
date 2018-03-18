<template>
    <div>
        <el-container direction="vertical">
            <nav-menu-auth></nav-menu-auth>
            <!--<div class="container">-->
            <el-main>
                <el-row>
                    <el-col :span="16" :offset="4">
                        <span class="page-title"> Teams </span>
                        <el-card>
                            <div slot="header" class="clearfix">
                                <router-link
                                        to="teams/new"
                                        class="el-button el-button--primary is-plain">
                                    <i class="el-icon-plus"></i> New Team
                                </router-link>
                            </div>
                            <el-table
                                    :data="teams"
                                    stripe
                                    :default-sort = "{prop: 'name'}">
                                <el-table-column
                                        prop="name"
                                        label="Name"
                                        sortable>
                                </el-table-column>
                                <el-table-column
                                        v-if="$route.params.segment === 'personal'"
                                        prop="owner_name"
                                        label="Owner(Team lead)">
                                </el-table-column>
                                <el-table-column label="Members">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.users.length < 1 "> No members</div>
                                        <div v-if="scope.row.users.length === 1">{{ scope.row.users[0].name }}</div>
                                        <div v-if="scope.row.users.length === 2">
                                            {{ scope.row.users[0].name }} and {{ scope.row.users[1].name }}
                                        </div>
                                        <div v-if="scope.row.users.length === 3">
                                            {{ scope.row.users[0].name }}, {{ scope.row.users[1].name }} and {{ scope.row.users[2].name }}
                                        </div>
                                        <div v-if="scope.row.users.length > 3">
                                            {{ scope.row.users[0].name }}, {{ scope.row.users[1].name }}, {{ scope.row.users[2].name }} and
                                            <el-button type="text" @click="showMembers(scope.row.users)">others...</el-button>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        label=""
                                        width="80">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.owner_id">
                                            <el-button type="plain" size="mini" @click="goToTeam(scope.row.id)">Edit</el-button>
                                        </div>
                                        <div v-if="scope.row.organization_id">
                                            <el-button type="plain" size="mini" @click="goToOrgTeam(scope.row.id)">Edit</el-button>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--members modal-->
                            <el-dialog title="Members" :visible.sync="membersTableVisible">
                                <el-table :data="members"
                                          :default-sort="{name: 'name'}">
                                    <el-table-column property="name"
                                                     label="Name"
                                                     sortable
                                    ></el-table-column>
                                    <el-table-column property="email" label="Email"></el-table-column>
                                </el-table>
                                <span slot="footer" class="dialog-footer">
                                        <el-button @click="membersTableVisible = false">Close</el-button>
                                </span>
                            </el-dialog>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
            <!--</div>-->
        </el-container>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import NavMenuAuth from '../blocks/NavMenuAuth';
    import notification from '../../mixins/notification';

    export default {
        mixins: [notification],
        data() {
            return {
                membersTableVisible: false,
                members            : [],

                teams: [],
            };
        },
        created() {
            if (this.$route.params.segment === 'personal') {
                this.getPersonalTeams()
                    .then(() => {
                        this.teams = this.personalTeams;
                    })
                    .catch(() => {
                        this.showError('Something went wrong in loading teams...');
                    });
            }
            if (this.$route.params.segment === 'organization') {
                this.getOrganizationTeams({ orgId: this.$route.params.organizationId })
                    .then(() => {
                        this.teams = this.organizationTeams;
                    })
                    .catch(() => {
                        this.showError('Something went wrong in loading teams...');
                    });
            }
        },
        computed: {
            ...mapGetters([
                'user',
                'personalTeams',
                'organizationTeams',
            ]),
        },
        methods: {
            ...mapActions([
                'getPersonalTeams',
                'getOrganizationTeams',
            ]),
            goToTeam(teamId) {
                this.$router.push({ name: 'editTeam', params: { teamId } });
            },
            goToOrgTeam(teamId) {
                this.$router.push({ name: 'editOrgTeam', params: { teamId } });
            },
            showMembers(members) {
                this.members = members;
                this.membersTableVisible = true;
            },
        },
        components: {
            NavMenuAuth,
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