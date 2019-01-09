import moment from 'moment';

export default {
  timerStarted: false,
  tasksExists: true,
  timerId: 0,
  spendTime: null,
  total: null,
  oldActiveTask: null,
  date: moment().format('YYYY-MM-DD'),
  user: {},
  existsEmail: '',
  tasks: [],

  activeTimeEntry: null,
  personalTeams: [],
  organizationTeams: [],

  projects: [],

  team: {
    users: [],
  },
  teams: [],
  project: {
    teams: [],
    users: [],
  },
  ownTeams: [],
  ownUsers: [],
  allUsers: [],
  organization: {},
  profileStatus: '',

  clients: [],
  client: {
    contact: {},
  },

  organizationMembers: [],

  loading: false,
};
