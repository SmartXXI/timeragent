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
                        <el-button type="success"
                                   v-if="isEditing"
                                   title="Click to save"
                                   @click.prevent="updateOrganization"
                                   :disabled="formInvalid"
                        > Save </el-button>
                        <el-button type="success"
                                   v-if="isCreating"
                                   title="Click to create"
                                   @click.prevent="createOrganization"
                                   :disabled="formInvalid"
                        > Save </el-button>
                    </div>
                    <span v-if="isCreating" class="page-title"> New Organization </span>
                    <span v-if="isEditing" class="page-title"> Edit Organization </span>
                    <el-col :span="24">
                        <el-card>
                            <el-row>
                                <el-col :span="16" :offset="4">
                                    <el-row>
                                        <label>Name</label>
                                        <el-input :class="{ 'has-error': $v.organization.name.$error }"
                                                  placeholder="Enter organization name"
                                                  v-model="organization.name"
                                                  @input="$v.organization.name.$touch()"
                                        ></el-input>
                                        <div class="errors" v-if="$v.organization.name.$error">
                                            <span class="error-message" v-if="!$v.organization.name.required">Field is required</span>
                                        </div>
                                    </el-row>
                                    <el-row>
                                        <label>Email</label>
                                        <el-input :class="{ 'has-error': $v.organization.email.$error }"
                                                  placeholder="Enter organization email"
                                                  v-model="organization.email"
                                                  @input="$v.organization.email.$touch()"
                                        ></el-input>
                                        <div class="errors" v-if="$v.organization.email.$error">
                                            <!--<span class="error-message" v-if="!$v.organization.email.required">Field is required</span>-->
                                        </div>
                                    </el-row>
                                    <el-row>
                                        <label>Phone</label>
                                        <el-input
                                            placeholder="Enter organization phone"
                                            v-model="organization.phone"
                                        ></el-input>
                                    </el-row>
                                    <el-row>
                                        <label>Website</label>
                                        <el-input
                                                placeholder="Enter organization phone"
                                                v-model="organization.website"
                                        ></el-input>
                                    </el-row>
                                    <el-row>
                                        <label>Address</label>
                                        <el-input
                                                type="textarea"
                                                :rows="5"
                                                placeholder="Enter organization address"
                                                v-model="organization.address"
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
        props : ['organizationId'],
        mixins: [notification],
        data() {
            return {
                isCreating: false,
                isEditing : false,
            };
        },
        computed: {
            formInvalid() {
                return this.$v.$invalid;
            },
            ...mapGetters([
                'organization',
            ]),
        },
        created() {
            if (this.$route.name === 'newOrganization') {
                this.isCreating = true;
            }
            if (this.$route.name === 'editOrganization') {
                this.isEditing = true;
                this.$store.dispatch('getOneOrganization', {
                    id: this.organizationId,
                });
            }
        },
        destroyed() {
            this.$store.dispatch('clearOrganization');
        },
        methods: {
            createOrganization() {
                if (this.formInvalid) return;
                this.$store.dispatch('createOrganization', {
                    organization: this.organization,
                })
                    .then(() => {
                        this.showSuccess('Organization created successfully');
                        this.$router.go(-1);
                    })
                    .catch(() => {
                        this.showError();
                    });
            },
            updateOrganization() {
                if (this.formInvalid) return;
                this.$store.dispatch('updateOrganization', {
                    organization: this.organization,
                })
                    .then(() => {
                        this.showSuccess('Organization saved successfully');
                        this.$router.go(-1);
                    })
                    .catch(() => {
                        this.showError();
                    });
            },
        },
        validations: {
            organization: {
                name: {
                    required,
                },
                email: {
                    email,
                },
            },
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
