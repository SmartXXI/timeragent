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
                                        <el-input :class="{ 'has-error': $v.localOrganization.name.$error }"
                                                  placeholder="Enter organization name"
                                                  v-model="localOrganization.name"
                                                  @input="$v.localOrganization.name.$touch()"
                                        ></el-input>
                                        <div class="errors" v-if="$v.localOrganization.name.$error">
                                            <span class="error-message" v-if="!$v.localOrganization.name.required">Field is required</span>
                                        </div>
                                    </el-row>
                                    <el-row>
                                        <label>Email</label>
                                        <el-input :class="{ 'has-error': $v.localOrganization.email.$error }"
                                                  placeholder="Enter organization email"
                                                  v-model="localOrganization.email"
                                                  @input="$v.localOrganization.email.$touch()"
                                                  @blur="validateEmail"
                                        ></el-input>
                                        <div class="errors" v-if="$v.localOrganization.email.$error">
                                            <span class="error-message" v-if="!$v.localOrganization.email.isEmail">InvalidEmail</span>
                                        </div>
                                    </el-row>
                                    <el-row>
                                        <label>Phone</label>
                                        <el-input
                                            placeholder="Enter organization phone"
                                            v-model="localOrganization.phone"
                                        ></el-input>
                                    </el-row>
                                    <el-row>
                                        <label>Website</label>
                                        <el-input
                                                placeholder="Enter organization website"
                                                v-model="localOrganization.website"
                                        ></el-input>
                                    </el-row>
                                    <el-row>
                                        <label>Address</label>
                                        <el-input
                                                type="textarea"
                                                :rows="5"
                                                placeholder="Enter organization address"
                                                v-model="localOrganization.address"
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
        props : ['organizationId'],
        mixins: [notification],
        data() {
            return {
                isCreating: false,
                isEditing : false,
                isEmail   : true,

                localOrganization: {},
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
                })
                    .then(() => {
                        this.localOrganization = this.organization;
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
                    organization: this.localOrganization,
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
                    organization: this.localOrganization,
                })
                    .then(() => {
                        this.showSuccess('Organization saved successfully');
                        this.$router.go(-1);
                    })
                    .catch((error) => {
                        if (error.response.status === 403) {
                            this.showError('Access denied');
                            this.$router.go(-1);
                        }
                    });
            },
            validateEmail() {
                if (this.localOrganization.email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i)
                    || this.localOrganization.email === '') {
                    this.isEmail = true;
                } else {
                    this.isEmail = false;
                }
            },
        },
        validations: {
            localOrganization: {
                name: {
                    required,
                },
                email: {
                    isEmail() {
                        return this.isEmail;
                    },
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
