import React from "react";
import {Radio, Input} from "antd";
import "./index.less";
import PurchaseTrip from "./compontents/purchaseTrip";
import WaitPurchasing from "./compontents/purchasing";
import EndOfOrder from "./compontents/endOfOrder";

class GlobalErrands extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contentType: "0",
    };

  }

  componentWillMount() {
    if (window.getQueryString("contentType") !== null) {
      this.setState({contentType: window.getQueryString("contentType")})
    }
  }

  componentWillUnmount() {
    this.setState = () => {
      return null
    }
  }
  render() {
    const {contentType} = this.state;
    return (
      <div className="globalErrands">
        <div className="title">
          <div className="titleMain">全球跑腿</div>
          <div className="titleLine"></div>
        </div>
        <Radio.Group defaultValue={contentType} buttonStyle="solid" onChange={(e) => {
          this.props.history.push("/reservation-service/global-errands?contentType=" + e.target.value);
          this.setState({contentType: e.target.value})
        }} className="menu-selection">
          <Radio.Button value="0">等待采购</Radio.Button>
          <Radio.Button value="1">采购结束</Radio.Button>
          <Radio.Button value="2">采购行程</Radio.Button>
        </Radio.Group>
        {
          contentType === "0" && <WaitPurchasing history={this.props.history}></WaitPurchasing>
        }
        {
          contentType === "1" && <EndOfOrder></EndOfOrder>
        }
        {
          contentType === "2" && <PurchaseTrip></PurchaseTrip>
        }
      </div>
    );
  }
}


export default GlobalErrands;