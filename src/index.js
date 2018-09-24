import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ajax from './ajax.js';
import HeaderInfo from './header/HeaderInfo.js';
import Func from './function/Function.js';
import Table from './Table/Table.js';
import Login from './Login/Login.js';
import Template from './Template/template.js';
import {
    HashRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';


class App extends React.Component {
    constructor(props) {
        super(props);
        //console.log(localStorage.getItem('authorization'))
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
        }];

        localStorage.setItem('orz', JSON.stringify(this.allOrz[0]));
        this.state = {
            //orgnazition: '',
            selected: {
                dname: '',
                schedule: '',
                status: ''
            },
            pushList: [],
            setStep: '',
            show: false
        }
        this.pushList = [];
        this.orz = JSON.parse(localStorage.getItem('orz'));
        this.addPushMessage = this.addPushMessage.bind(this);
        this.deletePushMessage = this.deletePushMessage.bind(this);
        this.selectModule = this.selectModule.bind(this);
        this.send = this.send.bind(this);
        this.showTemplate = this.showTemplate.bind(this);
        this.setStep = this.setStep.bind(this);
    }
    componentDidMount() {

    }
    arrRemove(arr, ele) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === ele) {
                arr.splice(i, 1)
                break;
            }
        }
        return arr;
    }
    addPushMessage(id) {
        console.log(this.pushList)
        let arr = this.pushList;
        arr.push(id);
        this.pushList = arr;
        // this.setState({
        //     pushList: arr
        // })
    }
    deletePushMessage(id) {
        //this.arrRemove(this.state.pushList, id)
        this.pushList = this.arrRemove(this.pushList, id);
        // this.setState({
        //     pushList: this.arrRemove(this.state.pushList, id)
        // })
        // console.log(this.arrRemove(this.state.pushList, id))
    }
    send() {
        return false;
        console.log(this.pushList);
        var checkboxArr = document.querySelectorAll('.checkBox');
        for (var i = 0, length1 = checkboxArr.length; i < length1; i++) {
            checkboxArr[i].checked = false;
        }
        let that = this;
        // let data = {

        // }
        let data = {
            "id": this.pushList,
            "beizhu": '5面',
            "tid": "H3VNgVqo3r9ewRi0hhGJDKl_-VBginnIgtFmNyRXeiM", //消息模板ID
            "result": null,
            "choose": 0, //推送模式
            "info": [this.orz.name, "test2", "test3", "test4", "test5", "test6", "test7"]
        }
        console.log(data);
        ajax({
            async: true,
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/addinfolist',
            method: 'POST',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('authorization')
            },
            success: (res) => {

                if (res.response.slice(2, 7) === 'error') {
                    console.log('jwt error', res.response);
                    alert('登录过期，请重新登录');
                    window.location = '/#/login';
                    return
                }
                console.log('面试', res.response);
                // that.setState({
                //     status: status
                // })
            }
        })

        this.pushList = [];
    }
    selectModule(e) {
        let selected = this.state.selected;
        if (e.target.id === 'statement') {
            selected.dname = e.target.value;
        }
        if (e.target.id === 'step') {
            selected.schedule = e.target.value;
        }
        if (e.target.id === 'status') {
            selected.status = e.target.value;
        }
        this.setState({
            selected: selected
        })
    }
    showTemplate() {
        console.log('show');
        if (this.state.show) {
            this.setState({
                show: false
            })
        } else {
            this.setState({
                show: true
            })
        }
    }
    setStep(e) {
        console.log('step', e.target.value);
        this.setState({
            setStep: e.target.value
        })
    }
    selectTemplate() {

    }
    render() {
        let show = null;
        if (this.state.show) {
            show = <Template showTemplate={this.showTemplate} 
            setStep={this.setStep} />
        }
        return (
            <div>
            	<HeaderInfo />
            	<Func 
                //orgnazition={this.state.orgnazition}
                //pushList={this.state.pushList}
                send={this.send}
                showTemplate={this.showTemplate}
                selectModule={this.selectModule}/>
                <Table 
                index={this.state.index} 
                //orgnazition={this.state.orgnazition}
                //authorization={this.state.authorization}// JWT
                addPushMessage={this.addPushMessage}
                deletePushMessage={this.deletePushMessage}
                selected={this.state.selected}/>

                {show}
            </div>
        )
    }
}


ReactDOM.render(<Router basename="">
        <Switch>
            <Route path="/index" component={App} />
            <Route path="/login" component={Login} />
        </Switch>
    </Router>, document.getElementById('root'));
registerServiceWorker();