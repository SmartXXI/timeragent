<template>
    <div>
        <el-container direction="vertical">
            <nav-menu-auth></nav-menu-auth>
            <el-main>
                <el-row>
                    <el-col :span="16" :offset="4">
                        <span class="page-title"> Members </span>

                        <el-card>
                            <div slot="header" class="clearfix">
                                <router-link to="members/invite"
                                             class="el-button el-button--primary is-plain"
                                >
                                    <i class="el-icon-plus"></i> Invite Members</router-link>
                            </div>
                            <el-table :data="members"
                                      stripe
                                      :default-sort="{ prop: 'name' }"
                            >
                                <el-table-column prop="name"
                                                 label="Name"
                                                 sortable
                                ></el-table-column>
                            </el-table>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
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
                members: [],
            };
        },
        created() {
            if (this.$route.params.segment === 'organization') {
                this.$store.dispatch('getOrganizationMembers', {
                    id: this.$route.params.organizationId,
                })
                    .then(() => {
                        this.members = this.organizationMembers;
                    });
            }
        },
        destroyed() {
            this.$store.dispatch('clearOrganizationMembers');
        },
        computed: {
            ...mapGetters([
                'user',
                'organization',
                'organizationMembers',
            ]),
            profile() {
                return localStorage.getItem('profile');
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