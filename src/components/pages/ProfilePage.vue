<template>
  <div>
    <el-main v-loading="loading">
      <el-row>
        <el-col
          :span="16"
          :offset="4">
          <div class="pull-right">
            <el-button
              type="plain"
              @click="$router.go(-1)"
            > Cancel </el-button>
            <el-button
              :disabled="formInvalid"
              type="success"
              @click="updateUser"
            > Save </el-button>
          </div>
          <span class="page-title"> My Profile </span>
          <el-col :span="24">
            <el-card>
              <el-row>
                <el-col
                  :span="16"
                  :offset="4">
                  <el-row>
                    <label>First Name</label>
                    <el-input
                      :class="{
                        'has-error': $v.localUser.firstName.$error
                      }"
                      v-model="localUser.firstName"
                      placeholder="Enter your name"
                      @input="$v.localUser.firstName.$touch()"
                    />
                    <div
                      v-if="$v.localUser.firstName.$error"
                      class="errors"
                    >
                      <span
                        v-if="!$v.localUser.firstName.required"
                        class="error-message"
                      >Field is required</span>
                    </div>
                  </el-row>
                  <el-row>
                    <label>Last Name</label>
                    <el-input
                      :class="{
                        'has-error': $v.localUser.lastName.$error
                      }"
                      v-model="localUser.lastName"
                      placeholder="Enter your name"
                      @input="$v.localUser.lastName.$touch()"
                    />
                    <div
                      v-if="$v.localUser.lastName.$error"
                      class="errors"
                    >
                      <span
                        v-if="!$v.localUser.lastName.required"
                        class="error-message"
                      >Field is required</span>
                    </div>
                  </el-row>
                  <el-row>
                    <label>Email</label>
                    <el-input
                      :class="{
                        'has-error': $v.localUser.email.$error
                      }"
                      v-model="localUser.email"
                      placeholder="Enter your email"
                      disabled
                      @input="$v.localUser.email.$touch()"
                      @blur="validateEmail"
                    />
                    <div
                      v-if="$v.localUser.email.$error"
                      class="errors">
                      <span
                        v-if="!$v.localUser.email.required"
                        class="error-message"
                      >Field is required</span>
                      <span
                        v-if="!$v.localUser.email.isEmail"
                        class="error-message"
                      >Invalid email</span>
                      <span
                        v-if="!$v.localUser.email.isUniqueEmail"
                        class="error-message"
                      >Email is used by another user</span>
                    </div>
                  </el-row>
                  <!--<el-row>-->
                  <!--<label>Billable rate</label><br>-->
                  <!--<el-input-number-->
                  <!--v-model="localUser.rate"-->
                  <!--:min="0"-->
                  <!--&gt;</el-input-number>-->
                  <!--</el-row>-->
                  <el-row>
                    <label>Current password</label><br>
                    <el-input
                      v-model="currentPassword"
                      :class="{
                        'has-error' : $v.currentPassword.$error
                          || errors.currentPassword
                      }"
                      type="password"
                      placeholder="Enter old password"
                      @input="$v.currentPassword.$touch()"
                    />
                    <div
                      v-if="$v.currentPassword.$error"
                      class="errors">
                      <span
                        v-if="!$v.localUser.currentPassword.required"
                        class="error-message"
                      >Field is required</span>
                    </div>
                    <div
                      v-if="errors.currentPassword"
                      class="errors">
                      <span
                        v-for="message in errors.currentPassword"
                        :key="message"
                        class="error-message"
                      >{{ message }}</span>
                    </div>
                  </el-row>
                  <el-row>
                    <label>New password</label><br>
                    <el-input
                      v-model="localUser.password"
                      :class="{
                        'has-error' : $v.passwords.$error ||
                      $v.localUser.password.$error}"
                      type="password"
                      placeholder="Enter new password"
                      @input="$v.passwords.$touch(),
                              $v.localUser.password.$touch()"
                      @blur="checkForSame"
                    />
                    <div
                      v-if="$v.passwords.$error ||
                      $v.localUser.password.$error"
                      class="errors"
                    >
                      <span
                        v-if="!$v.passwords.areSame"
                        class="error-message"
                      >Passwords are not the same</span>
                      <span
                        v-if="!$v.localUser.password.required"
                        class="error-message"
                      >Field is required</span>
                    </div>
                  </el-row>
                  <el-row>
                    <label>Confirm password</label><br>
                    <el-input
                      v-model="confirmPassword"
                      :class="{
                        'has-error' : $v.passwords.$error ||
                          $v.confirmPassword.$error
                      }"
                      type="password"
                      placeholder="Confirm password"
                      @input="$v.passwords.$touch(),
                              $v.confirmPassword.$touch()"
                      @blur="checkForSame"
                    />
                    <div
                      v-if="$v.passwords.$error ||
                      $v.confirmPassword.$error"
                      class="errors">
                      <span
                        v-if="!$v.passwords.areSame"
                        class="error-message"
                      >Passwords are not the same</span>
                      <span
                        v-if="!$v.confirmPassword.required"
                        class="error-message"
                      >Field is required</span>
                    </div>
                  </el-row>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters, mapActions } from 'vuex';
import notification from './../../mixins/notification';
import loading from '../../mixins/loading';
import User from './../../models/User';

export default {
  mixins: [notification, loading],
  data() {
    return {
      localUser: new User(),

      confirmPassword: '',
      currentPassword: '',

      isUniqueEmail: true,
      isEmail: true,
      samePasswords: true,
      errors: [],
    };
  },
  computed: {
    formInvalid() {
      return this.$v.$invalid;
    },
    ...mapGetters([
      'user',
    ]),
  },
  created() {
    Object.assign(this.localUser, this.user);
  },
  methods: {
    ...mapActions([
      'getMe',
      'clearUser',
      'updateUser',
    ]),
    updateUser() {
      if (this.$v.$invalid) return;
      this.$store.dispatch('updateUser', { user: this.localUser })
        .then(() => {
          this.showSuccess('Profile saved successful');
          this.$router.go(-1);
          this.clearUser(); // clear user for update users data in store
          this.getMe();
        });
    },
    validateEmail() {
      if (this.localUser.email.match(/^[0-9a-z-.]+@[0-9a-z-]{2,}\.[a-z]{2,}$/i)) {
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
      if (this.confirmPassword === '' || this.localUser.password === '') {
        this.samePasswords = true;
        return;
      }
      if (this.localUser.password !== this.confirmPassword) {
        this.samePasswords = false;
        return;
      }
      this.samePasswords = true;
    },
  },
  validations() {
    if (this.localUser.password !== '' || this.confirmPassword !== '') {
      return {
        localUser: {
          firstName: {
            required,
          },
          lastName: {
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
          password: {
            required,
          },
        },
        currentPassword: {
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
      };
    }
    return {
      localUser: {
        firstName: {
          required,
        },
        lastName: {
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
        password: {},
      },
      currentPassword: {},
      confirmPassword: {},
      passwords: {
        areSame() {
          return true;
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
