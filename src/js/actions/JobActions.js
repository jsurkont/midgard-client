import axios from 'axios';

import Constants from '../Constants';
import Dispatcher from '../Dispatcher';


const url = `http://${window.location.hostname}:8000/api/devices`;

export function loadJobs(device) {
  axios.get(`${url}/${device}/jobs`)
    .then(res => {
      Dispatcher.dispatch({ type: Constants.RECEIVE_JOBS, jobs: res.data });
    })
    .catch(error => { Dispatcher.dispatch(
      { type: Constants.UPDATE_JOB_MSG, data: {type: 'danger', content: error} });
    });
}

export function addJob(device, job, cron) {
  axios.post(`${url}/${device}/jobs`, { action: job, cron: cron })
    .then(res => {
      Dispatcher.dispatch({ type: Constants.ADD_JOB, job: res.data });
      Dispatcher.dispatch({ type: Constants.UPDATE_JOB_MSG,
        data: {type: 'success',
        content: `Job '${job} @ ${cron}' has been added.`} });
    })
    .catch(error => { Dispatcher.dispatch(
      { type: Constants.UPDATE_JOB_MSG, data: {type: 'danger', content: error} });
    });
}

export function deleteJob(device, job) {
  axios.delete(`${url}/${device}/jobs/${job}`)
    .then(res => {
      loadJobs(device);
      Dispatcher.dispatch({ type: Constants.UPDATE_JOB_MSG,
        data: {type: 'success', content: `Job '${job}' has been deleted.`} });
    })
    .catch(error => { Dispatcher.dispatch(
      { type: Constants.UPDATE_JOB_MSG, data: {type: 'danger', content: error} });
    });
}

export function runJob(device, job) {
  axios.post(`${url}/${device}`, { action: job })
    .then(res => {
      Dispatcher.dispatch({ type: Constants.UPDATE_JOB_MSG,
        data: {type: 'success',
        content: `Job '${job}' has been sent.`} });
    })
    .catch(error => { Dispatcher.dispatch(
      { type: Constants.UPDATE_JOB_MSG, data: {type: 'danger', content: error} });
    });
}

export function cleanJobMsg() {
  Dispatcher.dispatch({ type: Constants.CLEAN_JOB_MSG });
}
