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
                                <el-table-column
                                        label=""
                                        width="80">
                                    <template slot-scope="scope" v-if="userStatus === 1">
                                        <div v-if="organization.id === scope.row.organization_id">
                                            <el-button type="plain" size="mini" @click="goToClient(scope.row.id)">Edit</el-button>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
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
            userStatus() {
                return (Object.keys(this.organization).length)
                    ? this.organization.users[0].pivot.status
                    : 0;
            },
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