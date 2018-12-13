import React from 'react';

class ContentMain extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return(
      <div name="ContentMain" style={{backgroundColor: '#eee', width: '100%', height: '100%',}}>
        <div style={{backgroundColor: '#fff', position: 'absolute', top: 10, bottom: 10, left: 10, right: 10,}}>内容主体</div>
      </div>
    )}
}

export default ContentMain;