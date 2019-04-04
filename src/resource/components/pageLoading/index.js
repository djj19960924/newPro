import React from 'react';
import { Icon, } from 'antd';

import './index.less';

class PageLoading extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const { loadingTxt, percentage} = this.props;
    this.changeMarginbyTxtChanged()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { loadingTxt, } = this.props;
    if (prevProps.loadingTxt !== loadingTxt) {
      this.changeMarginbyTxtChanged()
    }
  }

  changeMarginbyTxtChanged() {
    let divLoadingTxt = document.querySelector(`.loadingTxt`);
    divLoadingTxt.style.marginLeft = `-${divLoadingTxt.clientWidth/2}px`;
    divLoadingTxt.style.marginTop = `-${divLoadingTxt.clientHeight/2}px`;
  }

  render() {
    const { loadingTxt,percentage } = this.props;
    return (
      <div className="pageLoading">
        <div className="loadingTxt" ref="loadingTxt">
          <Icon type="loading" className="loadingIcon"/>
          <span className="loadingMain">{loadingTxt ? loadingTxt : `Loading...`}
            {percentage ? <span>{percentage}</span> : "" }
          </span>
        </div>
        <div className="shadowLayer">
        </div>
        {/*这里内部不添加新的内容*/}
      </div>
    )
  }
}

export default PageLoading;