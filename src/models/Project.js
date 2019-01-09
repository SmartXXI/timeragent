import BaseModel from './BaseModel';

class Project extends BaseModel {
    name = '';
    ownerType = '';
    ownerUuid = '';
    teams = [];
    users = [];
}

export default Project;
