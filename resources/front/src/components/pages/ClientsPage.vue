<template>
    <div>
        <el-container direction="vertical">
            <nav-menu-auth></nav-menu-auth>
            <!--<div class="container">-->
            <el-main>
                <el-row>
                    <el-col :span="16" :offset="4">
                        <span class="page-title"> Clients </span>
                        <el-card>
                            <div slot="header" class="clearfix">
                                <router-link
                                        :to="generateUrl('clients/new')"
                                        class="el-button el-button--primary is-plain">
                                    <i class="el-icon-plus"></i> New Client
                                </router-link>
                            </div>
                            <el-table
                                    :data="clients"
                                    stripe
                                    :default-sort = "{prop: 'name'}">
                                <el-table-column
                                        prop="name"
                                        label="Name"
                                        sortable>
                                </el-table-column>
                                <el-table-column label="Contact Name">
                                    <template slot-scope="scope">
                                        <div>{{ scope.row.contact.first_name }} {{ scope.row.contact.last_name }}</div>
                                    </template>
                                </el-table-column>
                                <!--<el-table-column label="Members">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<div v-if="scope.row.users.length < 1 "> No members</div>-->
                                        <!--<div v-if="scope.row.users.length === 1">{{ scope.row.users[0].name }}</div>-->
                                        <!--<div v-if="scope.row.users.length === 2">-->
                                            <!--{{ scope.row.users[0].name }} and {{ scope.row.users[1].name }}-->
                                        <!--</div>-->
                                        <!--<div v-if="scope.row.users.length === 3">-->
                                            <!--{{ scope.row.users[0].name }}, {{ scope.row.users[1].name }} and {{ scope.row.users[2].name }}-->
                                        <!--</div>-->
                                        <!--<div v-if="scope.row.users.length > 3">-->
                                            <!--{{ scope.row.users[0].name }}, {{ scope.row.users[1].name }}, {{ scope.row.users[2].name }} and-->
                                            <!--<el-button type="text" @click="showMembers(scope.row.users)">others...</el-button>-->
                                        <!--</div>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <el-table-column
                                        label=""
                                        width="80">
                                    <template slot-scope="scope">
                                        <div v-if="organization.id === scope.row.organization_id">
                                            <el-button type="plain" size="mini" @click="goToClient(scope.row.id)">Edit</el-button>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--members modal-->
                            <!--<el-dialog title="Members" :visible.sync="membersTableVisible">-->
                                <!--<el-table :data="members"-->
                                          <!--:default-sort="{name: 'name'}">-->
                                    <!--<el-table-column property="name"-->
                                                     <!--label="Name"-->
                                                     <!--sortable-->
                                    <!--&gt;</el-table-column>-->
                                    <!--<el-table-column property="email" label="Email"></el-table-column>-->
                                <!--</el-table>-->
                                <!--<span slot="footer" class="dialog-footer">-->
                                        <!--<el-button @click="membersTableVisible = false">Close</el-button>-->
                                <!--</span>-->
                            <!--</el-dialog>-->
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
            <!--</div>-->
        </el-container>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import NavMenuAuth from '../blocks/NavMenuAuth';
    import notification from '../../mixins/notification';

    export default {
        mixins: [notification],
        data() {
            return {
//                membersTableVisible: false,
//                members            : [],
            };
        },
        created() {
            this.$store.dispatch('getClients', {
                organization_id: this.$route.params.organizationId,
            })
                .catch(() => {
                    this.showError('Something went wrong in loading clients...');
                });
        },
        computed: {
            ...mapGetters([
                'organization',
                'clients',
            ]),
        },
        methods: {
            goToClient(clientId) {
                this.$router.push({ name: 'editClient', params: { clientId } });
            },
            generateUrl(url) {
                return `/${this.$route.params.segment}/${this.$route.params.organizationId}/${url}`;
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

    .el-icon-plus {
        font-size: 18px;
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