<template>
  <div class="VerifyUserPage">
    <el-container direction="vertical">
      <NavMenu/>
      <el-main>
        <el-row>
          <el-col
            v-loading="loading"
            :span="16"
            :offset="4">
            <span class="page-title">
              Verifying Account
            </span>
            <el-col :span="24">
              <el-card>
                <el-row>
                  <el-col
                    :span="16"
                    :offset="4">
                    <el-form>
                      <el-row>
                        <label>
                          Email
                        </label>
                        <el-input
                          v-model="email"
                          :class="{
                            'has-error': $v.email.$error
                          }"
                          placeholder="Enter your email"
                          @input="$v.email.$touch()"
                          @blur="validateEmail"
                        />
                        <div
                          v-if="$v.email.$error"
                          class="errors"
                        >
                          <span
                            v-if="!$v.email.required"
                            class="error-message"
                          >
                            Field is required
                          </span>
                          <span
                            v-if="!$v.email.isEmail"
                            class="error-message"
                          >
                            Invalid email
                          </span>
                        </div>
                      </el-row>
                      <el-row>
                        <label>
                          Password
                        </label>
                        <br>
                        <el-input
                          v-model="password"
                          :class="{
                            'has-error' : $v.password.$error
                          }"
                          type="password"
                          placeholder="Enter password"
                          @input="$v.password.$touch()"
                        />
                        <div
                          v-if="$v.password.$error"
                          class="errors"
                        >
                          <span
                            v-if="!$v.password.required"
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
                          @click="verifyUser"
                        >
                          Verify
                        </el-button>
                      </div>
                    </el-form>
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

import NavMenu from '../blocks/NavMenu';

export default {
  components: {
    NavMenu,
  },
  props: {
    verificationCode: {
      type: String,
      default: () => {},
    },
  },
  data() {
    return {
      email: '',
      password: '',
      isEmail: true,
      loading: false,
    };
  },
  computed: {
    formInvalid() {
      return this.$v.$invalid;
    },
  },
  methods: {
    verifyUser() {
      if (this.formInvalid) return;
      this.loading = true;
      this.$store.dispatch('verifyUser', {
        verificationCode: this.verificationCode,
        email: this.email,
        password: this.password,
      })
        .then(() => {
          this.$router.push({ name: 'tasks' });
        });
    },
    validateEmail() {
      if (this.email.match(/^[0-9a-z-.]+@[0-9a-z-]{2,}\.[a-z]{2,}$/i)
        || this.email === '') {
        this.isEmail = true;
      } else {
        this.isEmail = false;
      }
    },
  },
  validations() {
    return {
      email: {
        required,
        isEmail() {
          return this.isEmail;
        },
      },
      password: {
        required,
      },
    };
  },
};
</script>
<style lang="scss"
       rel="stylesheet/css"
       scoped>

  .el-row {
    margin-top : 20px;
  }

  .page-title {
    padding     : 0;
    font-size   : 28px;
    line-height : 33px;
    display     : block;
    margin      : 0 0 25px;
    height      : 40px;
    word-break  : break-all;
  }

  body {
    background-color : #efefef;
  }

  .action-buttons {
    margin-top : 20px;
  }
</style>
