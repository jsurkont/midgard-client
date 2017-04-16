import { EventEmitter } from "events";

import Constants from '../Constants';
import Dispatcher from '../Dispatcher';


class DeviceStore extends EventEmitter {
  constructor() {
    super();
    this.devices = [];
  }

  getAll() {
    return this.devices;
  }

  handleActions(action) {
    switch(action.type) {
      case Constants.FETCH_DEVICES:
        // console.log('Fetching devices...');
        break;
      case Constants.RECEIVE_DEVICES:
        this.devices = action.devices;
        // console.log(this.devices);
        this.emit("change");
        break;
    }
  }

}

const deviceStore = new DeviceStore;
Dispatcher.register(deviceStore.handleActions.bind(deviceStore));

export default deviceStore;
