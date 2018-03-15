import moment from 'moment';
import Http from '../helpers/Http';
import * as types from './mutation-types';

export default {
    getTasks(context, payload) {
        if (localStorage.getItem('profile') === 'personal' || payload.segment === 'personal') {
            return context.dispatch('getPersonalTasks', {
                date: payload.date,
            });
        }
        if (localStorage.getItem('profile') === 'organization' || payload.segment === 'organization') {
            return context.dispatch('getOrganizationTasks', {
                date : payload.date,
                orgId: localStorage.getItem('organizationId'),
            });
        }
        return 0;
    },
    getPersonalTasks(context, payload) {
        return Http.get(`api/tasks?date=${payload.date}`).then((response) => {
            context.commit(types.SET_PERSONAL_TASKS, { data: response.data, date: payload.date });
            const tasks = response.data;
            if (tasks.length > 0
                && tasks[tasks.length - 1]
                    .time_entries.length > 0
                && tasks[tasks.length - 1]
                    .time_entries[tasks[tasks.length - 1]
                        .time_entries.length - 1]
                    .active === 1) {
                if (context.state.timerID === 0) {
                    context.dispatch('startTimer');
                }
            }
        });
    },
    getOrganizationTasks(context, payload) {
        return Http.get(`api/organization/${payload.orgId}/tasks?date=${payload.date}`)
            .then((response) => {
                context.commit(types.SET_ORGANIZATION_TASKS, {
                    data: response.data,
                    date: payload.date,
                });
                const tasks = response.data;
                if (tasks.length > 0
                    && tasks[tasks.length - 1]
                        .time_entries.length > 0
                    && tasks[tasks.length - 1]
                        .time_entries[tasks[tasks.length - 1]
                        .time_entries.length - 1]
                        .active === 1) {
                    if (context.state.timerID === 0) {
                        context.dispatch('startTimer');
                    }
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
        if (moment().diff(moment(obj.task.startTime, 'YYYY-MM-DD HH:mm:ss'), 'seconds') < 60) {
            context.dispatch('deleteTimeEntry', { timeEntry: obj.task });
            context.commit(types.STOP_TASK, { withDelete: true });
        } else {
            const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
            Http.post(`api/stop-task/${obj.task.id}`, { endTime })
                .then(() => {
                    context.commit(types.STOP_TASK, { withDelete: false });
                    context.dispatch('getTasks', { date: context.state.date });
                });
            // context.commit(types.STOP_TASK);
        }
    },
    startTask(context, payload) {
        const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const task = {
            description: payload.task.description,
            task_id    : payload.task.id,
            eta        : payload.task.eta,
            checked    : false,
            active     : true,
            project_id : payload.task.project_id,
            startTime,
            spendTime  : null,
            endTime    : null,
        };

        let oldActiveTimeEntry = {};
        if (context.getters.oldActiveTask) {
            context.getters.tasks.map((localTask) => { // find active task in all tasks
                oldActiveTimeEntry = localTask.time_entries.find(timeEntry => (
                    timeEntry.id === context.getters.oldActiveTask
                ));
                return localTask;
            });
        } else {
            const tasks = Object.assign(context.getters.tasks);
            if (tasks.length > 0) {
                oldActiveTimeEntry = tasks[tasks.length - 1]
                    .time_entries[tasks[tasks.length - 1]
                        .time_entries.length - 1];
            }
        }

        if (oldActiveTimeEntry && payload.task.id === oldActiveTimeEntry.task_id) {
            if (moment().diff(moment(oldActiveTimeEntry.endTime, 'YYYY-MM-DD HH:mm:ss'), 'seconds') > 60) {
                Http.post('api/create-time-entry', { task })
                    .then(() => context.dispatch('getTasks', { date: context.state.date }));
            } else {
                Http.post(`api/continue-task/${oldActiveTimeEntry.id}`)
                    .then(() => context.dispatch('getTasks', { date: context.state.date }));
            }
        } else if (payload.task.id) {
            Http.post('api/create-time-entry', { task })
                .then(() => context.dispatch('getTasks', { date: context.state.date }));
        }
    },
    createTask(context, payload) {
        Http.post('api/create-task', { task: payload.task })
            .then(() => context.dispatch('getTasks', { date: context.state.date }));
    },
    updateTask(context, obj) {
        Http.post(`api/update-task/${obj.task.id}`, { task: obj.task })
            .then(() => context.dispatch('getTasks', { date: context.state.date }));
    },
    deleteTask(context, payload) {
        Http.post('api/delete-task', { tasks: payload.tasks })
            .then(() => context.dispatch('getTasks', { date: context.state.date }));
    },
    deleteTimeEntry(context, payload) {
        Http.post(`api/delete-time-entry/${payload.timeEntry.id}`)
            .then(() => context.dispatch('getTasks', { date: context.state.date }));
    },
    addTimeEntry(context, task) {
        Http.post('api/create-time-entry', { task })
            .then(() => context.dispatch('getTasks', { date: context.state.date }));
    },
    updateTimeEntry(context, payload) {
        Http.post(`api/update-time-entry/${payload.timeEntry.id}`, { timeEntry: payload.timeEntry })
            .then(() => context.dispatch('getTasks', { date: context.state.date }));
    },
    getUser(context) {
        return Http.get('api/user')
            .then(response => context.commit(types.GET_USER, response.data));
    },
    clearUser(context) {
        context.commit(types.CLEAR_USER);
    },
    validateEmail(context, payload) {
        return Http.post('api/user/validate-email', { email: payload.email });
    },
    updateUser(context, payload) {
        return Http.post('api/user', { user: payload.user });
    },
    getOneTeam(context, payload) {
        return Http.get(`api/teams/${payload.teamId}`)
            .then((response) => {
                context.commit(types.SET_ONE_TEAM, response.data);
            });
    },
    getPersonalTeams(context) {
        return Http.get('api/teams').then((response) => {
            context.commit(types.SET_PERSONAL_TEAMS, response.data);
        });
    },
    getOrganizationTeams(context, payload) {
        return Http.get(`api/organization/${payload.orgId}/teams`)
            .then((response) => {
                context.commit(types.SET_ORGANIZATION_TEAMS, response.data);
            });
    },
    getOrganizationTeam(context, payload) {
        return Http.get(`api/organization/${payload.orgId}/teams/${payload.teamId}`)
            .then((response) => {
                context.commit(types.SET_ONE_TEAM, response.data);
            });
    },
    createPersonalTeam(context, payload) {
        return Http.post('api/teams/new', { team: payload.team, teamUsers: payload.teamUsers }).then((response) => {
            if (payload.emailsToInvite !== []) {
                context.dispatch('inviteMembers', { teamId: response.data.id, emailsToInvite: payload.emailsToInvite });
            }
        });
    },
    inviteMembers(context, payload) {
        Http.post('api/teams/invite', { members: payload.emailsToInvite, team_id: payload.teamId });
    },
    updatePersonalTeam(context, payload) {
        return Http.post(`api/teams/${payload.team.id}`, {
            team     : payload.team,
            teamUsers: payload.teamUsers,
        })
            .then((response) => {
                if (payload.emailsToInvite !== []) {
                    context.dispatch('inviteMembers', { teamId: response.data.id, emailsToInvite: payload.emailsToInvite });
                }
            });
    },
    updateOrganizationTeam(context, payload) {
        return Http.post(`api/organization/${payload.orgId}/teams/${payload.teamId}`, {
            team     : payload.team,
            teamUsers: payload.teamUsers,
        });
    },
    clearTeam(context) {
        context.commit(types.CLEAR_TEAM);
    },
    deleteTeam(context, payload) {
        return Http.post(`api/teams/${payload.teamId}/delete`);
    },
    getOneProject(context, payload) {
        return Http.get(`api/projects/${payload.projectId}`).then((response) => {
            context.commit(types.SET_ONE_PROJECT, response.data);
        });
    },
    getOrganizationProject(context, payload) {
        return Http.get(`api/organization/${payload.orgId}/projects/${payload.projectId}`)
            .then((response) => {
                context.commit(types.SET_ONE_PROJECT, response.data);
            });
    },
    getPersonalProjects(context) {
        return Http.get('api/projects').then((response) => {
            context.commit(types.SET_PERSONAL_PROJECTS, response.data);
        });
    },
    getOrganizationProjects(context, payload) {
        return Http.get(`api/organization/${payload.id}/projects`)
            .then((response) => {
                context.commit(types.SET_ORGANIZATION_PROJECTS, response.data);
            });
    },
    inviteToOrganization(context, payload) {
        return Http.post(`api/organization/${payload.orgId}/members/invite`, { emails: payload.emails });
    },
    createPersonalProject(context, payload) {
        return Http.post('api/projects/new', {
            project     : payload.project,
            projectTeams: payload.projectTeams,
            projectUsers: payload.projectUsers,
        });
    },
    createOrganizationProject(context, payload) {
        return Http.post(`api/organization/${payload.orgId}/projects/new`, {
            project     : payload.project,
            projectTeams: payload.projectTeams,
            projectUsers: payload.projectUsers,
        });
    },
    updatePersonalProject(context, payload) {
        return Http.post(`api/projects/${payload.projectId}`, {
            project     : payload.project,
            projectTeams: payload.projectTeams,
            projectUsers: payload.projectUsers,
        });
    },
    updateOrganizationProject(context, payload) {
        return Http.post(`api/organization/${payload.orgId}/projects/${payload.projectId}`, {
            project     : payload.project,
            projectTeams: payload.projectTeams,
            projectUsers: payload.projectUsers,
        });
    },
    clearProject(context) {
        context.commit(types.CLEAR_PROJECT);
    },
    clearProjects(context) {
        context.commit(types.CLEAR_PROJECTS);
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
    createOrganization(context, payload) {
        return Http.post('api/organizations/new', { organization: payload.organization });
    },
    updateOrganization(context, payload) {
        return Http.post(`api/organizations/${payload.organization.id}`, {
            organization: payload.organization,
        });
    },
    getOneOrganization(context, payload) {
        return Http.get(`api/organizations/${payload.id}`)
            .then((response) => {
                context.commit(types.SET_ONE_ORGANIZATION, response.data);
            });
    },
    clearOrganization(context) {
        context.commit(types.CLEAR_ORGANIZATION);
    },
    getClients(context, payload) {
        return Http.post('api/clients', { organization_id: payload.organization_id })
            .then((response) => {
                context.commit(types.SET_CLIENTS, response.data);
            });
    },
    createClient(context, payload) {
        return Http.post('api/clients/new', {
            client        : payload.client,
            organizationId: payload.organizationId,
        });
    },
    updateClient(context, payload) {
        return Http.post(`api/clients/${payload.client.id}`, { client: payload.client });
    },
    getOneClient(context, payload) {
        return Http.get(`api/clients/${payload.id}`)
            .then((response) => {
                context.commit(types.SET_ONE_CLIENT, response.data);
            });
    },
    clearClient(context) {
        context.commit(types.CLEAR_CLIENT);
    },
    logout() {
        return Http.post('logout');
    },
    getOrganizationMembers(context, payload) {
        return Http.get(`api/organization/${payload.orgId}/members`)
            .then((response) => {
                context.commit(types.SET_ORGANIZATION_MEMBERS, response.data);
            });
    },
    clearOrganizationMembers(context) {
        context.commit(types.CLEAR_ORGANIZATION_MEMBERS);
    },
};
