import axios from 'axios';

import Constants from '../Constants';
import Dispatcher from '../Dispatcher';
import * as MessageActions from './MessageActions';


const url = `http://${window.location.hostname}:8000/api/devices`;

export function loadJobs(device) {
  axios.get(`${url}/${device}/jobs`)
    .then(res => {
      Dispatcher.dispatch({ type: Constants.RECEIVE_JOBS, jobs: res.data });
    })
    .catch(error => MessageActions.update(error, 'danger'));
}

export function addJob(device, job, cron) {
  axios.post(`${url}/${device}/jobs`, { action: job, cron: cron })
    .then(res => {
      Dispatcher.dispatch({ type: Constants.ADD_JOB, job: res.data });
      MessageActions.update(`Job '${job} @ ${cron}' has been added.`, 'success');
    })
    .catch(error => MessageActions.update(error, 'danger'));
}

export function deleteJob(device, job) {
  axios.delete(`${url}/${device}/jobs/${job}`)
    .then(res => {
      loadJobs(device);
      MessageActions.update(`Job '${job}' has been deleted.`, 'success');
    })
    .catch(error => MessageActions.update(error, 'danger'));
}

export function runJob(device, job) {
  axios.post(`${url}/${device}`, { action: job })
    .then(res => {
      MessageActions.update(`Job '${job}' has been sent.`, 'success');
    })
    .catch(error => MessageActions.update(error, 'danger'));
}
