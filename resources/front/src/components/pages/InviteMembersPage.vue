<template>
    <div>
        <el-container direction="vertical">
            <nav-menu-auth></nav-menu-auth>
            <el-main>
                <el-row>
                    <el-col :span="16" :offset="4">
                        <div class="pull-right">
                            <el-button
                                    plain
                                    @click.prevent="$router.go(-1)"
                            >Cancel</el-button>
                            <!--<el-button type="success"-->
                                       <!--v-if="isEditing"-->
                                       <!--title="Click to save"-->
                                       <!--@click.prevent="updateMember"-->
                                       <!--:disabled="formInvalid"-->
                            <!--&gt; Save </el-button>-->
                            <el-button type="success"
                                       v-if="isCreating"
                                       title="Click to create"
                                       @click.prevent="inviteMembers"
                                       :disabled="formInvalid"
                            > Save </el-button>
                        </div>
                        <span v-if="isCreating" class="page-title"> Invite members </span>
                        <span v-if="isEditing" class="page-title"> Edit Member </span>
                        <el-col :span="24">
                            <el-card>
                                <el-row>
                                    <el-col :span="16" :offset="4">
                                        <el-row>
                                            <el-select v-model="emails"
                                                       multiple
                                                       filterable
                                                       allow-create
                                                       placeholder="Type members emails here"
                                                       class="members-emails"
                                            >
                                            </el-select>
                                        </el-row>
                                        <!--<el-row>-->
                                            <!--<label>Name</label>-->
                                            <!--<el-input :class="{ 'has-error': $v.localMember.name.$error }"-->
                                                      <!--placeholder="Enter localOrganization name"-->
                                                      <!--v-model="localOrganization.name"-->
                                                      <!--@input="$v.localOrganization.name.$touch()"-->
                                            <!--&gt;</el-input>-->
                                            <!--<div class="errors" v-if="$v.localOrganization.name.$error">-->
                                                <!--<span class="error-message" v-if="!$v.localOrganization.name.required">Field is required</span>-->
                                            <!--</div>-->
                                        <!--</el-row>-->
                                        <!--<el-row>-->
                                            <!--<label>Email</label>-->
                                            <!--<el-input :class="{ 'has-error': $v.localOrganization.email.$error }"-->
                                                      <!--placeholder="Enter organization email"-->
                                                      <!--v-model="localOrganization.email"-->
                                                      <!--@input="$v.localOrganization.email.$touch()"-->
                                                      <!--@blur="validateEmail"-->
                                            <!--&gt;</el-input>-->
                                            <!--<div class="errors" v-if="$v.localOrganization.email.$error">-->
                                                <!--<span class="error-message" v-if="!$v.localOrganization.email.isEmail">InvalidEmail</span>-->
                                            <!--</div>-->
                                        <!--</el-row>-->
                                        <!--<el-row>-->
                                            <!--<label>Phone</label>-->
                                            <!--<el-input-->
                                                    <!--placeholder="Enter organization phone"-->
                                                    <!--v-model="localOrganization.phone"-->
                                            <!--&gt;</el-input>-->
                                        <!--</el-row>-->
                                        <!--<el-row>-->
                                            <!--<label>Website</label>-->
                                            <!--<el-input-->
                                                    <!--placeholder="Enter localOrganization website"-->
                                                    <!--v-model="localOrganization.website"-->
                                            <!--&gt;</el-input>-->
                                        <!--</el-row>-->
                                        <el-row>
                                            <label>Role</label>
                                            <el-input
                                                    type="textarea"
                                                    :rows="5"
                                                    placeholder="Enter organization address"
                                                    v-model="localMember.status"
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
    import { required } from 'vuelidate/lib/validators';
    import { mapGetters } from 'vuex';
    import NavMenuAuth from '../blocks/NavMenuAuth';
    import notification from '../../mixins/notification';

    export default {
        props : ['memberId'],
        mixins: [notification],
        data() {
            return {
                isCreating: false,
                isEditing : false,

                emails     : [],
                localMember: {},
            };
        },
        computed: {
            formInvalid() {
                return this.$v.$invalid;
            },
            ...mapGetters([
//                'member',
            ]),
        },
        created() {
            if (this.$route.name === 'inviteMembers') {
                this.isCreating = true;
            }
//            if (this.$route.name === 'editOrganization') {
//                this.isEditing = true;
//                this.$store.dispatch('getOneOrganization', {
//                    id: this.organizationId,
//                })
//                    .then(() => {
//                        this.localOrganization = this.organization;
//                    });
//            }
        },
//        destroyed() {
//            this.$store.dispatch('clearOrganization');
//        },
        methods: {
            inviteMembers() {
                if (this.formInvalid) return;
                this.$store.dispatch('inviteToOrganization', {
                    orgId : this.$route.params.organizationId,
                    emails: this.emails,
                })
                    .then(() => {
                        this.showSuccess('Users invited successfully');
                        this.$router.go(-1);
                    })
                    .catch(() => {
                        this.showError();
                    });
            },
        },
        validations: {
//            localOrganization: {
//                name: {
//                    required,
//                },
//                email: {
//                    isEmail() {
//                        return this.isEmail;
//                    },
//                },
//            },
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
