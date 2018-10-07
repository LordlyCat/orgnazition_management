import React, {
    Component
} from 'react';
import './HeaderInfo.css';
import ajax from '../ajax.js';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';

class HeaderInfo extends Component {
    constructor() {
        super();

        this.orz = JSON.parse(localStorage.getItem('orz'));
        this.getFee = this.getFee.bind(this);
        this.state = {
            totalNumber: null,
            trueTotal: null,
            recharge: '--'
        }

        let that = this;
        ajax({ //总人次
            async: true,
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/systemcount',
            method: 'POST',
            data: {
                oname: this.orz.name
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: localStorage.getItem('authorization')
            },
            success: (res) => {
                console.log('getList');
                if (res.response.slice(2, 7) === 'error') {
                    console.log('jwt error');
                    alert('登录过期，请重新登录');
                    window.location = 'https://wx.idsbllp.cn/nodejs/orgnazition/#/login';
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
            data: {
                oname: this.orz.name
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: localStorage.getItem('authorization')
            },
            success: (res) => {
                console.log('getList');
                if (res.response.slice(2, 7) === 'error') {
                    console.log('jwt error');
                    // alert('登录过期，请重新登录');
                    // window.location = '/#/login';
                    return
                }
                that.setState({
                    trueTotal: res.response
                })
            }
        })

    }
    quit() {
        localStorage.setItem('orz', '');
        localStorage.setItem('authorization', '');
        window.location = 'https://wx.idsbllp.cn/nodejs/orgnazition/#/login';
    }
    componentWillReceiveProps() {
        this.getFee();
    }
    getFee() { ///469bba0a564235dfceede42db14f17b0/getfee
        let that = this;
        ajax({ //  总人数
            async: true,
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/getfee',
            method: 'POST',
            data: {
                oname: this.orz.name
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: localStorage.getItem('authorization')
            },
            success: (res) => {
                //console.log('getList');
                if (res.response.slice(2, 7) === 'error') {
                    console.log('jwt error');
                    // alert('登录过期，请重新登录');
                    // window.location = '/#/login';
                    return
                }
                let fee = JSON.parse(res.response).fee;
                that.setState({
                    recharge: fee
                })
            }
        })
    }
    render() {
        return (
            <div>
                <div className="headerInfo">
                    <div className="orgnazitionName">{this.orz.name}</div>
                    <div className="total">总报名人次：{this.state.totalNumber}</div>
                    <div className="total">总报名人数：{this.state.trueTotal}</div>
                    <div className="total">已发短信数：{this.state.recharge}</div>
                    
                    <Button type="dashed" className="quit" onClick={this.quit}>退出当前账号</Button>
                    <Icon type="star" theme="filled" />
                </div>
            </div>
        );
    }
}

export default HeaderInfo;