import React from 'react';
import { Icon } from 'antd';
// 拖拽
import Move from './move';
import Zoom from './zoom';

import './main.less';

class ImageViewer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      imgRotate: 0
    };
  }

  componentDidMount() {
    // 这里添加拖拽功能
    let imageBody = this.refs.imageBody;
    this.props.option.move && Move(imageBody);
  }
  handleRotateRight = () => {
    this.setState({ imgRotate: this.state.imgRotate + 90 });
  };
  handleRotateLeft = () => {
    this.setState({ imgRotate: this.state.imgRotate - 90 })
  };
  render() {
    let { imgSrc, closeImageViewer, } = this.props;
    let { rotate, shadow, zoom } = this.props.option;
    return (
      <div className="imageViewer"
        // 方便被其他地方引用该DOM, 详情查看react ref
           ref="imageBody"
        // 监听鼠标滚轮事件
           onWheel={e => zoom && Zoom(e, this.refs.imageBody)}
        // 监听鼠标点击右键事件
           onContextMenu={e => {
             e.preventDefault();
             +e.button === 2 && closeImageViewer();}
           }
           style={{ width: '600px' }}
      >
        {/*判断是否开启图片旋转功能并且开启*/}
        <div className="iconBody">
          {rotate && <Icon type="undo" className="Icon rotateLeft" onClick={this.handleRotateLeft} />}
          {rotate && <Icon type="redo" className="Icon rotateRight" onClick={this.handleRotateRight} />}
          <Icon type="close" className="Icon closeIcon" onClick={closeImageViewer} />
        </div>
        <img className="image"
             src={imgSrc}
             alt=""
             style={{
               width: '100%',
               transform: `rotate(${this.state.imgRotate}deg)`,
               position: 'absolute',
               zIndex: 1999
             }}
        />
        {shadow && <div className="shadow"
                        onClick={closeImageViewer}
        />}
      </div>
    )
  }
}

export default ImageViewer;