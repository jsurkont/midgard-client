import { EventEmitter } from "events";

import Constants from '../Constants';
import Dispatcher from '../Dispatcher';


class JobStore extends EventEmitter {
  constructor() {
    super();
    this.jobs = [];
  }

  getAll() {
    return this.jobs;
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
    }
  }
}

const jobStore = new JobStore;
Dispatcher.register(jobStore.handleActions.bind(jobStore));

export default jobStore;
