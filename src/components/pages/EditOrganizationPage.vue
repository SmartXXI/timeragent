<template>
  <div>
    <el-main>
      <el-row>
        <el-col
          :span="16"
          :offset="4">
          <div class="pull-right">
            <el-button
              plain
              @click.prevent="$router.go(-1)"
            >Cancel</el-button>
            <el-button
              v-if="isEditing"
              :disabled="formInvalid"
              type="success"
              title="Click to save"
              @click.prevent="updateOrganization"
            > Save </el-button>
            <el-button
              v-if="isCreating"
              :disabled="formInvalid"
              type="success"
              title="Click to create"
              @click.prevent="createOrganization"
            > Save </el-button>
          </div>
          <span
            v-if="isCreating"
            class="page-title"> New Organization </span>
          <span
            v-if="isEditing"
            class="page-title"> Edit Organization </span>
          <el-col :span="24">
            <el-card>
              <el-row>
                <el-col
                  :span="16"
                  :offset="4">
                  <el-row>
                    <label>Name</label>
                    <el-input
                      :class="{
                        'has-error': $v.localOrganization.name.$error
                      }"
                      v-model="localOrganization.name"
                      placeholder="Enter organization name"
                      @input="$v.localOrganization.name.$touch()"
                    />
                    <div
                      v-if="$v.localOrganization.name.$error"
                      class="errors">
                      <span
                        v-if="!$v.localOrganization.name.required"
                        class="error-message"
                      >Field is required</span>
                    </div>
                  </el-row>
                  <el-row>
                    <label>Email</label>
                    <el-input
                      :class="{
                        'has-error': $v.localOrganization.email.$error
                      }"
                      v-model="localOrganization.email"
                      placeholder="Enter organization email"
                      @input="$v.localOrganization.email.$touch()"
                      @blur="validateEmail"
                    />
                    <div
                      v-if="$v.localOrganization.email.$error"
                      class="errors"
                    >
                      <span
                        v-if="!$v.localOrganization.email.isEmail"
                        class="error-message"
                      >Invalid Email</span>
                      <span
                        v-if="!$v.localOrganization.email.required"
                        class="error-message"
                      >Field is required</span>
                    </div>
                  </el-row>
                  <el-row>
                    <label>Phone</label>
                    <el-input
                      v-model="localOrganization.phone"
                      placeholder="Enter organization phone"
                    />
                  </el-row>
                  <el-row>
                    <label>Website</label>
                    <el-input
                      v-model="localOrganization.website"
                      placeholder="Enter organization website"
                    />
                  </el-row>
                  <el-row>
                    <label>Address</label>
                    <el-input
                      :rows="5"
                      v-model="localOrganization.address"
                      type="textarea"
                      placeholder="Enter organization address"
                    />
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
import notification from '../../mixins/notification';
import Organization from '../../models/Organization';

export default {
  mixins: [notification],
  props: {
    organizationUuid: {
      type: String,
      default: () => {},
    },
  },
  data() {
    return {
      isCreating: false,
      isEditing: false,
      isEmail: true,

      localOrganization: new Organization(),
    };
  },
  computed: {
    formInvalid() {
      return this.$v.$invalid;
    },
    ...mapGetters([
      'organization',
      'user',
    ]),
  },
  created() {
    if (this.$route.name === 'newOrganization') {
      this.isCreating = true;
    }
    if (this.$route.name === 'editOrganization') {
      this.isEditing = true;
      Object.assign(this.localOrganization, this.organization);
    }
  },
  methods: {
    ...mapActions([
      'getOneOrganization',
      'clearOrganization',
    ]),
    createOrganization() {
      if (this.formInvalid) return;
      this.$store.dispatch('createOrganization', {
        organization: this.localOrganization,
        userUuid: this.user.uuid,
      })
        .then(() => {
          this.showSuccess('Organization created successfully');
          this.$router.go(-1);
          this.clearOrganization();
        });
    },
    updateOrganization() {
      if (this.formInvalid) return;
                delete this.localOrganization.__typename; // eslint-disable-line
      delete this.localOrganization.owners;
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
      if (this.localOrganization.email.match(/^[0-9a-z-.]+@[0-9a-z-]{2,}\.[a-z]{2,}$/i)
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
        required,
        isEmail() {
          return this.isEmail;
        },
      },
    },
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
