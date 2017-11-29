import moment from 'moment';
import Http from '../helpers/Http';
import * as types from './mutation-types';

export default {
    getTasks(context, obj) {
        Http.get(`api/tasks?date=${obj.date}`).then((response) => {
            context.commit(types.GET_TASKS, { data: response.data, date: obj.date });
            if (response.data.length > 0
                && response.data[response.data.length - 1].active === 1) {
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
        if (moment().diff(moment(obj.task.startTime, 'HH:mm:ss'), 'seconds') < 60) {
            context.dispatch('deleteTask', { task_id: obj.task_id, index: obj.index });
        } else {
            const endTime = moment().format('HH:mm:ss');
            Http.post(`api/stop-task/${obj.task_id}`, { endTime })
                .then(response => context.commit(types.STOP_TASK, {
                    task : response.data,
                    index: obj.index,
                }));
            // context.commit(types.STOP_TASK);
        }
    },
    createTask(context) {
        if (context.state.activeTask !== null) {
            const oldActiveTask = context.state.tasks[context.state.activeTask];

            if (moment().diff(moment(oldActiveTask.endTime, 'HH:mm:ss'), 'seconds') > 60 || oldActiveTask.description !== null) {
                const startTime = moment().format('HH:mm:ss');
                const task = {
                    description: '',
                    checked    : false,
                    active     : true,
                    project_id : null,
                    startTime,
                    spendTime  : null,
                    endTime    : null,
                };
                Http.post('api/create-task', { task })
                    .then(response => context.commit(types.CREATE_TASK, response.data));
            } else {
                context.commit(types.CONTINUE_TASK);
            }
        } else {
            const startTime = moment().format('HH:mm:ss');
            const task = {
                description: '',
                checked    : false,
                active     : true,
                project_id : null,
                startTime,
                spendTime  : null,
                endTime    : null,
            };
            Http.post('api/create-task', { task })
                .then(response => context.commit(types.CREATE_TASK, response.data));
            // context.commit(types.CREATE_TASK);
        }
    },
    updateTask(context, obj) {
        // context.commit(types.UPDATE_TASK, { task: task.task, index: task.index });
        Http.post(`api/update-task/${obj.task.id}`, { task: obj.task })
            .then(response => context.commit(types.UPDATE_TASK, {
                task : response.data,
                index: obj.index,
            }));
    },
    deleteTask(context, task) {
        Http.post(`api/delete-task/${task.task_id}`)
            .then(() => context.commit(types.DELETE_TASK, { index: task.index }));
    },
    addTimeEntry(context, task) {
        Http.post('api/create-task', { task })
            .then(response => context.commit(types.ADD_TIME_ENTRY, response.data));
        // context.commit(types.ADD_TIME_ENTRY, task);
    },
    getUser(context) {
        Http.get('api/user')
            .then(response => context.commit(types.GET_USER, response.data));
    },
    updateUser(context, payload) {
        return Http.post('api/user', { user: payload.user });
    },
    getTeams(context) {
        return Http.get('api/teams').then((response) => {
            context.commit(types.SET_TEAMS, response.data);
        });
    },
    getProjects(context) {
        return Http.get('api/projects').then((response) => {
            context.commit(types.SET_PROJECTS, response.data);
        });
    },
    addTeam(context, payload) {
        return Http.post('api/teams/new', { team: payload.team, members: payload.addedMembers }).then((response) => {
            if (payload.emailToInvite !== '') {
                context.dispatch('inviteMembers', { teamId: response.data.id, emailToInvite: payload.emailToInvite });
            }
        });
    },
    inviteMembers(context, payload) {
        Http.post('api/teams/invite', { members: payload.emailToInvite, team_id: payload.teamId });
    },
    addProject(context, payload) {
        return Http.post('api/projects/new', { project: payload.project, projectTeams: payload.projectTeams, projectUsers: payload.projectUsers });
    },
    getOneTeam(context, payload) {
        Http.get(`api/teams/${payload.teamId}`).then((response) => {
            context.commit(types.SET_ONE_TEAM, response.data);
        });
    },
    updateTeam(context, payload) {
        return Http.post(`api/teams/${payload.team.id}`, { team: payload.team, deletedMembers: payload.deletedMembers, addedMembers: payload.addedMembers }).then((response) => {
            if (payload.emailToInvite !== '') {
                context.dispatch('inviteMembers', { teamId: response.data.id, emailToInvite: payload.emailToInvite });
            }
        });
    },
    deleteTeam(context, payload) {
        return Http.post(`api/teams/${payload.teamId}/delete`);
    },
    getOneProject(context, payload) {
        Http.get(`api/projects/${payload.projectId}`).then((response) => {
            context.commit(types.SET_ONE_PROJECT, response.data);
        });
    },
    updateProject(context, payload) {
        return Http.post(`api/projects/${payload.projectId}`, {
            project     : payload.project,
            // addedTeams  : payload.addedTeams,
            // deletedTeams: payload.deletedTeams,
            projectTeams: payload.projectTeams,
            // addedMembers: payload.addedMembers,
            projectUsers: payload.projectUsers,
        });
    },
    deleteProject(context, payload) {
        return Http.post(`api/projects/${payload.projectId}/delete`);
    },
    getOwnTeams(context) {
        Http.get('api/projects/teams').then((response) => {
            context.commit(types.SET_OWN_TEAMS, response.data);
        });
    },
    getOwnUsers(context) {
        Http.get('api/projects/users').then((response) => {
            context.commit(types.SET_OWN_USERS, response.data);
        });
    },
    getExistsMembers(context) {
        return Http.get('api/teams/exists-members').then((response) => {
            context.commit(types.SET_EXISTS_MEMBERS, response.data);
        });
    },
    logout() {
        return Http.post('logout');
    },
};
