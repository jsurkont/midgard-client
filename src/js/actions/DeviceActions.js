import axios from 'axios';

import Constants from '../Constants';
import Dispatcher from '../Dispatcher';


const url = `http://${window.location.hostname}:8000/api/devices`;

export function loadDevices() {
  axios.get(url)
    .then(res => Dispatcher.dispatch(
      { type: Constants.RECEIVE_DEVICES, devices: res.data })
    )
    .catch(error => console.log(error));
}

export function reloadDevices() {
  axios.put(url)
    .then(res => Dispatcher.dispatch({ type: Constants.FETCH_DEVICES }))
    .catch(error => console.log(error));
  // wait a few seconds for devices in the newtwork to respond and then update
  // devices from the server
  setTimeout(() => { loadDevices() }, 3000);
}
