import * as types from './mutation-types';
import moment from 'moment'; //eslint-disable-line
import {HTTP} from '../main.js';

export default {
    getTasks(context, obj) {
        // let currentDate = moment().format('YYYY-MM-DD');
        // console.log(currentDate);

        HTTP.get('api/tasks?date=' + obj.date).then((response) => {
            context.commit(types.GET_TASKS, { data: response.data, date: obj.date });
            if (response.data.length > 0 && response.data[response.data.length - 1].active == true) {
                context.dispatch('startTimer');
            }
        });
    },
    startTimer(context) {
        context.commit(types.START_TIMER);
    },
    stopTimer(context) {
        context.commit(types.STOP_TIMER);
    },
    stopTask(context, obj) {
        if (moment().diff(moment(obj.task.startTime, 'HH:mm:ss'), 'seconds') < 60 ) {
            context.dispatch('deleteTask', {task_id: obj.task_id, index: obj.index});
        } else {
            let endTime = moment().format('HH:mm:ss');
            HTTP.post('api/stop-task/' + obj.task_id, { endTime: endTime }).then(response => context.commit(types.STOP_TASK, {task: response.data, index: obj.index}));
        // context.commit(types.STOP_TASK);
        }
    },
    createTask(context) {
        if (context.state.activeTask !== null) {
            let oldActiveTask = context.state.tasks[context.state.activeTask];             //eslint-disable-line
            
            if (moment().diff(moment(oldActiveTask.endTime, 'HH:mm:ss'), 'seconds') > 60 || oldActiveTask.description !== null) {
                let startTime = moment().format('HH:mm:ss');
                let task = {description: '', checked: false, active: true, project_id: null, startTime: startTime, spendTime: null, endTime: null};
                HTTP.post('api/create-task', { task: task}).then(response => context.commit(types.CREATE_TASK, response.data));
                
            } else {
                context.commit(types.CONTINUE_TASK);
            }
        } else {
            let startTime = moment().format('HH:mm:ss');
            let task = {description: '', checked: false, active: true, project_id: null, startTime: startTime, spendTime: null, endTime: null};
            HTTP.post('api/create-task', { task: task}).then(response => context.commit(types.CREATE_TASK, response.data));
            // context.commit(types.CREATE_TASK);
        }
    },
    updateTask(context, obj) {
        // context.commit(types.UPDATE_TASK, { task: task.task, index: task.index });
        HTTP.post('api/update-task/' + obj.task.id, {task: obj.task}).then(response => context.commit(types.UPDATE_TASK, {task: response.data, index: obj.index }));
    },
    deleteTask(context, task) {
        HTTP.post('api/delete-task/' + task.task_id).then(response => context.commit(types.DELETE_TASK, {index: task.index}));
    },
    addTimeEntry(context, task) {
        HTTP.post('api/create-task', { task: task}).then(response => context.commit(types.ADD_TIME_ENTRY, response.data));
        // context.commit(types.ADD_TIME_ENTRY, task);
    },
};
