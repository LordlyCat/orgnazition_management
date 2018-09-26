import React, {
    Component
} from 'react';
import './Table.css';
import ajax from '../ajax.js';

class Table extends Component {
    constructor(props) {
        super(props);
        this.orz = JSON.parse(localStorage.getItem('orz'));
        //this.handleChange = this.handleChange.bind(this);
        this.getlist = this.getList.bind(this);
        this.getPages = this.getPages.bind(this);
        this.goToPage = this.goToPage.bind(this);

        this.state = {
            data: [],
            selected: this.props.selected,
            pages: 0
        }

        //let that = this;
        this.getList({
            oname: this.orz.name,
            currindex: 1
        })
        this.getPages({
            oname: this.orz.name
        })
    }
    componentWillReceiveProps(newProps) {
        let that = this;
        console.log('update');
        let data = {
            oname: that.orz.name,
            dname: newProps.selected.dname,
            currindex: 1
        }
        if (newProps.selected.status.length > 0 && newProps.selected.status.length < 4) {
            data.result = newProps.selected.status
        }
        if (newProps.selected.schedule.length > 0 && newProps.selected.schedule.length < 4) {
            data.info = newProps.selected.schedule
        }
        this.getList(data);
        this.getPages({
            oname: this.orz.name,
            dname: newProps.selected.dname
        })
        return true;
    }

    componentDidMount() {
        this.getPages({
            oname: this.orz.name
        })
    }
    // handleChange(event) {
    //     console.log(event.target.value)
    //     this.props.change();
    // }
    getList(data) {
        let that = this;
        //oname, dname, currindex, result, info, status
        // {
        //     oname: oname,//组织名
        //     dname: dname,//部门名
        //     currindex: currindex,//页码
        //     result: result,
        //     info: info,
        //     status: status
        // }
        ajax({
            async: true,
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/getuserlist',
            method: 'POST',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: localStorage.getItem('authorization')
            },
            success: (res) => {
                if (res.response.slice(2, 7) === 'error') {
                    //console.log('jwt error', res.response);
                    // alert('登录过期，请重新登录');
                    // window.location = '/#/login';
                    return
                }
                that.setState({
                    data: res.response
                })
            }
        })
    }
    getPages(data) {
        let that = this;
        ajax({
            async: true,
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/gettotal',
            method: 'POST',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: localStorage.getItem('authorization')
            },
            success: (res) => {

                if (res.response.slice(2, 7) === 'error') {
                    console.log('jwt error', res.response);
                    // alert('登录过期，请重新登录');
                    // window.location = '/#/login';
                    return
                }
                //console.log('pages', res.response);
                that.setState({
                    pages: parseInt(res.response, 10)
                })
            }
        })
    }
    goToPage(currindex) {
        let data = {};
        data.oname = this.orz.name;
        data.currindex = ++currindex.i;
        //console.log(data);
        this.getList(data);
        let pageArr = document.querySelectorAll('a');
        for (var i = 0; i < pageArr.length; i++) {
            if (i === data.currindex) {
                pageArr[i].className = 'active';
            } else {
                pageArr[i].className = '';
            }
        }

    }
    render() {
        let data = this.state.data;
        let dataArr = [];

        if (typeof(data) === 'string') {
            dataArr = data.split('[')[1].split(']')[0].split('{').slice(1);
            //console.log(dataArr)
            for (let i = 0, length1 = dataArr.length; i < length1; i++) {
                let l = dataArr[i].length;
                if (i === dataArr.length - 1) {
                    dataArr[i] = JSON.parse('{' + dataArr[i]);
                    dataArr[i].index = i + 1;
                } else {
                    dataArr[i] = JSON.parse('{' + dataArr[i].slice(0, l - 1));
                    dataArr[i].index = i + 1;
                }
            }
        }

        let list = dataArr.map((obj) => {
            return (
                <Row data={obj} key={obj.cid} addPushMessage={this.props.addPushMessage}
                deletePushMessage={this.props.deletePushMessage}/>
            )
        });

        return (
            <div className="tableWrapper">
                <div className="tables">
                    <table cellSpacing="0">
                        <tbody>
                            <tr>
                                <th className="selects"><span id="all">全选</span><input className="checkBox" type="checkbox" name="selectAll" /></th>
                                <th className="index">序号</th>
                                <th className="stateName">部门</th>
                                <th className="username">姓名</th>
                                <th className="stuID">学号</th>
                                <th className="phoneNum">电话</th>
                                <th className="remarks">流程进度</th>
                                <th className="status">状态</th>
                                <th className="send">消息推送</th>
                            </tr>
                            {list}
                        </tbody>
                    </table>
                </div>
                <Pagination 
                orz={this.orz}
                pages={this.state.pages}
                getList={this.getList}
                goToPage={this.goToPage}/>
            </div>
        )
    }
}

class Row extends Component {
    constructor(props) {
        super(props);
        let result;
        if (props.data.result) {
            result = props.data.result
        } else {
            result = '状态选择'
        }
        this.state = {
            selected: false,
            status: result
        }
        //console.log(this.state)
        this.handleChange = this.handleChange.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
    }
    handleChange(event) {
        //console.log(event.target.value)
        if (this.state.selected) {
            this.setState({
                selected: false
            })
            this.props.deletePushMessage(event.target.value);
        } else {
            this.setState({
                selected: true
            })
            this.props.addPushMessage(event.target.value);
        }
    }
    changeStatus(e) {
        //改变面试状态
        let status = e.target.value;
        let data = {
            "id": [this.props.data.cid],
            "beizhu": '',
            "tid": "H3VNgVqo3r9ewRi0hhGJDKl_-VBginnIgtFmNyRXeiM",
            "result": status,
            "choose": -1,
            "info": ["test1", "test2", "test3", "test4", "test5", "test6", "test7"]
        }
        let that = this;
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
                that.setState({
                    status: status
                })
            }
        })
    }
    render() {
        return (
            <tr>
                <td><input className="checkBox" type="checkbox" name="select" value={this.props.data.cid} onChange={this.handleChange}/></td>
                <td>{this.props.data.index}</td>
                <td>{this.props.data.dname}</td>
                <td>{this.props.data.stuname}</td>
                <td>{this.props.data.stuid}</td>
                <td>{this.props.data.phonenum}</td>
                <td>{this.props.data.info}</td>
                <td>
                    <select name="step" id="selectStatus" className="" onChange={this.changeStatus} value={this.state.status} >
                        <option value="无">无</option>
                        <option value ="未通过">未通过</option>
                        <option value="通过">通过</option>
                        <option value="待定">待定</option>
                    </select>
                </td>
                <td>{this.props.data.status}</td>
            </tr>
        )
    }
}

class Pagination extends Component {
    constructor(props) {
        super(props);
        //this.goToPage = this.goToPage.bind(this);
    }
    // goToPage(currindex) {
    //     let data = {};
    //     data.oname = this.props.orz.name;
    //     data.currindex = ++currindex.i;
    //     //console.log(data);
    //     this.props.getList(data)
    // }
    render() {
        let list = [];
        for (let i = 0; i < this.props.pages; i++) {
            if (i === 0) {
                list[i] = <li key={i}><a className="active" onClick={this.props.goToPage.bind(this, {i})}>{i + 1}</a></li>;
                continue;
            }
            list[i] = <li key={i}><a onClick={this.props.goToPage.bind(this, {i})}>{i + 1}</a></li>
        }
        return (
            <ul className="pagination">
                <li><a>«</a></li>
                {list}
                <li><a>»</a></li>
            </ul>
        )
    }
}


export default Table;