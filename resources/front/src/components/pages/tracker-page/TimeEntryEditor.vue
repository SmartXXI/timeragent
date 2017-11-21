<template>
    <div>
    <div class="timer-timeentry-editor">
        <el-form>
            <el-row>
                <el-col :span="16">
                    <div class="flex-container">
                        <el-col :span="22">
                            <el-form-item>
                                <el-input placeholder="Enter description"
                                          v-model="localTask.description"
                                          prefix-icon="el-icon-edit-outline"
                                          autofocus></el-input>
                            </el-form-item>
                        </el-col>
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-select v-model="localTask.project_id" :disabled="projects.length > 0 ? false : true">
                        <el-option value="" label="No project"></el-option>
                        <el-option v-for="(project, index) in projects" :label="project.name" :value="project.id" :key="project.id"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="time-pickers" :span="18">
                    <div class="flex-container-space-between">
                        <div class="time-editor-input-group flex-container">
                            <el-time-picker
                                    :class="{'has-error': $v.localTask.startTime.$error }"
                                    placeholder="Stop time"
                                    v-model="localTask.startTime"
                                    @input="$v.localTask.startTime.$touch()"
                                    value-format="HH:mm"
                                    format="HH:mm"
                                    @blur="clearStartTime"
                            ></el-time-picker>
                             <!-- errors block -->
                            <i class="fa fa-exclamation-circle error-icon" v-if="$v.localTask.startTime.$error">
                                <div class="errors">
                                    <span class="error-message" v-if="!$v.localTask.startTime.required">Field is required</span>
                                    <span class="error-message" v-if="!$v.localTask.startTime.validTime">Invalid time</span>
                                </div>
                            </i>
                            
                        </div>
                        <div class="time-editor-input-group flex-container">
                            <el-time-picker
                                    :class="{ 'has-error': $v.localTask.endTime.$error }"
                                    placeholder="End time"
                                    v-model="localTask.endTime"
                                    @input="$v.localTask.endTime.$touch()"
                                    value-format="HH:mm"
                                    format="HH:mm"
                                    @blur="clearEndTime"
                            ></el-time-picker>
                            <!-- errors block -->
                            <i class="fa fa-exclamation-circle error-icon" v-if="$v.localTask.endTime.$error">
                                <div class="errors">
                                    <span class="error-message" v-if="!$v.localTask.endTime.required">Field is required</span>
                                    <span class="error-message" v-if="!$v.localTask.endTime.validTime">Invalid time</span>
                                </div>
                            </i>
                        </div>
                        <div class="time-editor-input-group flex-container">
                            <el-input
                                    :class="{ 'has-error': $v.localTask.spendTime.$error }"
                                    placeholder="Spend time (1 h 0 min)"
                                    @input="$v.localTask.spendTime.$touch()"
                                    v-model="spendTime"
                            ></el-input>
                            <!-- errors block -->
                            <i class="fa fa-exclamation-circle error-icon" v-if="$v.localTask.spendTime.$error">
                                <div class="errors">
                                    <span class="error-message" v-if="!$v.localTask.spendTime.required">Field is required</span>
                                </div>
                            </i>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row class="actions">
                <el-col class="action-buttons">
                    <el-button type="success" size="middle" v-if="editTask" @click.prevent="updateTask" title="Save editing" :disabled="formInvalid"> Save </el-button>
                    <el-button type="success" size="middle" v-if="addingTimeEntry" @click.prevent="addTimeEntry" title="Add time entry" :disabled="formInvalid"> Save </el-button>
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
        props: ['task', 'addingTimeEntry', 'editTask'],
        data() {
            return {
                localTask: {
                    description: '',
                    checked    : false,
                    active     : false,
                    project_id : '',
                    startTime  : '',
                    spendTime  : this.spendTime,
                    endTime    : '',
                },
                oldTask : {},
                projects: {},
            };
        },
        watch: {
            'localTask.startTime'(val, oldVal) {
                if (val.length === 1 && val > 2 && oldVal.substr(-1) !== ':') {
                    this.localTask.startTime = `${this.localTask.startTime}:`;
                } else if (val.length === 2 && val.substr(-1) !== ':' && oldVal.substr(-1) !== ':') {
                    this.localTask.startTime = `${this.localTask.startTime}:`;
                }
            },
            'localTask.endTime'(val, oldVal) {
                if (val.length === 2 && oldVal.substr(-1) !== ':') {
                    this.localTask.endTime = `${this.localTask.endTime}:`;
                }
            },
        },
        computed: {
            spendTime() {
                if (this.localTask.startTime !== '' && this.localTask.endTime !== '') {
                    const spendTime = moment.duration(moment(this.localTask.endTime, 'HH:mm')
                        .diff(moment(this.localTask.startTime, 'HH:mm')));
                    this.localTask.spendTime = `${spendTime.hours()}  h  ${spendTime.minutes()}  min `;
                    return this.localTask.spendTime;
                }
                this.localTask.spendTime = '';
                return this.localTask.spendTime;
            },
            formInvalid() {
                return this.$v.$invalid;
            },
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
        methods: {
            clearStartTime(comp) {
                if (comp.userInput === '') this.localTask.startTime = '';
            },
            clearEndTime(comp) {
                if (comp.userInput === '') this.localTask.endTime = '';
            },
            closeEditor() {
                this.localTask = Object.assign({}, this.oldTask);
                this.$emit('close-editor');
            },
            updateTask() {
                this.$emit('update-task', this.localTask);
            },
            addTimeEntry() {
                if (this.$v.$invalid) return;
                this.$emit('add-time-entry', this.localTask);
            },
        },
        validations: {
            localTask: {
                startTime: {
                    required,
                    validTime(value) {
                        return moment(value, 'HH:mm:ss').isBefore(moment()) && value !== '';
                    },
                },
                endTime: {
                    required,
                    validTime(value) {
                        let isAfter = true;
                        if (this.localTask.startTime !== '') {
                            isAfter = moment(value, 'HH:mm:ss').isAfter(moment(this.localTask.startTime, 'HH:mm:ss'));
                        }
                        return moment(value, 'HH:mm:ss').isBefore(moment()) && value !== '' && isAfter;
                    },
                },
                spendTime: {
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
