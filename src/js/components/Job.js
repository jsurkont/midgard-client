import React from 'react';

export default class JobForm extends React.Component {
  constructor(props) {
    super(props);
    this.weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }

  handleDelete() {
    this.props.handleDelete(this.props.jobId);
  }

  render() {
    const cron = this.props.cron.split(' ');
    const minute = ('00' + cron[1]).slice(-2);
    const hour = ('00' + cron[0]).slice(-2);
    const days = [];
    if (cron[4] === '*') {
      days.push(1, 2, 3, 4, 5, 6, 7);
    } else {
      for (const range of cron[4].split(',')) {
        const end = parseInt(range[range.length - 1]);
        for (let i=parseInt(range[0]); i <= end; i++) days.push(i ? i : 7);
        days.sort();
      }
    }
    return (
        <div class="card mb-3">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="p-0">{this.props.action}</h6>
            <div>
              <button type="button" class="btn btn-danger btn-sm"
                aria-label="Delete" onClick={this.handleDelete.bind(this)}>
                <i class="fa fa-trash-o fa-lg" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div class="card-block p-3">
            <p class="card-text">
              <span class="mr-2">{minute}:{hour}</span>
              {days.map(day =>
              <span key={day.toString()} class="badge badge-default ml-1">
                {this.weekdays[day]}</span>)}
            </p>
          </div>
        </div>
    );
  }

}
