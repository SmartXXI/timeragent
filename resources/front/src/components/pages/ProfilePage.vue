<template>
    <div>
        <el-container direction="vertical">
        <nav-menu-auth></nav-menu-auth>
        <el-main>
            <el-row>
                <el-col :span="16" :offset="4">
                <div class="pull-right">
                    <!--<button type="button" class="btn btn-wide btn-default btn-lg" @click="$router.go(-1)"> Cancel </button> -->
                    <el-button type="plain"
                               @click="$router.go(-1)"
                    > Cancel </el-button>
                    <!--<button type="submit" class="btn btn-wide btn-primary btn-lg" title="Press Ctrl+Enter to save changes" @click="updateUser" :disabled="formInvalid"> Save </button>-->
                    <el-button type="success"
                               @click="updateUser"
                               :disabled="formInvalid"
                    > Save </el-button>
                </div>
                <span class="page-title"> My Profile </span>
            	<el-col :span="24">
            		<el-card>
                        <el-row>
                        <el-col :span="16" :offset="4">
                            <el-row>
                                <label>Name</label>
                                    <el-input :class="{ 'has-error': $v.localUser.name.$error }"
                                              placeholder="Enter your name"
                                              v-model="localUser.name"
                                              @input="$v.localUser.name.$touch()"
                                    ></el-input>
                                    <div class="errors" v-if="$v.localUser.name.$error">
                                        <span class="error-message" v-if="!$v.localUser.name.required">Field is required</span>
                                    </div>
                            </el-row>
                            <el-row>
                                <label>Email</label>
                                    <el-input :class="{ 'has-error': $v.localUser.email.$error }"
                                              placeholder="Enter your email"
                                              v-model="localUser.email"
                                              @input="$v.localUser.email.$touch()"
                                              @blur="validateEmail"
                                              disabled
                                    ></el-input>
                                    <div class="errors" v-if="$v.localUser.email.$error">
                                        <span class="error-message" v-if="!$v.localUser.email.required">Field is required</span>
                                        <span class="error-message" v-if="!$v.localUser.email.isEmail">Invalid email</span>
                                        <span class="error-message" v-if="!$v.localUser.email.isUniqueEmail">Email is used by another user</span>
                                    </div>
                            </el-row>
                            <el-row>
                                <label>Billable rate</label><br>
                                    <el-input-number v-model="localUser.billable_rate" :min="0"></el-input-number>
                                <el-radio-group v-model="localUser.billable_currency">
                                    <el-radio-button label="$" title="Dollar USA"></el-radio-button>
                                    <el-radio-button label="€" title="Euro"></el-radio-button>
                                    <el-radio-button label="₴" title="Hryvna"></el-radio-button>
                                    <el-radio-button label="£" title="Funt sterling"></el-radio-button>
                                </el-radio-group>
                            </el-row>
                            <el-row>
                                <label class="control-label">Cost rate</label><br>
                                <el-input-number v-model="localUser.cost_rate" :min="0"></el-input-number>
                                <el-radio-group v-model="localUser.cost_currency">
                                    <el-radio-button label="$" title="Dollar USA"></el-radio-button>
                                    <el-radio-button label="€" title="Euro"></el-radio-button>
                                    <el-radio-button label="₴" title="Hryvna"></el-radio-button>
                                    <el-radio-button label="£" title="Funt sterling"></el-radio-button>
                                </el-radio-group>
                            </el-row>
                            <el-row>
                                <label>Current password</label><br>
                                <el-input
                                        type="password"
                                        v-model="localUser.currentPassword"
                                        @input="$v.localUser.currentPassword.$touch()"
                                        :class="{ 'has-error' : $v.localUser.currentPassword.$error || errors.currentPassword }"
                                        placeholder="Enter old password"
                                ></el-input>
                                <div class="errors" v-if="$v.localUser.currentPassword.$error">
                                    <span class="error-message" v-if="!$v.localUser.currentPassword.required">Field is required</span>
                                </div>
                                <div class="errors" v-if="errors.currentPassword">
                                    <span class="error-message" v-for="message in errors.currentPassword">{{ message }}</span>
                                </div>
                            </el-row>
                            <el-row>
                                <label>New password</label><br>
                                <el-input
                                        type="password"
                                        v-model="localUser.newPassword"
                                        @input="$v.localUser.passwords.$touch(), $v.localUser.newPassword.$touch()"
                                        @blur="checkForSame"
                                        :class="{'has-error' : $v.localUser.passwords.$error || $v.localUser.newPassword.$error}"
                                        placeholder="Enter new password"
                                ></el-input>
                                <div class="errors" v-if="$v.localUser.passwords.$error || $v.localUser.newPassword.$error">
                                    <span class="error-message" v-if="!$v.localUser.passwords.areSame">Passwords are not the same</span>
                                    <span class="error-message" v-if="!$v.localUser.newPassword.required">Field is required</span>
                                </div>
                            </el-row>
                            <el-row>
                                <label>Confirm password</label><br>
                                <el-input
                                        type="password"
                                        v-model="localUser.confirmPassword"
                                        @input="$v.localUser.passwords.$touch(), $v.localUser.confirmPassword.$touch()"
                                        @blur="checkForSame"
                                        :class="{'has-error' : $v.localUser.passwords.$error || $v.localUser.confirmPassword.$error}"
                                        placeholder="Confirm password"
                                ></el-input>
                                <div class="errors" v-if="$v.localUser.passwords.$error || $v.localUser.confirmPassword.$error">
                                    <span class="error-message" v-if="!$v.localUser.passwords.areSame">Passwords are not the same</span>
                                    <span class="error-message" v-if="!$v.localUser.confirmPassword.required">Field is required</span>
                                </div>
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
    import notification from './../../mixins/notification';

    export default {
        mixins: [notification],
        data() {
            return {
                localUser: {
                    name         : '',
                    email        : '',
                    billable_rate: '',
                    cost_rate    : '',
                    newPassword  : '',

                    currentPassword  : '',
                    confirmPassword  : '',
                    billable_currency: '',
                    cost_currency    : '',
                },
                isUniqueEmail: true,
                isEmail      : true,
                samePasswords: true,
                errors       : [],
            };
        },
        created() {
            this.$store.dispatch('getUser')
                .then(() => {
                    Object.assign(this.localUser, this.user);
                });
        },
        computed: {
            formInvalid() {
                return this.$v.$invalid;
            },
            ...mapGetters([
                'user',
            ]),
        },
        methods: {
            updateUser() {
                if (this.$v.$invalid) return;
                this.$store.dispatch('updateUser', { user: this.localUser })
                    .then(() => {
                        this.showSuccess('Profile saved successful');
                        this.$router.go(-1);
                    })
                    .catch((error) => {
                        this.showError();
                        this.errors = error.response.data.errors;
                    });
            },
            validateEmail() {
                if (this.localUser.email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i)){
                    this.isEmail = true;
                } else {
                    this.isEmail = false;
                }
                if (this.localUser.email !== this.user.email) {
                    this.$store.dispatch('validateEmail', { email: this.localUser.email })
                        .then((response) => {
                            if (response.data !== '') {
                                this.isUniqueEmail = false;
                            } else {
                                this.isUniqueEmail = true;
                            }
                        });
                } else {
                    this.isUniqueEmail = true;
                }
            },
            checkForSame() {
                if (this.localUser.confirmPassword === '' || this.localUser.newPassword === '') {
                    this.samePasswords = true;
                    return;
                }
                if (this.localUser.newPassword !== this.localUser.confirmPassword) {
                    console.log('here');
                    this.samePasswords = false;
                    return;
                }
                this.samePasswords = true;
            },
        },
        components: {
            NavMenuAuth,
        },
        validations() {
            if (this.localUser.newPassword !== '' || this.localUser.confirmPassword !== '') {
                return {
                    localUser: {
                        name: {
                            required,
                        },
                        email: {
                            required,
                            isEmail() {
                                return this.isEmail;
                            },
                            isUniqueEmail() {
                                return this.isUniqueEmail;
                            },
                        },
                        currentPassword: {
                            required,
                        },
                        newPassword: {
                            required,
                        },
                        confirmPassword: {
                            required,
                        },
                        passwords: {
                            areSame() {
                                return this.samePasswords;
                            },
                        },
                    },
                };
            }
            return {
                localUser: {
                    name: {
                        required,
                    },
                    email: {
                        required,
                        isEmail() {
                            return this.isEmail;
                        },
                        isUniqueEmail() {
                            return this.isUniqueEmail;
                        },
                    },
                    currentPassword: {},
                    newPassword    : {},
                    confirmPassword: {},
                    passwords      : {
                        areSame() {
                            return true;
                        },
                    },
                },
            };
        },
    };
</script>
<style lang="scss" rel="stylesheet/css" scoped>

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