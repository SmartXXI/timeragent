import BaseModel from './BaseModel';

class Task extends BaseModel {
    description = '';
    eta = null;
    userUuid = null;
    projectUuid = null;
    createdAt = '';
}

export default Task;
