export default {
    activeTask(state) {
        return state.activeTask;
    },
    date(state) {
        return state.date;
    },
    oldActiveTask(state) {
        return state.oldActiveTask;
    },
    user(state) {
        return state.user;
    },
    personalTasks(state) {
        return state.personalTasks;
    },
    organizationTasks(state) {
        return state.organizationTasks;
    },
    tasks(state) {
        const a = state.organizationTasks;
        const b = state.personalTasks;
        if (localStorage.getItem('profile') === 'organization') {
            return state.organizationTasks;
        }
        if (localStorage.getItem('profile') === 'personal') {
            return state.personalTasks;
        }
        return ['a'];
    },
    teams(state) {
        return state.teams;
    },
    personalProjects(state) {
        return state.personalProjects;
    },
    team(state) {
        return state.team;
    },
    project(state) {
        return state.project;
    },
    ownTeams(state) {
        return state.ownTeams;
    },
    ownUsers(state) {
        return state.ownUsers;
    },
    existsMembers(state) {
        return state.existsMembers;
    },
    organization(state) {
        return state.organization;
    },
    organizationProjects(state) {
        return state.organizationProjects;
    },
    clients(state) {
        return state.clients;
    },
    client(state) {
        return state.client;
    },
};
