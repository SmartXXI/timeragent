<template>
    <div>
        <div class="timer-timeentry-editor">
            <el-form
                    @keyup.enter.native="(editTask) ? updateTask() : addTask()"
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
                        <el-col :span="20">
                            <el-time-picker
                                    placeholder="Estimate"
                                    v-model="localTask.eta"
                                    format="HH:mm"
                                    value-format="HH:mm:ss"
                                    :default-value="defaultEstimate"
                            >
                            </el-time-picker>
                        </el-col>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="localTask.project_id" :disabled="projects.length > 0 ? false : true">
                            <el-option value="" label="No project"></el-option>
                            <el-option v-for="(project, index) in projects" :label="project.name" :value="project.id" :key="project.id"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row class="actions">
                    <el-col class="action-buttons">
                        <el-button type="success"
                                   size="middle"
                                   v-if="editTask"
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

    export default {
        props: ['task', 'addingTask', 'editTask'],
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
            }

            Http.get('api/projects').then((response) => {
                this.projects = response.data;
            });
        },
        computed: {
            defaultEstimate() {
                return moment(1, 'hour').format('YYYY-MM-DD HH:mm:ss');
            },
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
        },
        validations: {
            localTask: {
                description: {
                    required,
                },
            },
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

    .form-control {
        width: 100%;
        height: 34px;
        padding: 6px 0;
        background-color: transparent;
        background-image: none;
        border: none;
        border-bottom: 1px solid #e0e0e0;
        border-radius: 0;
        -webkit-box-shadow: none;
        transition: border-color ease-in-out .2s;
    }

    .form-control:focus {
        border-bottom: 2px solid #178fe5;
        outline: 0;
        padding: 6px 0 5px;
    }

    .actions {
        display: flex;
        align-items: center;
        text-align: left;
    }

    .margin-top-20 {
        margin-top: 20px !important;
    }

    .btn-primary {
        color: #fff;
        background-color: #545454;
        border-color: #545454;
    }

    .btn-primary:hover {
        color: #fff;
        background-color: #474747;
        border-color: #474747;
    }

    .btn-default {
        color: #525252;
        background-color: rgba(0, 0, 0, .05);
        border-color: rgba(0, 0, 0, .07);
    }

    .btn-icon-default {
        display: inline-block;
        width: 34px;
        height: 34px;
        line-height: 34px;
        border-radius: 17px !important;
        padding: 0 !important;
        color: #525252;
        background-color: transparent;
        border-color: transparent;
        font-size: 20px !important;
    }

    .flex-container {
        display: flex;
        justify-content: flex-start;
    }

    .full-width {
        width: 100%;
    }

    .flex-container-space-between {
        display: flex;
        justify-content: space-between;
    }

    .actions > :not(:last-child) {
        margin-right: 12px;
    }

    .timer-timeentry-editor {
        padding: 20px 0 20px 0;
    }

</style>
