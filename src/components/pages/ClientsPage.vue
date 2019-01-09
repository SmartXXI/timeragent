<template>
  <div>
    <el-main v-loading="loading">
      <el-row>
        <el-col
          :span="16"
          :offset="4">
          <span class="page-title"> Clients </span>
          <el-card>
            <div
              slot="header"
              class="clearfix">
              <router-link
                :to="generateUrl('clients/new')"
                class="el-button el-button--primary is-plain">
                <i class="el-icon-plus"/> New Client
              </router-link>
            </div>
            <el-table
              :data="clients"
              :default-sort = "{prop: 'name'}"
              stripe>
              <el-table-column
                prop="name"
                label="Name"
                sortable/>
              <el-table-column label="Contact Name">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.contact.name }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label=""
                width="80">
                <template slot-scope="scope">
                  <div v-if="organization.uuid === scope.row.organizationUuid">
                    <el-button
                      type="plain"
                      size="mini"
                      @click="goToClient(scope.row.uuid)"
                    >Edit</el-button>
                  </div>
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
      //                membersTableVisible: false,
      //                members            : [],
    };
  },
  computed: {
    ...mapGetters([
      'organization',
      'clients',
    ]),
  },
  created() {
    this.stopLoading();
  },
  methods: {
    goToClient(clientUuid) {
      this.$router.push({ name: 'editClient', params: { clientUuid } });
    },
    generateUrl(url) {
      return `/${this.$route.params.segment}/${this.$route.params.organizationUuid}/${url}`;
    },
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
