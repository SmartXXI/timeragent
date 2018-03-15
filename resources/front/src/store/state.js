import moment from 'moment';

export default {
    timerStarted : false,
    tasksExists  : true,
    timerID      : 0,
    spendTime    : null,
    total        : null,
    activeTask   : null,
    oldActiveTask: null,
    date         : moment().format('YYYY-MM-DD'),
    user         : {},

    personalTasks    : [],
    organizationTasks: [],
    personalProjects : [],
    personalTeams    : [],
    organizationTeams: [],

    team         : {},
    project      : {},
    ownTeams     : [],
    ownUsers     : [],
    existsMembers: [],
    organization : {},
    profileStatus: '',

    clients: [],
    client : {
        contact: {},
    },

    organizationProjects: [],
    organizationMembers : [],
};
