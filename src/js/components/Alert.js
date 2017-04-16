import React from 'react';


export default class Alert extends React.Component {
  render () {
    let box;
    switch(this.props.type) {
      case 'danger':
        box = <div class="alert alert-danger" role="alert">{this.props.content}</div>;
        break;
      case 'info':
        box = <div class="alert alert-info" role="alert">{this.props.content}</div>;
        break;
      case 'success':
        box = <div class="alert alert-success" role="alert">{this.props.content}</div>;
        break;
      case 'warning':
        box = <div class="alert alert-warning" role="alert">{this.props.content}</div>;
        break;
      default:
        box = <div class="alert" role="alert">{this.props.content}</div>;
    }
    return box;
  }
}
