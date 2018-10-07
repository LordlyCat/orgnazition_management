import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './loaders.min.css';
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

//Ant Design
import Button from 'antd/lib/button';

var Loader = require('react-loaders').Loader;


class App extends React.Component {
    constructor(props) {
        super(props);

        let pushListSet = new Set()
        this.state = {
            selected: {
                dname: '',
                schedule: '',
                status: ''
            },
            listTotal: 0,
            searchKeyword: '',
            setStep: '',
            way: '',
            show: false,
            templateID: '',
            info: '',
            stepArr: [],
            over: false,
            current: 1,
            tips: '正在推送中，请勿关闭页面···'
        }

        this.pushList = pushListSet;
        this.orz = JSON.parse(localStorage.getItem('orz'));
        this.addPushMessage = this.addPushMessage.bind(this);
        this.deletePushMessage = this.deletePushMessage.bind(this);
        this.selectModule = this.selectModule.bind(this);
        this.send = this.send.bind(this);
        this.showTemplate = this.showTemplate.bind(this);
        this.setStep = this.setStep.bind(this);
        this.setWay = this.setWay.bind(this);
        this.selectTemplate = this.selectTemplate.bind(this);
        this.setInfo = this.setInfo.bind(this);
        this.getStep = this.getStep.bind(this);
        this.setSearchKeyword = this.setSearchKeyword.bind(this);
        this.getListTotal = this.getListTotal.bind(this);
        this.getPushList = this.getPushList.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.setCurrent = this.setCurrent.bind(this);
        this.setTips = this.setTips.bind(this);
    }
    componentDidMount() {
        this.getStep();
        this.getListTotal({
            oname: this.orz.name
        });
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
    addPushMessage(id) { //添加消息推送
        this.pushList.add(id);
        //console.log(this.pushList)
    }
    deletePushMessage(id) { //删除消息推送
        this.pushList.delete(id);
        //this.pushList = this.arrRemove(this.pushList, id);
        document.querySelector('#selectAll').checked = false;
    }
    getPushList() { //获取消息推送列表
        return this.pushList;
    }
    send() { //推送消息
        let that = this;
        let infoObj = JSON.parse(localStorage.getItem('info'));
        let infoArr = [];
        Object.keys(infoObj).forEach(function(key) {
            if (key === 'setStep') {
                infoArr.push(that.state.setStep)
            } else {
                infoArr.push(infoObj[key]);
            }
        });
        //console.log(Object.keys(infoObj));
        let checkboxArr = document.querySelectorAll('.checkBox');
        for (let i = 0, length1 = checkboxArr.length; i < length1; i++) {
            checkboxArr[i].checked = false;
        }

        let templateID = this.state.templateID;
        if (this.state.way === 0 && templateID.length === 0) {
            templateID = 'H3VNgVqo3r9ewRi0hhGJDKl_-VBginnIgtFmNyRXeiM';
        }
        if (this.state.way === 1 && templateID.length === 0) {
            templateID = '205662';
        }

        let ifOver = false;
        if (this.state.way === 1) {
            Object.keys(infoObj).forEach(function(key) {
                if (infoObj[key].length > 12) {
                    ifOver = true;
                }
            })
        }

        if (ifOver) {
            alert('字符长度不能超过12个单位');
            return false;
        }
        if (this.state.setStep.length === 0) {
            alert('流程进度不能为空');
            return false;
        }
        let data = {
            "id": Array.from(this.pushList),
            "beizhu": this.state.setStep,
            "tid": templateID, //"H3VNgVqo3r9ewRi0hhGJDKl_-VBginnIgtFmNyRXeiM", //消息模板ID
            "result": null,
            "choose": this.state.way, //推送模式
            "info": [...infoArr]
        }
        //console.log(data);
        this.setTips('正在推送中，请勿关闭页面···');
        this.showLoader();


        // setTimeout(() => {
        //     this.showLoader();
        //     that.getStep();
        // }, 5000)
        // that.showTemplate();
        // that.setState({
        //     templateID: ''
        // })
        // that.pushList = new Set();
        // return false;

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
                    this.showLoader();
                    return
                }
                //console.log('推送', JSON.parse(res.response));
                let resData = JSON.parse(res.response);
                this.showLoader();
                that.getStep();
                alert('一共推送了' + resData['总数'] + '条，成功' + resData['成功'] + '条，失败' + resData['失败'] + '条');
            }
        });
        that.showTemplate();
        that.setState({
            templateID: ''
        })
        that.pushList = new Set();
    }
    getStep() {
        let that = this;
        ajax({
            async: true,
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/getcinfo',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('authorization')
            },
            success: (res) => {

                if (res.response.slice(2, 7) === 'error') {
                    console.log('jwt error', res.response);
                    //alert('登录过期，请重新登录');
                    //window.location = '/#/login';
                    return
                }
                //console.log('流程', res.response);
                let arr = res.response.split('"');
                let stepArr = []
                for (var i = 1; i < arr.length; i += 2) {
                    //console.log(arr[i]);
                    stepArr.push(arr[i]);
                }
                that.setState({
                    stepArr: stepArr
                })
            }
        })
    }
    selectModule(e) {
        this.setSearchKeyword('');
        let selected = this.state.selected;
        selected.dname = e[0];
        selected.schedule = e[1];
        selected.status = e[2];
        this.setState({
            selected: selected
        })
        let obj = {
            dname: e[0],
            info: e[1],
            result: e[2]
        }
        if (obj.dname === this.orz.name) {
            obj = {
                oname: this.orz.name
            }
        }
        this.getListTotal(obj);
        this.setCurrent(1);
        let firstPage = document.querySelectorAll('a')[1];
        firstPage.className = 'active';
    }
    showTemplate() {
        if (this.pushList.size > 50) {
            alert('单次推送数量不能超过50, 当前已选' + this.pushList.size);
            return;
        }
        if (this.pushList.size === 0) {
            alert("未选中任何条目")
            return;
        }
        if (this.state.show) {
            this.setState({
                show: false
            });

            this.pushList = new Set();
            let checkboxArr = document.querySelectorAll('.checkBox');
            for (let i = 0, length1 = checkboxArr.length; i < length1; i++) {
                checkboxArr[i].checked = false;
            }
        } else {
            this.setState({
                show: true
            })
        }
    }
    setStep(e) {
        this.setState({
            setStep: e.target.value
        })
    }
    setWay(e) {
        this.setState({
            way: e
        })
    }
    selectTemplate(e) {
        this.setState({
            templateID: e
        })
    }
    setInfo(info) {
        this.setState({
            info: info
        })
    }
    setSearchKeyword(keyword) {
        //console.log(keyword)
        this.setState({
            searchKeyword: keyword
        })
    }
    showLoader() {
        if (this.state.over) {
            this.setState({
                over: false
            })
        } else {
            this.setState({
                over: true
            })
        }
    }
    setCurrent(current) {
        this.setState({
            current: current
        })
    }
    getListTotal(data) {
        data.oname = this.orz.name;
        let that = this;
        ajax({
            async: true,
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/basecount',
            method: 'POST',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: localStorage.getItem('authorization')
            },
            success: (res) => {
                if (res.response.slice(2, 7) === 'error') {
                    return
                }
                that.setState({
                    listTotal: res.response
                })
            }
        })
    }
    setTips(tips) {
        this.setState({
            tips: tips
        })
    }
    render() {
        let loader = null;
        let cover = null;
        if (this.state.over) {
            loader = <Loader className="loader" type="cube-transition" color="green" active />
            cover = <div className="cover"><p>{this.state.tips}</p></div>
        }

        let loaderStyle = {};
        //if () {}
        let overStyle = {};
        let show = null;
        if (this.state.show) {
            overStyle = {
                overflow: 'hidden',
                height: '99.5vh'
            }
            show = <Template 
            showTemplate={this.showTemplate} 
            setStep={this.setStep}
            send={this.send}
            setWay={this.setWay}
            selectTemplate={this.selectTemplate}
            setInfo={this.setInfo} />
        }
        return (
            <div style={overStyle}>
                {loader}
                {cover}
            	<HeaderInfo />
            	<Func 
                send={this.send}
                stepArr={this.state.stepArr}
                showTemplate={this.showTemplate}
                selectModule={this.selectModule}
                setSearchKeyword={this.setSearchKeyword}
                listTotal={this.state.listTotal}
                selected={this.state.selected}
                showLoader={this.showLoader}
                setTips={this.setTips} />

                <Table
                style={loaderStyle} 
                index={this.state.index} 
                searchKeyword={this.state.searchKeyword}
                addPushMessage={this.addPushMessage}
                deletePushMessage={this.deletePushMessage}
                selected={this.state.selected}
                setSearchKeyword={this.setSearchKeyword}
                getPushList={this.getPushList}
                showLoader={this.showLoader}
                setCurrent={this.setCurrent}
                current={this.state.current} />

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