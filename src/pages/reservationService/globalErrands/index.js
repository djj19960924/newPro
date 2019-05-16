import React from 'react';
import {Radio} from 'antd';
import './index.less';
import  PurchaseTrip from './compontents/purchaseTrip';

class GlobalErrands extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

  }

  render() {
    return (
      <div className="globalErrands">
        <Radio.Group defaultValue="2"  buttonStyle="solid" onChange={(e)=>{console.log(e)}} className="menu-selection">
          <Radio.Button value="0" >等待采购</Radio.Button>
          <Radio.Button value="1" >订单完结</Radio.Button>
          <Radio.Button value="2" >采购行程</Radio.Button>
        </Radio.Group>
        {

        }
      </div>
    );
  }
}


export default GlobalErrands;