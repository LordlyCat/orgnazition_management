import React, {
    Component
} from 'react';
//import ReactDOM from 'react-dom';
import './Login.css';
import ajax from '../ajax.js';
import {
    Redirect
} from 'react-router-dom';
import Guide from '../Guide/Guide.js';

class Login extends Component {
    constructor() {
        super();

        this.allOrz = [{
            name: "红岩网校工作站",
            statement: ['产品策划及运营部', '视觉设计部', 'Web研发部', '移动开发部', '运维安全部']
        }, {
            name: "校团委宣传部",
            statement: ['校团委宣传部']
        }, {
            name: "校团委组织部",
            statement: ['校团委组织部']
        }, {
            name: "校团委办公室",
            statement: ['校团委办公室']
        }, {
            name: "校学生会",
            statement: ['综合部', '学习部', '宣传部', '权益提案部', '生活服务部', '文艺部', '体育部', '女生部']
        }, {
            name: "学生科技联合会",
            statement: ['综合部', '科技人文部', '项目管理部', '媒体运营部', '科创竞赛部', '信息部']
        }, {
            name: "青年志愿者协会",
            statement: ['综合管理部', '青年志愿者服务总队', '实践服务部', '宣传推广部']
        }, {
            name: "大学生艺术团",
            statement: ['管乐团', '民乐团', '舞蹈团', '合唱团', '话剧团', '综合部']
        }, {
            name: "学生社团联合会",
            statement: ['综合部', '宣传部', '社团服务部', '社团活动部']
        }, {
            name: "勤工助学中心",
            statement: ['行政部', '宣传部', '策划部', '对外联络部', '失物招领部', '学生超市', '绿色书屋', '学生打印社', '文化产品部']
        }, {
            name: "重邮就业中心",
            statement: ['综合支撑组', '对外活动组', '媒体运营组']
        }, {
            name: "重邮e站微+平台",
            statement: ['办公室', '项目部', '采编部', '策划部', '记者团']
        }];
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getChecked = this.getChecked.bind(this);
        this.showGuide = this.showGuide.bind(this);
        this.back = this.back.bind(this);
        this.state = {
            oname: '',
            password: '',
            logined: false,
            checked: false,
            guideBook: false
        }
    }

    handleSubmit() {
        let that = this;
        //console.log(this.state);
        ajax({
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/login',
            method: 'POST',
            data: {
                username: encodeURIComponent(this.state.oname.toString()),
                passwd: this.state.password.toString()
            },
            header: 'application/x-www-form-urlencoded',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
                let headerData = res.getAllResponseHeaders();
                console.log(encodeURIComponent(this.state.oname.toString()))
                console.log(JSON.parse(res.response));
                if (JSON.parse(res.response).name === this.state.oname) {

                    for (var i = 0; i < this.allOrz.length; i++) {
                        if (this.allOrz[i].name === this.state.oname) {
                            localStorage.setItem('orz', JSON.stringify(this.allOrz[i]));
                            break;
                        }
                    }

                    //console.log(headerData.split('\n')[0].split(': ')[1]);
                    localStorage.setItem('authorization', headerData.split('\n')[0].split(': ')[1])
                    localStorage.setItem('oname', that.state.oname);
                    alert('Login successfully');
                    that.setState({
                        logined: true
                    })
                } else {
                    alert('Login failed');
                }
            }
        })
        return false;
    }

    handleChange(e) {
        if (e.target.type === 'text') {
            this.setState({
                oname: e.target.value
            })
        } else if (e.target.type === 'password') {
            this.setState({
                password: e.target.value
            })
        }
    }
    getChecked(e) {
        this.setState({
            checked: e.target.checked
        })
    }
    showGuide() {
        this.setState({
            guideBook: true
        })
    }
    back() {
        this.setState({
            guideBook: false
        })
    }
    render() {
        if (this.state.logined) {
            return <Redirect to="/index"/>
        }
        if (this.state.guideBook) {
            return <Guide back={this.back} />
        }
        return (
            <div id="login">
                <div className="title">组织报名系统后台管理</div>
                <input type="text" placeholder="账号" value={this.state.oname} onChange={this.handleChange} />
                <input type="password" placeholder="密码" value={this.state.password} onChange={this.handleChange} />
                <div className="check">
                    <input type="checkbox" onChange={this.getChecked}/>我已阅读<span onClick={this.showGuide}>组织报名系统后台管理使用说明</span>
                </div>
                <input disabled={!this.state.checked} type="submit" value="Login" onClick={this.handleSubmit} />
            </div>
        )
    }
}



export default Login;