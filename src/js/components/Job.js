import React from 'react';

export default class JobForm extends React.Component {

  handleDelete() {
    this.props.handleDelete(this.props.jobId);
  }

  render() {
    return (
        <p>
          <span style={{marginRight: 0.6 + 'rem'}}>
            '{this.props.action}' @ {this.props.cron}
          </span>
          <button type="button" class="btn btn-danger btn-sm"
            onClick={this.handleDelete.bind(this)}>Delete</button>
        </p>
    );
  }

}
