<template>
  <div class="EditClientPage">
    <el-main>
      <el-row>
        <el-col
          :span="16"
          :offset="4"
        >
          <div class="pull-right">
            <el-button
              :disabled="saving"
              plain
              @click.prevent="cancel"
            >
              Cancel
            </el-button>
            <el-button
              v-if="isEditing"
              :disabled="formInvalid || saving"
              type="success"
              title="Click to save"
              @click.prevent="updateClient"
            >
              <i
                v-if="saving"
                class="el-icon-loading"
              />
              Save
            </el-button>
            <el-button
              v-if="isCreating"
              :disabled="formInvalid || saving"
              type="success"
              title="Click to create"
              @click.prevent="createClient"
            >
              <i
                v-if="saving"
                class="el-icon-loading"
              />
              Save
            </el-button>
          </div>
          <span
            v-if="isCreating"
            class="page-title"
          >
            New Client
          </span>
          <span
            v-if="isEditing"
            class="page-title"
          >
            Edit Client
          </span>
          <el-col :span="24">
            <el-card>
              <el-row>
                <el-col
                  :span="16"
                  :offset="4"
                >
                  <el-row>
                    <label>Name</label>
                    <el-input
                      v-model="localClient.name"
                      :class="{
                        'has-error': $v.localClient.name.$error
                      }"
                      placeholder="Enter client name"
                      @input="$v.localClient.name.$touch()"
                    />
                    <div
                      v-if="$v.localClient.name.$error"
                      class="errors"
                    >
                      <span
                        v-if="!$v.localClient.name.required"
                        class="error-message"
                      >
                        Field is required
                      </span>
                    </div>
                  </el-row>
                  <el-row>
                    <label>
                      Invoice prefix
                    </label>
                    <el-input
                      v-model="localClient.invoicePrefix"
                      :class="{
                        'has-error': $v.localClient
                          .invoicePrefix.$error
                      }"
                      placeholder="Enter invoice prefix"
                      @input="$v.localClient.invoicePrefix.$touch()"
                    />
                    <div
                      v-if="$v.localClient.invoicePrefix.$error"
                      class="errors"
                    >
                      <span
                        v-if="!$v.localClient.invoicePrefix.maxLength"
                        class="error-message"
                      >
                        Invoice prefix shouldn't
                        have more then 2 letters
                      </span>
                    </div>
                  </el-row>
                  <el-row>
                    <label>
                      Address
                    </label>
                    <el-input
                      v-model="localClient.address"
                      :rows="5"
                      type="textarea"
                      placeholder="Enter client address"
                    />
                  </el-row>
                  <el-row>
                    <label>
                      First name
                    </label>
                    <el-input
                      v-model="contact.firstName"
                      :class="{
                        'has-error': $v.contact.firstName.$error
                      }"
                      placeholder="Enter first name of contact person"
                      @input="$v.contact.firstName.$touch()"
                    />
                    <div
                      v-if="$v.contact.firstName.$error"
                      class="errors">
                      <span
                        v-if="!$v.contact.firstName.required"
                        class="error-message"
                      >
                        This field is required
                      </span>
                    </div>
                  </el-row>
                  <el-row>
                    <label>
                      Last name
                    </label>
                    <el-input
                      v-model="contact.lastName"
                      placeholder="Enter last name of contact person"
                    />
                  </el-row>
                  <el-row>
                    <label>
                      Email
                    </label>
                    <el-input
                      v-model="contact.email"
                      :class="{
                        'has-error': $v.contact.email.$error
                      }"
                      placeholder="Enter email of contact person"
                      @input="$v.contact.email.$touch()"
                      @blur="validateEmail"
                    />
                    <div
                      v-if="$v.contact.email.$error"
                      class="errors"
                    >
                      <span
                        v-if="!$v.contact.email.required"
                        class="error-message"
                      >
                        This field is required
                      </span>
                      <span
                        v-if="!$v.contact.email.isEmail"
                        class="error-message"
                      >
                        Invalid email
                      </span>
                    </div>
                  </el-row>
                  <el-row>
                    <label>
                      Telephone
                    </label>
                    <el-input
                      v-model="contact.telephone"
                      placeholder="Enter telephone of contact person"
                    />
                  </el-row>

                  <div>
                    <el-button
                      v-if="isEditing"
                      type="text"
                      class="delete_button"
                      @click="showConfirmModal = true"
                    >
                      Delete client
                    </el-button>
                  </div>

                  <!-- Confirm delete client modal form -->
                  <el-dialog
                    v-if="isEditing"
                    :visible.sync="showConfirmModal"
                    title="Delete client"
                    width="30%"
                  >
                    <p>
                      It will not be undone. Please
                      enter client name to continue:
                      <br>
                      ({{ client.name }})
                    </p>
                    <el-input
                      v-model="clientName"
                      placeholder="Enter client name"
                    />
                    <span
                      slot="footer"
                      class="dialog-footer"
                    >
                      <el-button
                        @click.prevent="showConfirmModal = false"
                      >
                        Cancel
                      </el-button>
                      <el-button
                        :disabled="!confirmDelete"
                        type="danger"
                        @click.prevent="deleteClient"
                      >
                        Delete
                      </el-button>
                    </span>
                  </el-dialog>
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
import { required, maxLength } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';

import notification from '../../mixins/notification';
import loading from '../../mixins/loading';

import Contact from '../../models/Contact';
import Client from '../../models/Client';

export default {
  mixins: [notification, loading],
  props: {
    clientUuid: {
      type: String,
      default: () => {},
    },
  },
  data() {
    return {
      isCreating: false,
      isEditing: false,
      isEmail: true,
      clientName: '',
      saving: false,

      showConfirmModal: false,

      contact: new Contact(),

      localClient: new Client(),
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
    confirmDelete() {
      return this.client.name === this.clientName;
    },
  },
  created() {
    if (this.$route.name === 'newClient') {
      this.isCreating = true;
    }
    if (this.$route.name === 'editClient') {
      this.isEditing = true;
      this.localClient = this.deepClone(this.client);
      this.contact = this.localClient.contact;
    }
  },
  destroyed() {
    this.$store.dispatch('clearClient');
  },
  methods: {
    createClient() {
      if (this.formInvalid) return;
      this.localClient.organizationUuid = this.organization.uuid;
      this.saving = true;
      this.$store.dispatch('createClient', {
        client: this.localClient,
        contact: this.contact,
      })
        .then(() => {
          this.showSuccess('Client created successfully');
          this.$router.go(-1);
        })
        .catch(() => {
          this.showError();
          this.saving = false;
        });
    },
    updateClient() {
      if (this.formInvalid) return;
      this.saving = true;
      this.$store.dispatch('updateClient', {
        client: this.localClient,
        contact: this.contact,
      })
        .then(() => {
          this.showSuccess('Client saved successfully');
          this.$router.go(-1);
        })
        .catch(() => {
          this.showError();
        });
    },
    deleteClient() {
      this.$store.dispatch('deleteClient', {
        clientUuid: this.client.uuid,
        contactUuid: this.contact.uuid,
      })
        .then(() => {
          this.showSuccess('Client deleted successfully');
          this.$router.go(-1);
        })
        .catch(() => {
          this.showError();
        });
    },
    validateEmail() {
      if (this.contact.email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i)) {
        this.isEmail = true;
      } else {
        this.isEmail = false;
      }
    },
    deepClone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
  },
  validations: {
    localClient: {
      name: {
        required,
      },
      invoicePrefix: {
        maxLength: maxLength(2),
      },
    },
    contact: {
      firstName: {
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
