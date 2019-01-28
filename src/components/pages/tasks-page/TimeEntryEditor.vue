<template>
  <div class="TimeEntryEditor">
    <div class="timer-timeentry-editor">
      <el-form>
        <el-row>
          <el-col
            :span="24"
            class="time-pickers"
          >
            <el-col :span="9">
              <el-col :span="15">
                <el-time-picker
                  v-model="localTimeEntry.startTime"
                  :class="{'has-error': $v.localTimeEntry.startTime.$error }"
                  :default-value="defaultTime"
                  placeholder="Start time"
                  value-format="HH:mm:ss"
                  format="HH:mm"
                  @input="$v.localTimeEntry.startTime.$touch()"
                  @blur="clearStartTime"
                />
                <!-- errors block -->
                <span v-if="$v.localTimeEntry.startTime.$error">
                  <span
                    v-if="!$v.localTimeEntry.startTime.required"
                    class="error-message"
                  >
                    Field is required
                  </span>
                  <span
                    v-if="!$v.localTimeEntry.startTime.validTime"
                    class="error-message"
                  >
                    Invalid time
                  </span>
                </span>
              </el-col>

              <el-col :span="8">
                <span class="spend-time">
                  {{ spendTime }}
                </span>
              </el-col>
            </el-col>
            <el-col
              v-if="(timeEntry) ? activeTimeEntry !== timeEntry.uuid : true"
              :span="6"
            >
              <el-time-picker
                v-model="localTimeEntry.endTime"
                :class="{ 'has-error': $v.localTimeEntry.endTime.$error }"
                :disabled="(timeEntry) ? activeTimeEntry === timeEntry.uuid : false"
                placeholder="End time"
                value-format="HH:mm:ss"
                format="HH:mm"
                @input="$v.localTimeEntry.endTime.$touch()"
                @blur="clearEndTime"
              />
              <!-- errors block -->
              <span v-if="$v.localTimeEntry.endTime.$error">
                <span
                  v-if="!$v.localTimeEntry.endTime.required"
                  class="error-message"
                >
                  Field is required
                </span>
                <span
                  v-if="!$v.localTimeEntry.endTime.validTime"
                  class="error-message"
                >
                  Invalid time
                </span>
              </span>
            </el-col>
          </el-col>
        </el-row>
        <el-dialog
          :visible.sync="confirmDeleting"
          title="Delete time entry"
          width="30%"
        >
          <span>
            It will not be undone. Continue?
          </span>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="confirmDeleting = false">
              No
            </el-button>
            <el-button
              type="primary"
              @click="deleteTimeEntry"
            >
              Yes
            </el-button>
          </span>
        </el-dialog>
        <el-row class="actions">
          <el-col class="action-buttons">
            <el-button
              v-if="editingTimeEntry"
              :disabled="formInvalid"
              type="success"
              size="middle"
              title="Save editing"
              @click.prevent="updateTimeEntry"
            >
              Save
            </el-button>
            <el-button
              v-if="addingTimeEntry"
              :disabled="formInvalid"
              type="success"
              size="middle"
              title="Add time entry"
              @click.prevent="createTimeEntry"
            >
              Save
            </el-button>
            <el-button
              type="plain"
              size="middle"
              @click.prevent="closeEditor"
            >
              Cancel
            </el-button>
            <el-button
              v-if="editingTimeEntry"
              type="text"
              class="delete_button"
              @click.prevent="confirmDeleting = true"
            >
              Delete Time Entry
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';

import TimeEntry from '../../../models/TimeEntry';

export default {
  props: {
    addingTimeEntry: {
      type: Boolean,
      default: () => {},
    },
    editingTimeEntry: {
      type: Boolean,
      default: () => {},
    },
    timeEntry: {
      type: Object,
      default: () => {},
    },
    taskUuid: {
      type: String,
      default: () => {},
    },
  },
  data() {
    return {
      localTimeEntry: new TimeEntry(),
      oldTimeEntry: {},
      projects: {},
      confirmDeleting: false,
    };
  },
  computed: {
    ...mapGetters([
      'date',
      'activeTimeEntry',
    ]),
    spendTime() {
      if (this.localTimeEntry.startTime !== '' && this.localTimeEntry.endTime !== '') {
        const spendTime = moment.duration(moment(this.localTimeEntry.endTime, 'HH:mm:ss')
          .diff(moment(this.localTimeEntry.startTime, 'HH:mm:ss')));
        if (spendTime.seconds() >= 0) {
          return `${spendTime.hours()}  h  ${spendTime.minutes()}  min `;
        }
      }
      return ' ';
    },
    formInvalid() {
      return this.$v.$invalid;
    },
    defaultTime() {
      return moment().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss');
    },
  },
  created() {
    if (this.editingTimeEntry) {
      Object.assign(this.localTimeEntry, this.timeEntry);
      Object.assign(this.localTimeEntry, this.timeEntry);
      this.localTimeEntry.startTime = moment(this.timeEntry.startTime, 'YYYY-MM-DD HH:mm:ss')
        .format('HH:mm:ss');
      if (this.timeEntry.endTime) {
        this.localTimeEntry.endTime = moment(this.timeEntry.endTime, 'YYYY-MM-DD HH:mm:ss')
          .format('HH:mm:ss');
      }
    }
  },
  methods: {
    clearStartTime(comp) {
      if (comp.userInput === '') this.localTimeEntry.startTime = '';
    },
    clearEndTime(comp) {
      if (comp.userInput === '') this.localTimeEntry.endTime = '';
    },
    closeEditor() {
      this.localTimeEntry = Object.assign({}, this.oldTimeEntry);
      this.$emit('close-editor');
    },
    updateTimeEntry() {
      const timeEntry = Object.assign(this.reformatTime(this.localTimeEntry));
      this.$emit('update-time-entry', timeEntry);
    },
    createTimeEntry() {
      if (this.$v.$invalid) return;
      const timeEntry = Object.assign(this.reformatTime(this.localTimeEntry));
      this.$emit('create-time-entry', timeEntry);
    },
    deleteTimeEntry() {
      this.$emit('delete-time-entry', this.localTimeEntry);
      this.closeEditor();
    },
    reformatTime(object) {
      const timeEntry = Object.assign(object);
      timeEntry.startTime = `${this.date} ${moment(this.localTimeEntry.startTime, 'HH:mm:ss').format('HH:mm:ss')}`;
      if (timeEntry.endTime) {
        timeEntry.endTime = `${this.date} ${moment(this.localTimeEntry.endTime, 'HH:mm:ss').format('HH:mm:ss')}`;
      }
      timeEntry.taskUuid = this.taskUuid;
      return timeEntry;
    },
  },
  validations() {
    const timeEntryUuid = (this.timeEntry) ? this.timeEntry.uuid : 0;
    if (this.$store.getters.activeTimeEntry === timeEntryUuid) {
      return {
        localTimeEntry: {
          startTime: {
            required,
            validTime(value) {
              return moment(value, 'HH:mm:ss').isBefore(moment()) && value !== '';
            },
          },
          endTime: {},
        },
      };
    }
    return {
      localTimeEntry: {
        startTime: {
          required,
          validTime(value) {
            let valid = false;
            const today = moment().format('YYYY-MM-DD');
            if (moment(this.date, 'YYYY-MM-DD').isBefore(moment(today, 'YYYY-MM-DD'))) {
              valid = true;
            } else {
              valid = moment(value, 'HH:mm:ss').isBefore(moment());
            }
            return valid && value !== '';
          },
        },
        endTime: {
          required,
          validTime(value) {
            let isAfter = true;
            let valid = false;
            const today = moment().format('YYYY-MM-DD');
            if (this.localTimeEntry.startTime !== '') {
              isAfter = moment(this.localTimeEntry.endTime, 'HH:mm:ss')
                .isAfter(moment(this.localTimeEntry.startTime, 'HH:mm:ss'));
            }
            if (moment(this.date, 'YYYY-MM-DD').isBefore(moment(today, 'YYYY-MM-DD'))) {
              valid = true;
            } else {
              valid = moment(value, 'HH:mm:ss').isBefore(moment());
            }
            return valid && value !== '' && isAfter;
          },
        },
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"
       rel="stylesheet/css"
       scoped
>

  .el-icon-edit-outline {
    font-size : 20px;
    margin    : 10px;
  }

  .el-select {
    width : 100%;
  }

  .actions {
    margin-top : 20px;
  }

  .delete_button {
    color : #FA5555;
  }

  .form-control {
    width              : 100%;
    height             : 34px;
    padding            : 6px 0;
    background-color   : transparent;
    background-image   : none;
    border             : none;
    border-bottom      : 1px solid #e0e0e0;
    border-radius      : 0;
    -webkit-box-shadow : none;
    transition         : border-color ease-in-out .2s;
  }

  .form-control:focus {
    border-bottom : 2px solid #178fe5;
    outline       : 0;
    padding       : 6px 0 5px;
  }

  .actions {
    display     : flex;
    align-items : center;
    text-align  : left;
  }

  .margin-top-20 {
    margin-top : 20px !important;
  }

  .btn-primary {
    color            : #fff;
    background-color : #545454;
    border-color     : #545454;
  }

  .btn-primary:hover {
    color            : #fff;
    background-color : #474747;
    border-color     : #474747;
  }

  .btn-default {
    color            : #525252;
    background-color : rgba(0, 0, 0, .05);
    border-color     : rgba(0, 0, 0, .07);
  }

  .btn-icon-default {
    display          : inline-block;
    width            : 34px;
    height           : 34px;
    line-height      : 34px;
    border-radius    : 17px !important;
    padding          : 0 !important;
    color            : #525252;
    background-color : transparent;
    border-color     : transparent;
    font-size        : 20px !important;
  }

  .flex-container {
    display         : flex;
    justify-content : flex-start;
  }

  .full-width {
    width : 100%;
  }

  .flex-container-space-between {
    display         : flex;
    justify-content : space-between;
  }

  .actions > :not(:last-child) {
    margin-right : 12px;
  }

</style>

<style>
  .spend-time {
    color         : #b4bccc;
    display       : inline-block;
    margin-top    : 10px;
    margin-bottom : 10px;

  }
</style>
