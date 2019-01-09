<template>
  <div>
    <el-container direction="vertical">
      <nav-menu/>
      <el-main v-loading="loading">
        <el-row>
          <el-col
            :span="16"
            :offset="4">
            <span class="page-title"> Login </span>
            <el-col :span="24">
              <el-card>
                <el-row>
                  <el-col
                    :span="16"
                    :offset="4">
                    <el-form>
                      <el-row>
                        <label>Email</label>
                        <el-input
                          :class="{
                            'has-error': $v.user.email.$error
                          }"
                          v-model="user.email"
                          placeholder="Enter your email"
                          @input="$v.user.email.$touch()"
                          @blur="validateEmail"
                        />
                        <div
                          v-if="$v.user.email.$error"
                          class="errors">
                          <span
                            v-if="!$v.user.email.required"
                            class="error-message"
                          >Field is required</span>
                          <span
                            v-if="!$v.user.email.isEmail"
                            class="error-message"
                          >Invalid email</span>
                        </div>
                      </el-row>
                      <el-row>
                        <label>Password</label>
                        <br>
                        <el-input
                          v-model="user.password"
                          :class="{
                            'has-error' : $v.user.password.$error
                          }"
                          type="password"
                          placeholder="Enter password"
                          @input="$v.user.password.$touch()"
                        />
                        <div
                          v-if="$v.user.password.$error"
                          class="errors">
                          <span
                            v-if="!$v.user.password.required"
                            class="error-message"
                          >Field is required</span>
                        </div>
                      </el-row>
                      <div class="action-buttons">
                        <el-button
                          :disabled="formInvalid"
                          type="success"
                          @click="loginUser"
                        > Login
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
import { mapActions } from 'vuex';
import NavMenuAuth from '../blocks/NavMenuAuth';
import NavMenu from '../blocks/NavMenu';
import notification from './../../mixins/notification';
import loading from './../../mixins/loading';
import User from './../../models/User';

export default {
  components: {
    NavMenuAuth, NavMenu,
  },
  mixins: [notification, loading],
  data() {
    return {
      user: new User(),
      isEmail: true,
    };
  },
  computed: {
    formInvalid() {
      return this.$v.$invalid;
    },
  },
  methods: {
    ...mapActions([
      'login',
    ]),
    loginUser() {
      if (this.formInvalid) return;
      this.startLoading();
      this.login({ user: this.user })
        .then((data) => {
          console.log(data);
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('expiresIn', data.expiresIn);
          window.location.reload();
        });
      this.stopLoading();
    },
    validateEmail() {
      if (this.user.email.match(/^[0-9a-z-.]+@[0-9a-z-]{2,}\.[a-z]{2,}$/i)
        || this.user.email === '') {
        this.isEmail = true;
      } else {
        this.isEmail = false;
      }
    },
  },
  validations() {
    return {
      user: {
        email: {
          required,
          isEmail() {
            return this.isEmail;
          },
        },
        password: {
          required,
        },
      },
    };
  },
};
</script>

<style lang="scss"
       rel="stylesheet/css"
       scoped
>

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
