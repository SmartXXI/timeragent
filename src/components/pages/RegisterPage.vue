<template>
  <div class="RegisterPage">
    <el-container direction="vertical">
      <NavMenu/>
      <el-main>
        <el-row>
          <el-col
            :span="16"
            :offset="4">
            <span class="page-title">
              Register
            </span>
            <el-col :span="24">
              <el-card>
                <el-row>
                  <el-col
                    :span="16"
                    :offset="4">
                    <el-row>
                      <label>
                        First Name
                      </label>
                      <el-input
                        v-model="user.firstName"
                        :class="{
                          'has-error': $v.user.firstName.$error
                        }"
                        placeholder="Enter your first name"
                        @input="$v.user.firstName.$touch()"
                      />
                      <div
                        v-if="$v.user.firstName.$error"
                        class="errors"
                      >
                        <span
                          v-if="!$v.user.firstName.required"
                          class="error-message"
                        >
                          Field is required
                        </span>
                      </div>
                    </el-row>
                    <el-row>
                      <label>
                        Last Name
                      </label>
                      <el-input
                        v-model="user.lastName"
                        :class="{
                          'has-error': $v.user.lastName.$error
                        }"
                        placeholder="Enter your last name"
                        @input="$v.user.lastName.$touch()"
                      />
                      <div
                        v-if="$v.user.lastName.$error"
                        class="errors"
                      >
                        <span
                          v-if="!$v.user.lastName.required"
                          class="error-message"
                        >
                          Field is required
                        </span>
                      </div>
                    </el-row>
                    <el-row>
                      <label>
                        Middle Name
                      </label>
                      <el-input
                        v-model="user.middleName"
                        placeholder="Enter your middle name"
                      />
                    </el-row>
                    <el-row>
                      <label>Email</label>
                      <el-input
                        v-model="user.email"
                        :class="{
                          'has-error': $v.user.email.$error
                        }"
                        placeholder="Enter your email"
                        @input="$v.user.email.$touch()"
                        @blur="validateEmail"
                      />
                      <div
                        v-if="$v.user.email.$error"
                        class="errors"
                      >
                        <span
                          v-if="!$v.user.email.required"
                          class="error-message"
                        >
                          Field is required
                        </span>
                        <span
                          v-if="!$v.user.email.isEmail"
                          class="error-message"
                        >
                          Invalid email
                        </span>
                        <span
                          v-if="!$v.user.email.isUniqueEmail"
                          class="error-message"
                        >
                          Email is used by another user
                        </span>
                      </div>
                    </el-row>
                    <el-row>
                      <label>Password</label><br>
                      <el-input
                        v-model="user.password"
                        :class="{
                          'has-error' : $v.passwords.$error ||
                            $v.user.password.$error}"
                        type="password"
                        placeholder="Enter new password"
                        @input="$v.passwords.$touch(),
                                $v.user.password.$touch()"
                        @blur="checkForSame"
                      />
                      <div
                        v-if="$v.passwords.$error ||
                          $v.user.password.$error"
                        class="errors"
                      >
                        <span
                          v-if="!$v.passwords.areSame"
                          class="error-message"
                        >
                          Passwords are not the same
                        </span>
                        <span
                          v-if="!$v.user.password.required"
                          class="error-message"
                        >
                          Field is required
                        </span>
                      </div>
                    </el-row>
                    <el-row>
                      <label>
                        Confirm password
                      </label>
                      <br>
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
                        class="errors"
                      >
                        <span
                          v-if="!$v.passwords.areSame"
                          class="error-message"
                        >
                          Passwords are not the same
                        </span>
                        <span
                          v-if="!$v.confirmPassword.required"
                          class="error-message"
                        >
                          Field is required
                        </span>
                      </div>
                    </el-row>
                    <div class="action-buttons">
                      <el-button
                        :disabled="formInvalid"
                        type="success"
                        @click="registerUser"
                      >
                        Register
                      </el-button>
                    </div>
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
import { mapActions, mapGetters } from 'vuex';

import notification from '../../mixins/notification';

// import NavMenuAuth from '../blocks/NavMenuAuth';
import NavMenu from '../blocks/NavMenu';

import User from '../../models/User';

export default {
  components: {
    // NavMenuAuth,
    NavMenu,
  },
  mixins: [notification],
  data() {
    return {
      user: new User(),

      confirmPassword: '',
      currentPassword: '',

      isUniqueEmail: true,
      isEmail: true,
      samePasswords: true,
      errors: [],
    };
  },
  computed: {
    ...mapGetters([
      'existsEmail',
    ]),
    formInvalid() {
      return this.$v.$invalid;
    },
  },
  methods: {
    ...mapActions([
      'createUser',
    ]),
    registerUser() {
      if (this.formInvalid) return;
      this.createUser({ user: this.user })
        .then(({ createUser }) => {
          this.showSuccess(createUser.message);
          this.$router.push({
            name: 'login',
            params: {
              email: this.user.email,
            },
          });
        })
        .catch((error) => {
          console.log(error);
          this.showError();
          this.errors = error;
        });
    },
    validateEmail() {
      if (this.user.email.match(/^[0-9a-z-.]+@[0-9a-z-]{2,}\.[a-z]{2,}$/i)) {
        this.isEmail = true;
      } else {
        this.isEmail = false;
      }
    },
    checkForSame() {
      if (this.confirmPassword === '' || this.user.password === '') {
        this.samePasswords = true;
        return;
      }
      if (this.user.password !== this.confirmPassword) {
        this.samePasswords = false;
        return;
      }
      this.samePasswords = true;
    },
  },
  validations() {
    return {
      user: {
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
      confirmPassword: {
        required,
      },
      passwords: {
        areSame() {
          return this.samePasswords;
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

    .action-buttons {
        margin-top: 20px;
    }
</style>
