<template>
  <div>
    <el-main>
      <el-row>
        <el-col
          :span="16"
          :offset="4">
          <div class="pull-right">
            <el-button
              :disabled="saving"
              plain
              @click.prevent="$router.go(-1)"
            >Cancel</el-button>
            <el-button
              v-if="isCreating"
              :disabled="saving"
              type="success"
              title="Click to create"
              @click.prevent="inviteMembers"
            >
              <i
                v-if="saving"
                class="el-icon-loading"/>
              Save
            </el-button>
          </div>
          <span
            v-if="isCreating"
            class="page-title"> Invite members </span>
          <span
            v-if="isEditing"
            class="page-title"> Edit Member </span>
          <el-col :span="24">
            <el-card>
              <el-row>
                <el-col
                  :span="16"
                  :offset="4">
                  <el-row
                    type="flex"
                    justify="space-around">
                    <el-col :span="24">
                      <el-autocomplete
                        v-model="queryString"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        placeholder="Search members"
                        value-key="name"
                        class="members-search-input"
                        @select="addMember"
                      >
                        <template slot-scope="{ item }">
                          <span>{{ item.name }}  </span>
                          <span
                            class="green-text"
                          >({{
                            item.email.substr(0, queryString.length)
                          }}</span><span
                            class="gray-text"
                          >{{
                            item.email.slice(queryString.length, item.email.length)
                          }})</span>
                        </template>
                      </el-autocomplete>
                    </el-col>
                  </el-row>
                  <el-row
                    type="flex"
                    justify="space-around"
                    class="transfer">
                    <el-table
                      :data="localMembers"
                      :default-sort="{ prop: 'name' }"
                      stripe
                      empty-text="No members"
                    >
                      <el-table-column
                        prop="name"
                        label="Name"
                        sortable
                      />
                      <el-table-column
                        label="Status"
                        sortable>
                        <template slot-scope="scope">
                          <span
                            v-if="scope.row
                            .statusInOrganization === 1"
                          >
                            <i class="el-icon-success gray-text"/> Owner
                          </span>
                          <span v-else>Member</span>
                        </template>
                      </el-table-column>
                      <el-table-column width="80">
                        <template slot-scope="scope">
                          <el-button
                            :disabled="
                              scope.row
                                .statusInOrganization === 1
                            "
                            type="danger"
                            plain
                            size="mini"
                            icon="el-icon-delete"
                            @click="
                              removeMember(scope.row.uuid)
                            "
                          />
                        </template>
                      </el-table-column>
                    </el-table>
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
import { mapGetters, mapActions } from 'vuex';
import notification from '../../mixins/notification';

export default {
  mixins: [notification],
  data() {
    return {
      isCreating: false,
      isEditing: false,

      emails: [],
      localMember: {},
      queryString: '',
      queryUsers: [],
      querySent: false,

      localMembers: [],
      saving: false,
    };
  },
  computed: {
    ...mapGetters([
      //                'member',
      'organizationMembers',
      'allUsers',
    ]),
  },
  watch: {
    queryString(value) {
      if (value.length < 3) {
        this.querySent = false;
      }
    },
  },
  created() {
    if (this.$route.name === 'inviteMembers') {
      this.isCreating = true;
      this.localMembers = this.deepClone(this.organizationMembers);
    }
  },
  methods: {
    ...mapActions([
      'searchAllUsers',
    ]),
    inviteMembers() {
      this.saving = true; // start spiner
      this.$store.dispatch('inviteToOrganization', {
        orgUuid: this.$route.params.organizationUuid,
        members: this.localMembers,
      })
        .then(() => {
          this.showSuccess('Users invited successfully');
          this.$router.go(-1);
        })
        .catch(() => {
          this.showError();
          this.saving = false; // stop spiner
        });
    },
    querySearch(queryString, cb) {
      if (queryString.length > 2 && !this.querySent) {
        this.searchAllUsers({ queryString })
          .then(() => {
            this.queryUsers = this.allUsers;
            this.querySent = true;
          });
      }
      const members = Object.assign(this.queryUsers);
      const results = queryString ? members.filter(this.createFilter(queryString)) : [];
      // call callback function to return suggestions
      cb(results);
    },
    createFilter(queryString) {
      return member => (member.email.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    },
    addMember(user) {
      this.queryString = '';
      if (this.localMembers.find(member => member.uuid === user.uuid)) {
        return;
      }
      this.localMembers.push(user);
    },
    removeMember(userUuid) {
      this.localMembers = this.localMembers
        .filter(member => member.uuid !== userUuid);
    },
    deepClone(obj) {
      return JSON.parse(JSON.stringify(obj));
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

    .members-emails {
        width: 100%;
    }
</style>

<style>
  .members-search-input {
    width : 100%;
  }
</style>
