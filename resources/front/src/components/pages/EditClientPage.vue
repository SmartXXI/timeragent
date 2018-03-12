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
                                       @click.prevent="updateClient"
                                       :disabled="formInvalid"
                            > Save </el-button>
                            <el-button type="success"
                                       v-if="isCreating"
                                       title="Click to create"
                                       @click.prevent="createClient"
                                       :disabled="formInvalid"
                            > Save </el-button>
                        </div>
                        <span v-if="isCreating" class="page-title"> New Client</span>
                        <span v-if="isEditing" class="page-title"> Edit Client</span>
                        <el-col :span="24">
                            <el-card>
                                <el-row>
                                    <el-col :span="16" :offset="4">
                                        <el-row>
                                            <label>Name</label>
                                            <el-input :class="{ 'has-error': $v.localClient.name.$error }"
                                                      placeholder="Enter client name"
                                                      v-model="localClient.name"
                                                      @input="$v.localClient.name.$touch()"
                                            ></el-input>
                                            <div class="errors" v-if="$v.localClient.name.$error">
                                                <span class="error-message" v-if="!$v.localClient.name.required">Field is required</span>
                                            </div>
                                        </el-row>
                                        <el-row>
                                            <label>Invoice prefix</label>
                                            <el-input :class="{ 'has-error': $v.localClient.invoice_prefix.$error }"
                                                      placeholder="Enter invoice prefix"
                                                      v-model="localClient.invoice_prefix"
                                                      @input="$v.localClient.invoice_prefix.$touch()"
                                            ></el-input>
                                            <div class="errors" v-if="$v.localClient.invoice_prefix.$error">
                                                <span class="error-message"
                                                      v-if="!$v.localClient.invoice_prefix.maxLength"
                                                >
                                                    Invoice prefix shouldn't have more then 2 letters
                                                </span>
                                            </div>
                                        </el-row>
                                        <el-row>
                                            <label>Address</label>
                                            <el-input
                                                    type="textarea"
                                                    :rows="5"
                                                    placeholder="Enter client address"
                                                    v-model="client.address"
                                            ></el-input>
                                        </el-row>
                                        <el-row>
                                            <label>First name</label>
                                            <el-input
                                                    :class="{ 'has-error': $v.localClient.contact.first_name.$error }"
                                                    placeholder="Enter first name of contact person"
                                                    v-model="localClient.contact.first_name"
                                                    @input="$v.localClient.contact.first_name.$touch()"
                                            ></el-input>
                                            <div class="errors" v-if="$v.localClient.contact.first_name.$error">
                                                <span class="error-message"
                                                      v-if="!$v.localClient.contact.first_name.required"
                                                >
                                                    This field is required
                                                </span>
                                            </div>
                                        </el-row>
                                        <el-row>
                                            <label>Last name</label>
                                            <el-input
                                                      placeholder="Enter last name of contact person"
                                                      v-model="localClient.contact.last_name"
                                            ></el-input>
                                        </el-row>
                                        <el-row>
                                            <label>Email</label>
                                            <el-input
                                                    :class="{ 'has-error': $v.localClient.contact.email.$error }"
                                                    placeholder="Enter email of contact person"
                                                    v-model="localClient.contact.email"
                                                    @input="$v.localClient.contact.email.$touch()"
                                                    @blur="validateEmail"
                                            ></el-input>
                                            <div class="errors" v-if="$v.localClient.contact.email.$error">
                                                <span class="error-message"
                                                      v-if="!$v.localClient.contact.email.required"
                                                >
                                                    This field is required
                                                </span>
                                                <span class="error-message"
                                                      v-if="!$v.localClient.contact.email.isEmail"
                                                >
                                                    Invalid email
                                                </span>
                                            </div>
                                        </el-row>
                                        <el-row>
                                            <label>Telephone</label>
                                            <el-input
                                                    placeholder="Enter telephone of contact person"
                                                    v-model="localClient.contact.telephone"
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
    import { required, maxLength } from 'vuelidate/lib/validators';
    import { mapGetters } from 'vuex';
    import NavMenuAuth from '../blocks/NavMenuAuth';
    import notification from '../../mixins/notification';

    export default {
        props : ['clientId'],
        mixins: [notification],
        data() {
            return {
                isCreating: false,
                isEditing : false,
                isEmail   : true,

                localClient: {
                    name   : '',
                    email  : '',
                    address: '',

                    invoice_prefix: '',

                    contact: {
                        first_name: '',
                        last_name : '',
                        email     : '',
                        telephone : '',
                    },
                },
            };
        },
        computed: {
            formInvalid() {
                return this.$v.$invalid;
            },
            ...mapGetters([
                'client',
                'organization',
            ]),
        },
        created() {
            if (this.$route.name === 'newClient') {
                this.isCreating = true;
            }
            if (this.$route.name === 'editClient') {
                this.isEditing = true;
                this.$store.dispatch('getOneClient', {
                    id: this.clientId,
                })
                    .then(() => {
                        Object.assign(this.localClient, this.client);
                    })
                    .catch((error) => {
                        if (error.response.status === 403) {
                            this.showError('Access denied');
                            this.$router.go(-1);
                        }
                    });
            }
        },
        destroyed() {
            this.$store.dispatch('clearClient');
        },
        methods: {
            createClient() {
                if (this.formInvalid) return;
                this.$store.dispatch('createClient', {
                    client        : this.localClient,
                    organizationId: this.organization.id,
                })
                    .then(() => {
                        this.showSuccess('Client created successfully');
                        this.$router.go(-1);
                    })
                    .catch(() => {
                        this.showError();
                    });
            },
            updateClient() {
                if (this.formInvalid) return;
                this.$store.dispatch('updateClient', {
                    client: this.localClient,
                })
                    .then(() => {
                        this.showSuccess('Client saved successfully');
                        this.$router.go(-1);
                    })
                    .catch(() => {
                        this.showError();
                    });
            },
            validateEmail() {
                if (this.localClient.contact.email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i)) {
                    this.isEmail = true;
                } else {
                    this.isEmail = false;
                }
            },
        },
        validations: {
            localClient: {
                name: {
                    required,
                },
                invoice_prefix: {
                    maxLength: maxLength(2),
                },
                contact: {
                    first_name: {
                        required,
                    },
                    email: {
                        required,
                        isEmail() {
                            return this.isEmail;
                        },
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
