import React from 'react';
import axios from 'axios';

import DeviceDetails from './DeviceDetails';


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
    };

    this.apiUrl = `http://${window.location.hostname}:8000/api/devices`;
    this.detectDevices = this.detectDevices.bind(this);
    this.handleDeviceSelect = this.handleDeviceSelect.bind(this);
    this.showAllDevices = this.showAllDevices.bind(this);
  }

  getDevices() {
    axios.get(this.apiUrl)
      .then(res => this.setState({devices: res.data}))
      .catch(error => console.log(error));
  }

  componentDidMount() {
    this.getDevices();
  }

  detectDevices() {
    axios.put(this.apiUrl)
      .then()
      .catch(error => console.log(error));
    // wait a few seconds and then update devices from the server
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
          <DeviceDetails device={this.state.selectedDevice} apiUrl={this.apiUrl} />
        </div>
    }
    return content;
  }
}
