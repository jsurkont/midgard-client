import { EventEmitter } from "events";

import Constants from '../Constants';
import Dispatcher from '../Dispatcher';


class JobStore extends EventEmitter {
  constructor() {
    super();
    this.jobs = [];
    this.msg = {type: null, content: null};
  }

  getAll() {
    return this.jobs;
  }

  getMsg() {
    return this.msg;
  }

  handleActions(action) {
    switch(action.type) {
      case Constants.RECEIVE_JOBS:
        this.jobs = action.jobs;
        this.emit("change");
        break;
      case Constants.ADD_JOB:
        this.jobs.push(action.job);
        this.emit("change");
        break;
      case Constants.UPDATE_JOB_MSG:
        this.msg.type = action.data.type;
        this.msg.content = action.data.content;
        this.emit("change");
        break;
      case Constants.CLEAN_JOB_MSG:
        this.msg.type = null;
        this.msg.content = null;
        break;
    }
  }

}

const jobStore = new JobStore;
Dispatcher.register(jobStore.handleActions.bind(jobStore));

export default jobStore;
