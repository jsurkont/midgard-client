import React from 'react';

import * as DeviceActions from '../actions/DeviceActions';
import * as MessageActions from '../actions/MessageActions';
import DeviceStore from '../stores/DeviceStore';
import MessageStore from '../stores/MessageStore';

import Alert from './Alert';
import DeviceDetails from './DeviceDetails';
import JobStore from '../stores/JobStore';


class DeviceCard extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.handleClick(this.props.device);
  }

  render() {
    return (
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h4 class="p-0">{this.props.device.name}</h4>
          <div>
            <button type="button" class="btn btn-secondary" aria-label="Details"
              onClick={this.handleClick}>
              <i class="fa fa-chevron-right fa-lg" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div class="card-block">
          <p class="card-text">{this.props.device.description}</p>
        </div>
      </div>
    );
  }
}


export default class Devices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      selectedDevice: null,
      msg: {type: null, content: null},
    };

    this.getDevices = this.getDevices.bind(this);
    this.getMsg = this.getMsg.bind(this);
    this.detectDevices = this.detectDevices.bind(this);
    this.handleDeviceSelect = this.handleDeviceSelect.bind(this);
    this.showAllDevices = this.showAllDevices.bind(this);
  }

  componentWillMount() {
    DeviceStore.on("change", this.getDevices);
    MessageStore.on("change", this.getMsg);
  }

  componentDidMount() {
    DeviceActions.loadDevices();
  }

  componentWillUnmount() {
    DeviceStore.removeListener("change", this.getDevices);
    MessageStore.removeListener("change", this.getMsg);
    MessageActions.clean();
  }

  getDevices() {
    this.setState({
      devices: DeviceStore.getAll(),
    });
  }

  getMsg() {
    this.setState({ msg: MessageStore.get() });
  }

  detectDevices() {
    DeviceActions.reloadDevices();
  }

  handleDeviceSelect(device) {
    this.setState({ selectedDevice: device });
  }

  showAllDevices() {
    this.setState({ selectedDevice: null });
  }

  render() {
    let content = null;
    if (this.state.selectedDevice === null) {
      content =
        <div>
          { this.state.msg.content &&
            <Alert content={this.state.msg.content} type={this.state.msg.type} />
          }
          <div class="row mb-3">
            <div class="col">
            { this.state.devices.map(device => <DeviceCard key={device._id}
              device={device} handleClick={this.handleDeviceSelect} />) }
            </div>
          </div>
          <div class="row">
            <div class="col">
              <p>
                <button type="button" class="btn btn-secondary"
                  onClick={this.detectDevices}>
                  <i class="fa fa-refresh" aria-hidden="true"></i> &nbsp;
                  Detect devices
                </button>
              </p>
            </div>
          </div>
        </div>
    } else {
      content =
        <div>
          <p>
            <button type="button" class="btn btn-secondary"
              onClick={this.showAllDevices}>
              <i class="fa fa-chevron-left" aria-hidden="true"></i> &nbsp;
              Show all devices
            </button>
          </p>
          <DeviceDetails device={this.state.selectedDevice} />
        </div>
    }
    return content;
  }
}
