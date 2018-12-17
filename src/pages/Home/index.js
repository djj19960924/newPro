import React from 'react';
import './index.less';

class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Home">
        首页!
      </div>
    )
  }
}

export default Home;