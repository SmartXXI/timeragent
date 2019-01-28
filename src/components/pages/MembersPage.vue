<template>
  <div class="MembersPage">
    <el-main v-loading="loading">
      <el-row>
        <el-col
          :span="16"
          :offset="4">
          <span class="page-title"> Members </span>

          <el-card>
            <div
              slot="header"
              class="clearfix">
              <router-link
                to="members/invite"
                class="el-button el-button--primary is-plain"
              >
                <i class="el-icon-plus"/>
                Manage Members
              </router-link>
            </div>
            <el-table
              :data="organizationMembers"
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
                sortable
              >
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.statusInOrganization === 1"
                  >
                    <i class="el-icon-success gray-text"/>
                    Owner
                  </span>
                  <span v-else>
                    Member
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import notification from '../../mixins/notification';
import loading from '../../mixins/loading';

export default {
  mixins: [notification, loading],
  data() {
    return {
      members: [],
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'organization',
      'organizationMembers',
    ]),
    profile() {
      return localStorage.getItem('profile');
    },
  },
  destroyed() {
    this.$store.dispatch('clearOrganizationMembers');
  },
};
</script>
<style lang="scss" rel="stylesheet/css" scoped>

    a.el-button {
        text-decoration: none;
    }

    a.el-button:hover {
        text-decoration: none;
    }
    a.el-button:focus {
        text-decoration: none;
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
