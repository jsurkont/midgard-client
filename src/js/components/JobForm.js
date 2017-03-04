import React from 'react';

export default class JobForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: props.actions[0],
      hour: '',
      minute: '',
      days: new Array(7).fill(false),
    };
    this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const value = e.target.value;
    switch (e.target.id) {
      case 'inputAction':
        this.setState({ action: value });
        break;
      case 'inputHour':
        this.setState({ hour: (value >= 0 && value < 24) ? value : '' });
        break;
      case 'inputMinute':
        this.setState({ minute: (value >= 0 && value < 60) ? value : '' });
        break;
    }
    if (e.target.type === 'checkbox') {
      const changedDay = parseInt(e.target.name);
      const days = this.state.days;
      days[changedDay] = !days[changedDay];
      this.setState({ days: days });
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const weekdays = [];
    for (let i = 0; i < this.state.days.length; i++) {
      if (this.state.days[i]) weekdays.push(i);
    }
    this.props.handleSubmit(
      { action: this.state.action,
        cron: `${this.state.minute} ${this.state.hour} * * ${weekdays}` }
    );
    this.setState({ days: new Array(7).fill(false), hour: '', minute: '' });
  }

  render() {
    const actions = this.props.actions || []

    let submitButton = <button type="button"
      class="btn btn-success btn-sm disabled" aria-disabled="true">
        <i class="fa fa-ban" aria-hidden="true"> Add job</i>
      </button>;
    if (this.state.days.includes(true) && this.state.hour && this.state.minute) {
      submitButton = <button type="submit" class="btn btn-success btn-sm">
        <i class="fa fa-plus" aria-hidden="true"> Add job</i>
        </button>;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <div class="form-group">
          <label for="inputAction">Action</label>
          <select value={this.state.action} onChange={this.handleChange}
            class="form-control" id="inputAction">
            { actions.map(action =>
              <option value={action} key={action}>{action}</option>)}
          </select>
        </div>
        <div class="form-group row">
          <div class="col-sm">
            <label for="inputHour">Hour</label>
            <input
              type="number"
              min="0"
              max="23"
              value={this.state.hour}
              onChange={this.handleChange}
              class="form-control"
              id="inputHour"
            />
          </div>
          <div class="col-sm">
            <label for="inputMinute">Minute</label>
            <input
              type="number"
              min="0"
              max="59"
              value={this.state.minute}
              onChange={this.handleChange}
              class="form-control"
              id="inputMinute"
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            {[1, 2, 3, 4, 5].map(index =>
              <div key={index.toString()} class="form-check">
                  <label class="form-check-label">
                    <input class="form-check-input mr-2" type="checkbox" name={index}
                      checked={this.state.days[index]} onChange={this.handleChange} />
                    { this.weekdays[index] }
                  </label>
              </div>
            )}
          </div>
          <div class="col">
            {[0, 6].map(index =>
              <div key={index.toString()} class="form-check">
                  <label class="form-check-label">
                    <input class="form-check-input mr-2" type="checkbox" name={index}
                      checked={this.state.days[index]} onChange={this.handleChange} />
                    { this.weekdays[index] }
                  </label>
              </div>
            )}
          </div>
        </div>
        <p>{ submitButton }</p>
      </form>
    );
  }

}
