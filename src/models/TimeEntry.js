import BaseModel from './BaseModel';

class TimeEntry extends BaseModel {
    active = false;
    taskUuid = '';
    startTime = '';
    endTime = '';
}

export default TimeEntry;
