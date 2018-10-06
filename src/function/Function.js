import React, {
    Component
} from 'react';
import './Function.css';
import search from '../search.png';
import ajax from '../ajax.js';

import Button from 'antd/lib/button';
import Cascader from 'antd/lib/cascader';

class Func extends Component {
    constructor(props) {
        super(props);

        this.orz = JSON.parse(localStorage.getItem('orz'));
        this.search = this.search.bind(this);
        this.getKeyword = this.getKeyword.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getStepInfo = this.getStepInfo.bind(this);
        this.setStepInfo = this.setStepInfo.bind(this);
        this.exportExcel = this.exportExcel.bind(this);

        //this.searchKeyword = '';
        let stepInfoArr = this.orz.statement.map((ele, index) => {
            return {
                value: ele,
                label: ele,
                children: []
            }
        })
        this.state = {
            keyword: '',
            cascaderOptions: [{
                value: this.orz.name,
                label: this.orz.name,
                children: [{
                    value: '',
                    label: '全部',
                    children: [{
                        value: '',
                        label: '全部',
                    }, {
                        value: '通过',
                        label: '通过',
                    }, {
                        value: '未通过',
                        label: '未通过',
                    }, {
                        value: '待定',
                        label: '待定',
                    }, {
                        value: '拉黑',
                        label: '拉黑',
                    }],
                }],
            }, ...stepInfoArr]
        }
    }
    componentDidMount() {
        this.setStepInfo();
    }
    componentWillReceiveProps() {
        this.setStepInfo();
    }
    getStepInfo(dname) {
        let cascaderOptions = this.state.cascaderOptions;
        let that = this;
        ajax({
            async: true,
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/getcinfo',
            method: 'POST',
            data: {
                oname: this.orz.name,
                dname: dname
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: localStorage.getItem('authorization')
            },
            success: (res) => {

                if (res.response.slice(2, 7) === 'error') {
                    console.log('jwt error', res.response);
                    return
                }
                //console.log('流程', res.response);
                let arr = res.response.split('"');
                let stepInfoArr = [{
                    value: '',
                    label: '全部',
                    children: [{
                        value: '',
                        label: '全部',
                    }, {
                        value: '无',
                        label: '无',
                    }, {
                        value: '通过',
                        label: '通过',
                    }, {
                        value: '未通过',
                        label: '未通过',
                    }, {
                        value: '待定',
                        label: '待定',
                    }, {
                        value: '拉黑',
                        label: '拉黑',
                    }],
                }];
                for (var i = 1; i < arr.length; i += 2) {
                    let obj = {
                        value: arr[i],
                        label: arr[i],
                        children: [{
                            value: '',
                            label: '全部',
                        }, {
                            value: '无',
                            label: '无',
                        }, {
                            value: '通过',
                            label: '通过',
                        }, {
                            value: '未通过',
                            label: '未通过',
                        }, {
                            value: '待定',
                            label: '待定',
                        }, {
                            value: '拉黑',
                            label: '拉黑',
                        }],
                    }
                    stepInfoArr.push(obj);
                }
                //console.log(stepInfoArr)
                for (var i = 1; i < cascaderOptions.length; i++) {
                    if (cascaderOptions[i].value === dname) {
                        cascaderOptions[i].children = stepInfoArr;
                        break;
                    }
                }
                that.setState({
                    cascaderOptions: cascaderOptions
                })
            }
        })
    }
    setStepInfo() {
        let arr = []
        for (var i = 0; i < this.orz.statement.length; i++) {
            this.getStepInfo(this.orz.statement[i]);
        }
    }
    search() {
        if (this.state.keyword.length === 0) {
            return false;
        }
        this.props.setSearchKeyword(this.state.keyword);
        this.setState({
            keyword: ''
        })
    }
    getKeyword(e) {
        this.setState({
            keyword: e.target.value
        })
    }
    onChange(value, selected) {
        // console.log(this.state.cascaderOptions)
        // console.log(value);
    }
    exportExcel() {
        let that = this;
        //console.log(this.props.selected);
        let data = {
            authorization: localStorage.getItem('authorization'),
            oname: this.orz.name,
            dname: this.props.selected.dname,
            result: this.props.selected.status,
            info: this.props.selected.schedule
        }
        console.log(data);

        ajax({
            url: 'http://localhost:4001/requestDownload',
            method: 'POST',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: localStorage.getItem('authorization')
            },
            success: () => {
                //document.querySelector('.downloadUrl').click();
                let time = (10 + (Math.random() / 2) * 10) * 1000
                that.props.setTips('正在导出···')
                that.props.showLoader();
                setTimeout(() => {
                    that.props.showLoader();
                    document.querySelector('.downloadUrl').click();
                }, time)
            }
        })
    }
    render() {
        let statementList = this.orz.statement.map((ele, index) =>
            <option value ={ele} key={index}>{ele}</option>
        )
        let stepList = this.props.stepArr.map((ele, index) =>
            <option value ={ele} key={index}>{ele}</option>
        )
        return (
            <div className="funcWrapper">
            <a className="downloadUrl" href="http://localhost:4001/download">ddd</a>
            <div className="downloadCover"></div>
                <div className="func">
                    <Cascader className="cascader" 
                    allowClear={false}
                    expandTrigger='hover'
                    defaultValue={[this.orz.name, '', '']} 
                    options={this.state.cascaderOptions} 
                    onChange={this.props.selectModule} />

                    <p>（共{this.props.listTotal}人次）</p>
            		<input type="text" className="search" placeholder="搜索姓名或学号" value={this.state.keyword} onChange={this.getKeyword} />
            		<img src={search} className="searchImg" alt="" onClick={this.search} />
            		<div className="btnWrapper">
            			<Button onClick={this.exportExcel} >导出</Button>
            			<Button onClick={this.props.showTemplate}>推送</Button>
            		</div>

            	</div>
            </div>
        )
    }
}

export default Func;