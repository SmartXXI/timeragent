import moment from 'moment';

export default {
    timerStarted: false,
    tasksExists : true,
    timerID     : 0,
    spendTime   : null,
    total       : null,
    activeTask  : null,
    date        : moment().format('YYYY-MM-DD'),
    user        : {},
    tasks       : [],
    projects    : [
        {
            id  : 1,
            name: 'Test 1',
        },
        {
            id  : 2,
            name: 'Test 2',
        },
        {
            id  : 3,
            name: 'Test 3',
        },
    ],
};
