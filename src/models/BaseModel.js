import * as uuidLib from 'uuid';

class BaseModel {
    uuid = null;

    constructor() {
      this.generateUuid();
    }

    getData() {
      const data = [];
      this.fillable.forEach((field) => {
        data.push(this[field]);
      });
      return data;
    }


    generateUuid() {
      this.uuid = uuidLib.v4();
    }
}

export default BaseModel;
