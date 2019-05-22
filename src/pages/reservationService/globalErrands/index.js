import React from "react";
import {Radio,Input} from "antd";
import "./index.less";
import  PurchaseTrip from "./compontents/purchaseTrip";
import  WaitPurchasing from "./compontents/purchasing";
import  EndOfOrder from "./compontents/endOfOrder";

class GlobalErrands extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contentType: "0",
    };

  }

  render() {
    const {contentType}=this.state;
    const Search=Input.Search;
    return (
      <div className="globalErrands">
        <Radio.Group defaultValue="0"  buttonStyle="solid" onChange={(e)=>{this.setState({contentType:e.target.value})}} className="menu-selection">
          <Radio.Button value="0" >等待采购</Radio.Button>
          <Radio.Button value="1" >订单完结</Radio.Button>
          <Radio.Button value="2" >采购行程</Radio.Button>
        </Radio.Group>
        {
          contentType==="0" && <WaitPurchasing history={this.props.history}></WaitPurchasing>
        }
        {
          contentType==="1" && <EndOfOrder ></EndOfOrder>
        }
        {
          contentType==="2" && <PurchaseTrip ></PurchaseTrip>
        }
      </div>
    );
  }
}


export default GlobalErrands;