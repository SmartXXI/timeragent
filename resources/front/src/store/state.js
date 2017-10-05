import moment from 'moment';
export default {
    timerStarted: false,
    tasksExists: true,
    timerID: 0,
    spendTime: null,
    total: null,
    activeTask: null,
    date: moment().format('YYYY-MM-DD'),
    tasks: [
        // {
        //     description: 'blabla 1',
        //     checked: false,
        //     active: false,
        //     startTime: null,
        //     spendTime: 0,
        //     endTime: null,
        // },
        // {
        //     description: 'blabla 2',
        //     checked: false,
        //     active: false,
        //     startTime: null,
        //     spendTime: 0,
        //     endTime: null,
        // },
        // {
        //     description: 'blabla 3',
        //     checked: false,
        //     active: true,
        //     startTime: null,
        //     spendTime: 0,
        //     endTime: null,
        // },
    ],
    projects: [
        {
            id: 1,
            name: 'Test 1',
        },
        {
            id: 2,
            name: 'Test 2',
        },
        {
            id: 3,
            name: 'Test 3',
        },
    ],
};
