import React from 'react';

import Devices from './Devices';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Midgard',
    };
  }

  render() {
    return (
      <div class="container">
        <header class="row align-items-end">
          <div class="col-md">
            <h1 class="title">Midgard</h1>
          </div>
          <div class="col-md">
            <small>Signed in as: nobody</small>
          </div>
        </header>
        <Devices />
      </div>
    );
  }
}
