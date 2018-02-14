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
                                    ></el-input>
                                    <div class="errors" v-if="$v.localUser.email.$error">
                                        <span class="error-message" v-if="!$v.localUser.email.required">Field is required</span>
                                        <span class="error-message" v-if="!$v.localUser.email.email">Invalid email</span>
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
                },
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
                    .catch(() => {
                        this.showError();
                    });
            },
        },
        components: {
            NavMenuAuth,
        },
        validations() {
            return {
                localUser: {
                    name: {
                        required,
                    },
                    email: {
                        required,
                        email,
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