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
                                <el-input placeholder="Enter description"
                                          ref="description"
                                          :class="{ 'has-error': $v.localTask.description.$error }"
                                          v-model="localTask.description"
                                          prefix-icon="el-icon-edit-outline"
                                          @input="$v.localTask.description.$touch()"
                                >
                                </el-input>
                                <div class="errors"  v-if="$v.localTask.description.$error">
                                    <span class="error-message" v-if="!$v.localTask.description.required">Field is required</span>
                                </div>
                            </el-col>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="localTask.project_id" :disabled="projects.length > 0 ? false : true">
                            <el-option value="" label="No project"></el-option>
                            <el-option v-for="(project, index) in projects" :label="project.name" :value="project.id" :key="project.id"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-col :span="20">
                            <el-input-number
                                    v-model="hours"
                                    :min="0"
                                    @change="setHours"
                                    controls-position="right"
                            ></el-input-number>
                            <span class="hours gray-text">h</span>
                            <el-input-number
                                    v-model="minutes"
                                    :min="0"
                                    @change="setMinutes"
                                    controls-position="right"
                            ></el-input-number>
                            <span class="minutes gray-text">m</span>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row class="actions">
                    <el-col class="action-buttons">
                        <el-button type="success"
                                   size="middle"
                                   v-if="editingTask"
                                   @click.prevent="updateTask"
                                   :disabled="formInvalid"
                                   title="Save editing"
                        > Save </el-button>
                        <el-button type="success"
                                   size="middle"
                                   v-if="addingTask"
                                   @click.prevent="addTask"
                                   :disabled="formInvalid"
                                   title="Add task"
                        > Save </el-button>
                        <el-button
                                type="plain"
                                size="middle"
                                @click.prevent="closeEditor"
                        >
                            Cancel
                        </el-button>
                        <el-button type="text"
                                   v-if="editingTask"
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
    import { required } from 'vuelidate/lib/validators';
    import Http from '../../../helpers/Http';
    import ElInputNumber from "../../../../node_modules/element-ui/packages/input-number/src/input-number.vue";

    export default {
        components: { ElInputNumber },
        props     : ['task', 'addingTask', 'editingTask'],
        data() {
            return {
                localTask: {
                    id         : 0,
                    description: '',
                    eta        : '',
                    checked    : false,
                    project_id : '',
                    created_at : '',
                },
                hours   : 0,
                minutes : 0,
                oldTask : {},
                projects: {},
            };
        },
        mounted() {
            this.$refs.description.focus();
        },
        created() {
            if (this.task) {
                this.oldTask = Object.assign({}, this.task);
                this.localTask = Object.assign({}, this.task);

                if (this.task.eta) {
                    this.hours = moment.duration(this.task.eta)
                        .hours();
                    this.minutes = moment.duration(this.task.eta)
                        .minutes();
                }
            }

            Http.get('api/projects').then((response) => {
                this.projects = response.data;
            });
        },
        computed: {
            formInvalid() {
                return this.$v.$invalid;
            },
        },
        methods: {
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
                this.localTask.created_at = moment(this.$store.getters.date, 'YYYY-MM-DD')
                    .format('YYYY-MM-DD HH:mm:ss');
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
                this.localTask.eta = `${hours}:${minutes}`;
                if (moment.duration(this.localTask.eta).asSeconds() < 60) {
                    this.localTask.eta = '';
                }
            },
        },
        validations() {
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
