<template>
  <div class="OrganizationPage">
    <el-main>
      <el-row>
        <el-col
          :span="16"
          :offset="4"
        >
          <div class="pull-right">
            <el-button
              v-if="userStatus === 1"
              type="primary"
              plain
              title="Click to edit"
              @click.prevent="goToEdit(organization.id)"
            >
              Edit
            </el-button>
          </div>
          <span class="page-title">
            Organization {{ organization.name }}
          </span>
          <el-col :span="24">
            <el-card>
              <el-row>
                <el-col
                  :span="16"
                  :offset="4"
                >
                  <el-row>
                    <label>
                      Name
                    </label>
                    <el-input
                      v-model="organization.name"
                      disabled
                    />
                  </el-row>
                  <el-row>
                    <label>
                      Email
                    </label>
                    <el-input
                      v-model="organization.email"
                      disabled
                    />
                  </el-row>
                  <el-row>
                    <label>
                      Phone
                    </label>
                    <el-input
                      v-model="organization.phone"
                      disabled
                    />
                  </el-row>
                  <el-row>
                    <label>
                      Website
                    </label>
                    <el-input
                      v-model="organization.website"
                      disabled
                    />
                  </el-row>
                  <el-row>
                    <label>
                      Address
                    </label>
                    <el-input
                      v-model="organization.address"
                      :rows="5"
                      type="textarea"
                      disabled
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
import { mapGetters, mapActions } from 'vuex';

import notification from '../../mixins/notification';

export default {
  mixins: [notification],
  data() {
    return {
      userStatus: 0,
    };
  },
  computed: {
    ...mapGetters([
      'organization',
    ]),
  },
  created() {
    this.userStatus = this.organization.owners[0].options.status;
  },
  methods: {
    ...mapActions([
      'getOneOrganization',
    ]),
    goToEdit(orgId) {
      this.$router.push({ name: 'editOrganization', params: { orgId } });
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
