<template>
  <div class="TeamRateDialog">
    <el-dialog
      :visible.sync="showDialog"
      title="Users rate in project"
      width="45%"
    >
      <el-table :data="localTeam.users">
        <el-table-column
          :width="300"
          label="Name"
          prop="name"
        />
        <el-table-column
          :width="300"
          label="Rate"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.costRate"
              :step="1"
              :min="0"
            />
          </template>
        </el-table-column>
        <el-table-column :width="190">
          <template slot-scope="scope">
            <el-button
              type="plain"
              title="Reset"
              size="mini"
              @click="resetUserRate(scope.$index)"
            >
              <span class="fa fa-undo"/>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button
          type="plain"
          @click="resetTeamRate"
        >
          Reset All
        </el-button>
        <el-button
          type="success"
          @click="addTeam(localTeam)"
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
    team: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showDialog: true,
      localTeam: {},
      oldTeam: {},
    };
  },
  created() {
    this.localTeam = this.cloneDeep(this.team);
    this.oldTeam = this.cloneDeep(this.team);
  },
  methods: {
    addTeam() {
      this.localTeam.users.map((user) => {
        Object.assign(user, {
          options: {
            costRate: user.costRate,
          },
        });
        return user;
      });
      this.$emit('add-team', this.localTeam);
    },
    resetUserRate(index) {
      Object.assign(this.localTeam.users[index], {
        costRate: this.oldTeam.users[index].costRate,
      });
    },
    resetTeamRate() {
      this.localTeam = this.cloneDeep(this.oldTeam);
    },
    cloneDeep(object) {
      return JSON.parse(JSON.stringify(object));
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
