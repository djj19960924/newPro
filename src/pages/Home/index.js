import React from 'react';
import './index.less';

class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Home"
           style={{width: '100%',
             height: '100%',
             backgroundColor: '#fff',
             fontSize: '48px',
             textAlign: 'center',
           }}
      >
        <p style={{paddingTop: 260,
          margin: 0
        }}
        >欢迎使用BuyersHouse后台管理系统!</p>
      </div>
    )
  }
}

export default Home;