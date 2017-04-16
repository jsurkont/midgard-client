import axios from 'axios';

import Constants from '../Constants';
import Dispatcher from '../Dispatcher';


export function clean() {
  Dispatcher.dispatch({ type: Constants.CLEAN_MSG });
}

export function update(content, type) {
  Dispatcher.dispatch({ type: Constants.UPDATE_MSG, data: { content, type } });
}
