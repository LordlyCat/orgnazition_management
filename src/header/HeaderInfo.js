import React, {
    Component
} from 'react';
import './HeaderInfo.css';
import ajax from '../ajax.js';

class HeaderInfo extends Component {
    constructor() {
        super()
        this.state = {
            totalNumber: null,
            trueTotal: null,
            recharge: 30000
        }

        let that = this;
        ajax({ //总人次
            async: true,
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/systemcount',
            method: 'POST',
            data: {},
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: localStorage.getItem('authorization')
            },
            success: (res) => {
                console.log('getList');
                if (res.response.slice(2, 7) === 'error') {
                    console.log('jwt error');
                    alert('登录过期，请重新登录');
                    window.location = '/#/login';
                    return
                }
                that.setState({
                    totalNumber: res.response
                })

            }
        })

        ajax({ //  总人数
            async: true,
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/usercount',
            method: 'POST',
            data: {},
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: localStorage.getItem('authorization')
            },
            success: (res) => {
                console.log('getList');
                if (res.response.slice(2, 7) === 'error') {
                    console.log('jwt error');
                    alert('登录过期，请重新登录');
                    window.location = '/#/login';
                    return
                }
                that.setState({
                    trueTotal: res.response
                })
            }
        })

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