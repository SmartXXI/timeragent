<template>
  <div>
    <div class="timer-timeentry-editor">
      <el-form
        @keyup.enter.native="(editingTask) ? updateTask() : addTask()"
        @keyup.esc.native="closeEditor"
      >
        <el-row>
          <el-col :span="12">
            <div class="flex-container">
              <el-col :span="22">
                <el-input
                  ref="description"
                  :class="{ 'has-error': $v.localTask.description.$error }"
                  v-model="localTask.description"
                  placeholder="Enter description"
                  prefix-icon="el-icon-edit-outline"
                  @input="$v.localTask.description.$touch()"
                />
                <div
                  v-if="$v.localTask.description.$error"
                  class="errors">
                  <span
                    v-if="!$v.localTask.description.required"
                    class="error-message"
                  >Field is required</span>
                </div>
              </el-col>
            </div>
          </el-col>
          <el-col
            v-if="$route.params.segment === 'organization'"
            :span="6">
            <el-select
              v-model="localTask.projectUuid"
              :disabled="projects.length > 0 ? false : true"
              @input="$v.localTask.projectUuid.$touch()"
            >
              <el-option
                value=""
                label="No project"/>
              <el-option
                v-for="(project) in projects"
                :label="project.name"
                :value="project.uuid"
                :key="project.uuid"
              />
            </el-select>
            <div
              v-if="$v.localTask.projectUuid.$error"
              class="errors">
              <span
                v-if="!$v.localTask.projectUuid.required"
                class="error-message"
              >This field is required</span>
            </div>
          </el-col> <!-- project field if organization-->
          <el-col
            v-else
            :span="6">
            <el-select
              v-model="localTask.projectUuid"
              :disabled="projects.length > 0 ? false : true"
            >
              <el-option
                :value="null"
                label="No project"/>
              <el-option
                v-for="(project) in projects"
                :label="project.name"
                :value="project.uuid"
                :key="project.uuid"
              />
            </el-select>
          </el-col> <!-- project field -->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-col :span="20">
              <el-input-number
                v-model="hours"
                :min="0"
                controls-position="right"
                @change="setHours"
              />
              <span class="hours gray-text">h</span>
              <el-input-number
                v-model="minutes"
                :min="0"
                controls-position="right"
                @change="setMinutes"
              />
              <span class="minutes gray-text">m</span>
            </el-col>
          </el-col>
        </el-row>
        <el-row class="actions">
          <el-col class="action-buttons">
            <el-button
              v-if="editingTask"
              :disabled="formInvalid"
              type="success"
              size="middle"
              title="Save editing"
              @click.prevent="updateTask"
            > Save </el-button>
            <el-button
              v-if="addingTask"
              :disabled="formInvalid"
              type="success"
              size="middle"
              title="Add task"
              @click.prevent="addTask"
            > Save </el-button>
            <el-button
              type="plain"
              size="middle"
              @click.prevent="closeEditor"
            >
              Cancel
            </el-button>
            <el-button
              v-if="editingTask"
              type="text"
              class="delete_button"
              @click.prevent="deleteTask"
            >Delete Task</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import Task from '../../../models/Task';

export default {
  props: {
    task: {
      type: Object,
      default: () => {},
    },
    addingTask: {
      type: Boolean,
      default: () => {},
    },
    editingTask: {
      type: Boolean,
      default: () => {},
    },
  },
  data() {
    return {
      localTask: new Task(),
      hours: 0,
      minutes: 0,
      oldTask: {},
    };
  },
  computed: {
    ...mapGetters([
      'projects',
      'user',
    ]),
    formInvalid() {
      return this.$v.$invalid;
    },
  },
  mounted() {
    this.$refs.description.focus();
  },
  created() {
    if (this.task) {
      Object.assign(this.oldTask, this.task);
      Object.assign(this.localTask, this.task);

      if (this.task.eta) {
        this.hours = moment.duration(this.task.eta, 'seconds')
          .hours();
        this.minutes = moment.duration(this.task.eta, 'seconds')
          .minutes();
      }
    }

    if (this.$route.params.segment === 'personal') {
      this.getProjects({
        ownerType: 'user',
        ownerUuid: this.user.uuid,
      });
    }
    if (this.$route.params.segment === 'organization') {
      this.getProjects({
        ownerType: 'organization',
        ownerUuid: this.$route.params.organizationUuid,
        userUuid: this.user.uuid,
      });
    }
  },
  methods: {
    ...mapActions([
      'getProjects',
    ]),
    closeEditor() {
      this.localTask = Object.assign({}, this.oldTask);
      this.$emit('close-editor');
    },
    updateTask() {
      if (this.formInvalid) return;
      this.$emit('update-task', this.localTask);
    },
    addTask() {
      if (this.formInvalid) return;
      this.localTask.createdAt = moment(this.$store.getters.date, 'YYYY-MM-DD')
        .format('YYYY-MM-DD HH:mm:ss');
      this.localTask.userUuid = this.user.uuid;
      this.$emit('add-task', this.localTask);
    },
    deleteTask() {
      this.$emit('delete-task');
    },
    setHours(value) {
      this.setEta(value, this.minutes);
    },
    setMinutes(value) {
      this.setEta(this.hours, value);
    },
    setEta(hours, minutes) {
      const time = `${hours}:${minutes}`;
      this.localTask.eta = moment.duration(time).asSeconds();
    },
  },
  validations() {
    if (this.$route.params.segment === 'organization') {
      return {
        localTask: {
          description: {
            required,
          },
          projectUuid: {
            required,
          },
        },
      };
    }
    return {
      localTask: {
        description: {
          required,
        },
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/css" scoped>
    .el-icon-edit-outline {
        font-size: 20px;
        margin: 10px;
    }

    .el-select {
        width: 100%;
    }

    .actions {
        margin-top: 20px;
    }

    .timer-timeentry-editor {
        padding: 20px 0 20px 0;
    }

    .el-row {
        margin-bottom: 30px;
    }

    .hours, .minutes {
        padding-right: 10px;
        padding-left: 10px;
    }

</style>
