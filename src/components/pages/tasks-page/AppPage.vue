<template>
  <div class="AppPage">
    <div id="app-page">
      <div class="page-title">
        <div class="tracker-datepicker">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-arrow-left"
            @click="subDay"
          />
          <el-date-picker
            v-model="pickerDate"
            :picker-options="pickerOptions"
            type="date"
            placeholder="Pick a day"
            value-format="yyyy-MM-dd"
            @change="getTasksByDate"
          />
          <el-button
            :disabled="date === today"
            type="primary"
            size="small"
            icon="el-icon-arrow-right"
            @click="addDay"
          />
          <a class="btn-calendar">
            {{
              (date === today)
                ? 'Today'
                : (date === yesterday )
                  ? 'Yesterday'
                  : formatedDate
            }}
          </a>
          <div
            class="text-right"
            title="Now"
          >
            {{ spendTime }}
          </div>
        </div>
      </div>
      <el-col
        :span="24"
        style="position: relative;"
      >
        <el-card>
          <div class="panel-heading flex-container-space-between">
            <div class="panel-title">
              <span class="ng-binding">Total </span>
              <span class="bold margin-right-15 ng-binding">
                {{ totalTime }}
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      isOpened: null,
      today: moment().format('YYYY-MM-DD'),
      yesterday: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      pickerDate: moment().format('YYYY-MM-DD'),

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: 'Today',
          onClick(picker) {
            picker.$emit('pick', new Date());
          },
        }, {
          text: 'Yesterday',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - (3600 * 1000 * 24));
            picker.$emit('pick', date);
          },
        }],
      },
    };
  },
  computed: {
    ...mapGetters([
      'user',
    ]),
    spendTime() {
      const { spendTime } = this.$store.state;
      if (spendTime !== null) {
        return spendTime.format('HH:mm:ss');
      }
      return null;
    },
    activeTask() {
      return this.$store.state.activeTask;
    },
    tasks() {
      return this.$store.getters.tasks;
    },
    totalTime() {
      if (this.tasks.length > 0) {
        const total = moment.duration(0);
        this.tasks.map((task) => {
          const spendTime = task.timeEntries.reduce((prev, cur) => {
                            const time = (cur.spendTime) ? cur.spendTime : ''; //eslint-disable-line
            let { endTime } = cur;
            if (!endTime) endTime = moment().format('YYYY-MM-DD HH:mm:ss');
            return moment.duration(moment(endTime, 'YYYY-MM-DD HH:mm:ss')
              .diff(moment(cur.startTime, 'YYYY-MM-DD HH:mm:ss'))).add(prev);
          }, null);
          total.add(moment.duration(spendTime));
          return task;
        });
        const hours = total.hours();
        const minutes = total.minutes();
                    return (hours > 0 ? hours + ' h ' : '') + minutes + ' min '; //eslint-disable-line
      }

      return '0 min';
    },
    date() {
      return this.$store.state.date;
    },
    formatedDate() {
      return moment(this.date, 'YYYY-MM-DD').format('ddd, D MMMM');
    },
  },
  methods: {
    addDay() {
      const date = moment(this.date, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
      this.pickerDate = date;
      this.getTasks(date);
    },
    subDay() {
      const date = moment(this.date, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD');
      this.pickerDate = date;
      this.getTasks(date);
    },
    showSubMenu(name) {
      this.isOpened = (this.isOpened === null) ? name : null;
    },
    getTasksByDate(date) {
      this.getTasks(date);
    },
    getTasks(date) {
      const orgUuid = this.$route.params.organizationUuid;
      const userUuid = this.user.uuid;
      this.$store.dispatch('getTasks', { date, orgUuid, userUuid });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/css" scoped>

    .page-title {
        padding: 0;
        font-size: 28px;
        line-height: 33px;
        display: block;
        margin: 0 0 25px;
        height: 40px;
        word-break: break-all;
    }

    .panel-title {
        font-weight: 300;
        font-size: 22px;
    }

    .text-right {
        display: inline-block;
        float: right;
        margin-right: 15px;
    }

    .btn-calendar {
        color: inherit;
        text-decoration: none;
    }

    .btn-calendar:hover {
        text-decoration: none;
    }

</style>

<style>
    .el-date-editor {
        width: 135px;
    }

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: 140px;
    }
</style>
