import React from 'react';

import Alert from './Alert';
import Job from './Job';
import JobForm from './JobForm';
import * as JobActions from '../actions/JobActions';
import * as MessageActions from '../actions/MessageActions';
import JobStore from '../stores/JobStore';
import MessageStore from '../stores/MessageStore';

class ActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.handleClick(this.props.name);
  }

  render() {
    return (
      <button type="button" class="btn btn-secondary" onClick={this.handleClick}>
        {this.props.name.substring(0, 1).toUpperCase() + this.props.name.substring(1)}
      </button>
    );
  }
}

class ActionsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelp: false,
    }
    this.handleToogleHelp = this.handleToogleHelp.bind(this);
  }

  handleToogleHelp() {
    this.setState(prevState => ({ showHelp: !prevState.showHelp }));
  }

  render() {
    const actionButtons = this.props.actions.map(action =>
      <ActionButton key={action.name} name={action.name}
        handleClick={this.props.handleClick} />);
    const helpMsg =
      <ul class="list-unstyled">
        { this.props.actions.map(action =>
          <li key={action.name}><strong>{action.name}:</strong> &nbsp;
          {action.description}</li>)}
      </ul>;
    return (
      <div>
        <h4>Actions</h4>
        <div class="btn-toolbar my-4" role="toolbar">
          <div class="btn-group mr-2" role="group">
            <button type="button" class="btn btn-info btn-sm px-3"
              onClick={this.handleToogleHelp} aria-label="Help">
              <i class="fa fa-question-circle fa-lg" aria-hidden="true"></i>
            </button>
          </div>
          <div class="btn-group" role="group">
            { actionButtons }
          </div>
        </div>
        { this.state.showHelp && helpMsg }
      </div>
    );
  }
}

export default class DeviceDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      msg: {type: null, content: null},
    };

    this.getJobs = this.getJobs.bind(this);
    this.getMsg = this.getMsg.bind(this);
    this.runAction = this.runAction.bind(this);
    this.addJob = this.addJob.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
  }

  componentWillMount() {
    JobStore.on("change", this.getJobs);
    MessageStore.on("change", this.getMsg);
  }

  componentDidMount() {
    JobActions.loadJobs(this.props.device._id);
  }

  componentWillUnmount() {
    JobStore.removeListener("change", this.getJobs);
    MessageStore.removeListener("change", this.getMsg);
    MessageActions.clean();
  }

  getJobs() {
    this.setState({ jobs: JobStore.getAll() });
  }

  getMsg() {
    this.setState({ msg: MessageStore.get() });
  }

  runAction(job) {
    JobActions.runJob(this.props.device._id, job);
  }

  addJob(data) {
    JobActions.addJob(this.props.device._id, data.action, data.cron);
  }

  deleteJob(job) {
    JobActions.deleteJob(this.props.device._id, job);
  }

  render() {
    let jobsPanel = null;
    if (this.props.device.actions.length > 0) {
      jobsPanel = (
        <div>
          <h4>Jobs</h4>
          <div class="row">
            <div class="col-md">
              <h5>Add new job</h5>
              <JobForm actions={this.props.device.actions.map(action => action.name)} handleSubmit={this.addJob} />
            </div>
            <div class="col-md">
              <h5>Existing jobs</h5>
              {this.state.jobs.map(job => <Job key={job._id} action={job.action}
                cron={job.cron} jobId={job._id} handleDelete={this.deleteJob} />)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div class="row">
          <div class="col">
            <h3>{this.props.device.name}</h3>
            { this.state.msg.content &&
              <Alert content={this.state.msg.content} type={this.state.msg.type} />
            }
            <p>{this.props.device.description}</p>
            <p>Created at: {(new Date(this.props.device.createdAt)).toUTCString()}</p>
            <p>Last message: {this.props.device.lastMsg}</p>
          </div>
        </div>
        { this.props.device.actions.length > 0 && <ActionsPanel
          actions={this.props.device.actions} handleClick={this.runAction}/> }
        { jobsPanel }
      </div>
    );
  }
}
