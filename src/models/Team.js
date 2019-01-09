import BaseModel from './BaseModel';

class Team extends BaseModel {
    name = '';
    ownerType = '';
    ownerUuid = '';
    users = [];
}

export default Team;
