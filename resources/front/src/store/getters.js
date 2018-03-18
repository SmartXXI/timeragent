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
    personalTeams(state) {
        return state.personalTeams;
    },
    organizationTeams(state) {
        return state.organizationTeams;
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
    allUsers(state) {
        return state.allUsers;
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
    organizationMembers(state) {
        return state.organizationMembers;
    },
};
