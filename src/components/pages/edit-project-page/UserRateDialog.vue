<template>
  <div class="UserRateDialog">
    <el-dialog
      :visible.sync="showUserRate"
      title="Change rates"
    >
      <el-table :data="localUsers">
        <el-table-column
          label="Name"
          prop="name"
        />
        <el-table-column label="Rate">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.costRate"
              :step="1"
              :min="0"
            />
          </template>
        </el-table-column>
        <el-table-column :width="100">
          <template slot-scope="scope">
            <el-button
              type="plain"
              title="Reset"
              size="mini"
              @click="resetUserRate(scope.$index)">
              <i class="fa fa-undo"/>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button
          type="success"
          @click="addUser()"
        >
          Apply
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      showUserRate: true,
      localUsers: [],
      oldUsers: [],
    };
  },
  created() {
    this.localUsers = [this.cloneDeep(this.users[0])];
    this.oldUsers = [this.cloneDeep(this.users[0])];
  },
  methods: {
    addUser() {
      this.localUsers.map((user) => {
        Object.assign(user, {
          options: {
            costRate: user.costRate,
          },
        });
        return user;
      });
      this.$emit('add-user', this.localUsers[0]);
    },
    resetUserRate() {
      this.localUsers = [this.cloneDeep(this.oldUsers[0])];
    },
    cloneDeep(object) {
      return JSON.parse(JSON.stringify(object));
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
