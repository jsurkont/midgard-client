import { EventEmitter } from "events";

import Constants from '../Constants';
import Dispatcher from '../Dispatcher';


class MessageStore extends EventEmitter {
  constructor() {
    super();
    this.type = null;
    this.content = null;
  }

  get() {
    return { type: this.type, content: this.content };
  }

  handleActions(action) {
    switch(action.type) {
      case Constants.UPDATE_MSG:
        this.type = action.data.type;
        this.content = action.data.content;
        this.emit("change");
        break;
      case Constants.CLEAN_MSG:
        this.type = null;
        this.content = null;
        this.emit("change");
        break;
    }
  }
}

const messageStore = new MessageStore;
Dispatcher.register(messageStore.handleActions.bind(messageStore));

export default messageStore;
