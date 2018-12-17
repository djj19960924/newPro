import React from 'react';

class orderUnmatched extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="orderUnmatched">
        未匹配订单!
      </div>
    )
  }
}

export default orderUnmatched;