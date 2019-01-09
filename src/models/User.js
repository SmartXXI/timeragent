import BaseModel from './BaseModel';

class User extends BaseModel {
    firstName = '';
    lastName = '';
    middleName = '';
    email = '';
    password = '';
}

export default User;
