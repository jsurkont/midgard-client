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
      <div class="card">
        <div class="card-block">
          <h4 class="card-title">{this.props.device.name}</h4>
          <p class="card-text">{this.props.device.description}</p>
          <button type="button" class="btn btn-info" onClick={this.handleClick}>Details</button>
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
          <div class="row" style={{marginBottom: '2rem'}}>
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
              Show all devices
            </button>
          </p>
          <DeviceDetails device={this.state.selectedDevice} apiUrl={this.apiUrl} />
        </div>
    }
    return content;
  }
}
