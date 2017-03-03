import React from 'react';
import axios from 'axios';

import Job from './Job';
import JobForm from './JobForm';

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
          <li key={action.name}><strong>{action.name}:</strong>
          {action.description}</li>)}
      </ul>;
    return (
      <div>
        <h4>Actions</h4>
        <div class="btn-group" style={{marginBottom: 0.6 + 'rem'}}>
          { actionButtons }
        </div>
        <p><button type="button" class="btn btn-info btn-sm"
          onClick={this.handleToogleHelp}>Help</button></p>
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
      success: null,
      error: null,
    };

    this.runAction = this.runAction.bind(this);
    this.addJob = this.addJob.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
  }

  componentDidMount() {
    axios.get(`${this.props.apiUrl}/${this.props.device._id}/jobs`)
      .then(res => this.setState({jobs: res.data}))
      .catch(error => console.log(error));
  }

  runAction(name) {
    axios.post(`${this.props.apiUrl}/${this.props.device._id}`, { action: name })
      .then(res => this.setState(
        { success: `Action '${name}' has been sent.` }))
      .catch(error => this.setState(
        { error: `Error occured while sending action '${name}'.` }));
  }

  addJob(data) {
    axios.post(
        `${this.props.apiUrl}/${this.props.device._id}/jobs`,
        { action: data.action, cron: data.cron },
      )
      .then(res => {
        const jobs = this.state.jobs;
        jobs.push(res.data);
        this.setState(
          { jobs: jobs,
            success: `Job '${data.action} @ ${data.cron}' has been added.`
          }
        );
      })
      .catch(error => this.setState({ error: error }));
  }

  deleteJob(id) {
    axios.delete(
        `${this.props.apiUrl}/${this.props.device._id}/jobs/${id}`
      )
      .then(res => {
        const jobs = [];
        for (let job of this.state.jobs) {
          if (job._id !== id) jobs.push(job);
        }
        this.setState(
          { jobs: jobs,
            success: `Job '${id}' has been deleted.`
          }
        );
      })
      .catch(error => this.setState({ error: error }));
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
            { this.state.error && <div class="alert alert-danger" role="alert">{this.state.error}</div> }
            { this.state.success && <div class="alert alert-success" role="alert">{this.state.success}</div> }
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
