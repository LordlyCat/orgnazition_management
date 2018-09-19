import React, {
    Component
} from 'react';
import './HeaderInfo.css';
import ajax from '../ajax.js';

class HeaderInfo extends Component {
    constructor() {
        super()
        this.state = {
            totalNumber: 1234,
            trueTotal: 752,
            recharge: 30000
        }
    }
    render() {
        return (
            <div className="headerInfo">
                <div className="orgnazitionName">红岩网校工作站</div>
                <div className="total">总报名人次：{this.state.totalNumber}</div>
                <div className="total">总报名人数：{this.state.trueTotal}</div>
                <div className="total">可发短信数：{this.state.recharge}</div>
                <button className="recharge">前往充值</button>
                <button className="quit">退出当前账号</button>
            </div>
        );
    }
}

export default HeaderInfo;