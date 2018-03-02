<template>
    <div>
        <el-container direction="vertical">
        <nav-menu-auth></nav-menu-auth>
        <el-main>
            <el-row>
                <el-col :span="16" :offset="4">
                    <div class="pull-right">
                        <!--<el-button-->
                            <!--plain-->
                            <!--@click.prevent="$router.go(-1)"-->
                        <!--&gt;Cancel</el-button>-->
                        <!--<el-button type="success"-->
                                   <!--v-if="isEditing"-->
                                   <!--title="Click to save"-->
                                   <!--@click.prevent="updateOrganization"-->
                                   <!--:disabled="formInvalid"-->
                        <!--&gt; Save </el-button>-->
                        <el-button
                                type="primary"
                                plain
                                title="Click to edit"
                                @click.prevent="goToEdit(organization.id)"
                        > Edit </el-button>
                    </div>
                    <span class="page-title"> Organization {{ organization.name }}</span>
                    <el-col :span="24">
                        <el-card>
                            <el-row>
                                <el-col :span="16" :offset="4">
                                    <el-row>
                                        <label>Name</label>
                                        <el-input v-model="organization.name" disabled></el-input>
                                    </el-row>
                                    <el-row>
                                        <label>Email</label>
                                        <el-input v-model="organization.email" disabled></el-input>
                                    </el-row>
                                    <el-row>
                                        <label>Phone</label>
                                        <el-input v-model="organization.phone" disabled></el-input>
                                    </el-row>
                                    <el-row>
                                        <label>Website</label>
                                        <el-input v-model="organization.website" disabled></el-input>
                                    </el-row>
                                    <el-row>
                                        <label>Address</label>
                                        <el-input type="textarea"
                                                  v-model="organization.address"
                                                  :rows="5"
                                                  disabled
                                        ></el-input>
                                    </el-row>
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
    import { required, email } from 'vuelidate/lib/validators';
    import { mapGetters } from 'vuex';
    import NavMenuAuth from '../blocks/NavMenuAuth';
    import notification from '../../mixins/notification';

    export default {
        mixins: [notification],
        data() {
            return {

            };
        },
        created() {
            this.$store.dispatch('getOneOrganization', { id: this.$route.params.organizationId })
                .then()
                .catch();
        },
        destroyed() {
            // Clear organization variable in store
            this.$store.dispatch('clearOrganization');
        },
        methods: {
            goToEdit(orgId) {
                this.$router.push({ name: 'editOrganization', params: { orgId } });
            },
        },
        computed: {
            ...mapGetters([
                'organization',
            ]),
        },
        components: {
            NavMenuAuth,
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

    .el-row {
        margin-top: 20px;
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
