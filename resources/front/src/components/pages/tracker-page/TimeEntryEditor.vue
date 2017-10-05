<template>
    <div>
    <div class="timer-timeentry-editor">
        <form class="form-horizontal">
            <div class="row">
                <div class="col-xs-8">
                    <div class="flex-container">
                        <button type="button"
                                class="btn btn-icon-default dropdown-toggle flex-item-no-shrink"
                                title="Select recent task">
                            <i class="fa fa-tasks"></i>
                        </button>
                        <div class="full-width">
                            <input class="form-control" type="text" placeholder="Enter description" v-model="localTask.description" autofocus>
                        </div>
                    </div>
                </div>
                <div class="col-xs-4">
                    <select class="form-control" v-model="localTask.project_id" :disabled="projects.length > 0 ? false : true">
                        <option value="">No project</option>
                        <option v-for="(project, index) in projects" :value="project.id">{{ project.name }}</option>
                    </select>
                </div>
                <div></div>
            </div>
            <div class="row margin-top-20">
                <div class="col-xs-8">
                    <div class="flex-container-space-between">
                        <div class="time-editor-input-group flex-container">
                            <button type="button" class="btn btn-icon-default" title="Pick start time">
                                <i class="fa fa-clock-o"></i>
                            </button>
                            <input class="form-control" placeholder="HH:mm" v-model="localTask.startTime">
                        </div>
                        <div class="time-editor-input-group flex-container">
                            <button type="button" class="btn btn-icon-default" title="Pick end time">
                                <i class="fa fa-clock-o"></i>
                            </button>
                            <input class="form-control" placeholder="HH:mm" v-model="localTask.endTime">
                        </div>
                        <div class="time-editor-input-group flex-container">
                            <button type="button" class="btn btn-icon-default" title="Duration is linked to start time and end time values.">
                                <i class="fa fa-clock-o"></i>
                            </button>
                            <input class="form-control" placeholder="0 h 0 min" v-model="spendTime">
                        </div>
                    </div>
                </div>
                <div class="col-xs-4">
                    <select class="form-control"></select>
                </div>
            </div>
            <div class="actions margin-top-20">
                <button v-if="editTask" @click="updateTask" title="Save editing" class="btn btn-primary"> Save </button>
                <button v-if="addingTimeEntry" @click="addTimeEntry" title="Add time entry" class="btn btn-primary"> Save </button>
                <button
                        @click="closeEditor"
                        type="button"
                        class="btn btn-default"
                >
                    Cancel
                </button>
            </div>
        </form>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import {HTTP} from '../../../main.js';

    export default {
        props: ['task', 'addingTimeEntry', 'editTask'],
        data() {
            return {
                localTask: {
                    description: '',
                    checked: false,
                    active: false,
                    project_id: "",
                    startTime: "",
                    spendTime: this.spendTime,
                    endTime: "",
                },
                oldTask: {},
                projects: {},
            };
        },
        computed: {
            spendTime() {
                if (this.localTask.startTime != "" && this.localTask.endTime != "") {
                    let spendTime = moment.duration(moment(this.localTask.endTime, 'HH:mm')
                        .diff(moment(this.localTask.startTime, "HH:mm")));
                    this.localTask.spendTime = spendTime.hours() + " h " + spendTime.minutes() + " min ";
                return  this.localTask.spendTime;
                }
                this.localTask.spendTime = "";
                return this.localTask.spendTime;
            },
        },
        created() {
            if (this.task) {
                this.oldTask = Object.assign({}, this.task);
                this.localTask = Object.assign({}, this.task);
            }

            HTTP.get('api/projects').then(response => this.projects = response.data);

        },
        methods: {
            closeEditor() {
                this.localTask = Object.assign({}, this.oldTask);
                this.$emit('close-editor');
            },
            updateTask() {
                this.$emit('update-task', this.localTask);
            },
            addTimeEntry() {
                this.$emit('add-time-entry', this.localTask);
            },
        },
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/css" scoped>
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
        padding: 20px;
    }

</style>
