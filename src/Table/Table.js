import React, {
    Component
} from 'react';
import './Table.css';
import ajax from '../ajax.js';
import Pagination from 'antd/lib/pagination'

class Table extends Component {
    constructor(props) {
        super(props);

        this.orz = JSON.parse(localStorage.getItem('orz'));
        //this.handleChange = this.handleChange.bind(this);
        this.getlist = this.getList.bind(this);
        this.getPages = this.getPages.bind(this);
        this.goToPage = this.goToPage.bind(this);
        this.ponChange = this.ponChange.bind(this);
        this.onShowSizeChange = this.onShowSizeChange.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.state = {
            data: [],
            selected: this.props.selected,
            pages: 0,
            pageSize: 20,
            total: 0
            //current: 1
        }
        this.pageSize = 20;
        this.getList({
            oname: this.orz.name,
            currindex: 1,
            size: this.pageSize
        })
        this.getPages({
            oname: this.orz.name,
            size: this.pageSize
        })
    }
    componentWillReceiveProps(newProps) {
        // this.setState({
        //     current: 1
        // })
        let that = this;

        let searchObj = {};
        if (newProps.searchKeyword.length > 0) {
            if (isNaN(newProps.searchKeyword)) {
                if (newProps.searchKeyword === '男' || newProps.searchKeyword === '女') {
                    searchObj.oname = this.orz.name;
                    searchObj.gender = newProps.searchKeyword;
                    searchObj.currindex = newProps.current;
                    searchObj.size = this.pageSize;
                } else if (newProps.searchKeyword.slice(newProps.searchKeyword.length - 2, newProps.searchKeyword.length) === '学院') {
                    searchObj.oname = this.orz.name;
                    searchObj.college = newProps.searchKeyword;
                    searchObj.currindex = newProps.current;
                    searchObj.size = this.pageSize;
                } else {
                    searchObj.oname = this.orz.name;
                    searchObj.stuname = newProps.searchKeyword;
                    searchObj.currindex = newProps.current;
                    searchObj.size = this.pageSize;
                }

            } else {
                searchObj.oname = this.orz.name;
                searchObj.stuid = newProps.searchKeyword;
                searchObj.currindex = newProps.current;
                searchObj.size = this.pageSize;
            }

        }
        console.log('update', searchObj);
        let data = {
            oname: that.orz.name,
            currindex: newProps.current,
            size: this.pageSize
        }
        if (newProps.selected.dname.length > 0 && newProps.selected.dname !== this.orz.name) {
            data.dname = newProps.selected.dname
        }
        if (newProps.selected.status.length > 0) {
            data.result = newProps.selected.status
        }
        if (newProps.selected.schedule.length > 0) {
            data.info = newProps.selected.schedule
        }

        if (searchObj.stuname) {
            data = searchObj
        }
        if (searchObj.stuid) {
            data = searchObj
        }
        if (searchObj.gender) {
            data = searchObj
        }
        if (searchObj.college) {
            data = searchObj
        }
        //console.log('update', data);
        this.getList(data);
        this.getPages(data);
        return true;
    }

    componentDidMount() {
        this.getPages({
            oname: this.orz.name,
            size: this.pageSize
        })
    }
    componentDidUpdate() {
        let pushList = this.props.getPushList();
        let arr = document.querySelectorAll('.checkBox')
        let ifAll = true;
        arr.forEach((element, index) => {
            if (pushList.has(element.value)) {
                element.checked = true;
            } else {
                ifAll = false;
            }
        });

        if (ifAll) {
            document.querySelector('#selectAll').checked = true;
        } else {
            document.querySelector('#selectAll').checked = false;
        }
    }
    getList(data) {
        let that = this;
        console.log('getlist', data);
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
                    console.log('jwt error', res.response);
                    alert('登录过期，请重新登录');
                    window.location = 'https://wx.idsbllp.cn/nodejs/orgnazition/#/login';
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
                    pages: parseInt(res.response, 10),
                    total: parseInt(res.response, 10) * data.size
                })
            }
        })
    }
    goToPage(currindex) {
        let data = {
            size: this.pageSize
        };
        data.oname = this.orz.name;
        if (currindex === 1) {
            data.currindex = 1
        } else {
            data.currindex = ++currindex.i;
        }

        if (this.state.selected.dname.length > 0) {
            data.dname = this.state.selected.dname
        }
        if (this.state.selected.status.length > 0) {
            data.result = this.state.selected.status
        }
        if (this.state.selected.schedule.length > 0) {
            data.info = this.state.selected.schedule
        }
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
    ponChange(page, pageSize) {

        let searchObj = {};
        if (this.props.searchKeyword.length > 0) {
            if (isNaN(this.props.searchKeyword)) {
                if (this.props.searchKeyword === '男' || this.props.searchKeyword === '女') {
                    searchObj.oname = this.orz.name;
                    searchObj.gender = this.props.searchKeyword;
                    searchObj.currindex = page;
                    searchObj.size = this.pageSize;
                } else if (this.props.searchKeyword.slice(this.props.searchKeyword.length - 2, this.props.searchKeyword.length) === '学院') {
                    searchObj.oname = this.orz.name;
                    searchObj.college = this.props.searchKeyword;
                    searchObj.currindex = page;
                    searchObj.size = this.pageSize;
                } else {
                    searchObj.oname = this.orz.name;
                    searchObj.stuname = this.props.searchKeyword;
                    searchObj.currindex = page;
                    searchObj.size = this.pageSize;
                }

            } else {
                searchObj.oname = this.orz.name;
                searchObj.stuid = this.props.searchKeyword;
                searchObj.currindex = page;
                searchObj.size = this.pageSize;
            }

        }


        // this.setState({
        //     current: page
        // })
        //console.log(page, pageSize)
        let data = {
            size: pageSize,
            currindex: page
        };
        data.oname = this.orz.name;

        if (this.state.selected.dname.length > 0 && this.state.selected.dname !== this.orz.name) {
            data.dname = this.state.selected.dname
        }
        if (this.state.selected.status.length > 0) {
            data.result = this.state.selected.status
        }
        if (this.state.selected.schedule.length > 0) {
            data.info = this.state.selected.schedule
        }

        if (searchObj.stuname || searchObj.stuid || searchObj.gender || searchObj.college) {
            data = {
                ...data,
                searchObj
            }
        }

        console.log(data);
        this.getList(data);
        this.props.setCurrent(page);
    }
    onShowSizeChange(current, size) {
        this.pageSize = size
        // this.setState({
        //     pageSize: size
        // })
        //console.log(current, size, this.state.total)
        let that = this;
        let data = {
            oname: that.orz.name,
            currindex: 1,
            size: size
        }
        if (this.state.selected.dname.length > 0 && this.state.selected.dname !== this.orz.name) {
            data.dname = this.state.selected.dname
        }
        if (this.state.selected.status.length > 0) {
            data.result = this.state.selected.status
        }
        if (this.state.selected.schedule.length > 0) {
            data.info = this.state.selected.schedule
        }
        this.ponChange(current, size);
        this.getPages(data);
    }
    selectAll(event) {
        if (event.target.checked) {
            let arr = document.querySelectorAll('.checkBox');
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].disabled) {
                    continue;
                }
                arr[i].checked = true;
                this.props.addPushMessage(arr[i].value);
            }
        } else {
            let arr = document.querySelectorAll('.checkBox');
            for (var i = 0; i < arr.length; i++) {
                arr[i].checked = false;
                this.props.deletePushMessage(arr[i].value);
            }
        }

    }
    render() {
        let data = this.state.data;
        let dataArr = [];
        if (typeof(data) === 'string') {
            //console.log(data);
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
                                <th className="selects"><span id="all">全选</span><input className="selectAll" 
                                id="selectAll"
                                type="checkbox"
                                name="selectAll" 
                                value="all"
                                onChange={this.selectAll} /></th>
                                <th className="index">序号</th>
                                <th className="stateName">部门</th>
                                <th className="username">姓名</th>
                                <th className="gender">性别</th>
                                <th className="stuID">学号</th>
                                <th className="college">学院</th>
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
                className="pagination" 
                current={this.props.current}
                total={this.state.total}
                showSizeChanger={true}
                defaultPageSize={20}
                pageSizeOptions={['10', '20', '30', '40', '50']}
                onChange={this.ponChange}
                onShowSizeChange={this.onShowSizeChange} />
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
            status: result
        }
        //console.log(this.state)
        this.handleChange = this.handleChange.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
    }
    handleChange(event) {
        //console.log('checkbox', event.target.value, event.target.checked)
        if (!event.target.checked) {
            this.props.deletePushMessage(event.target.value);
        } else {
            this.props.addPushMessage(event.target.value);
        }
    }
    changeStatus(e) {
        //改变面试状态
        let status = e.target.value;
        if (status === '拉黑') {
            console.log(123)
            let confirm = window.confirm('此操作不可逆，是否确认拉黑！');
            if (confirm === false) {
                return false;
            }
        }
        let data = {
            "id": [this.props.data.cid],
            "beizhu": '',
            "tid": "",
            "result": status,
            "choose": -1,
            "info": []
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
                    window.location = 'https://wx.idsbllp.cn/nodejs/orgnazition/#/login';
                    return
                }
                //console.log('面试', res.response);
                that.setState({
                    status: status
                })
            }
        })
    }
    render() {
        let status = ''
        let style = {};
        let disabled = false;
        if (this.props.data.status === 1) {
            status = '成功';
        }
        if (this.props.data.status === 2) {
            status = '失败';
            style = {
                color: 'red'
            }
        }

        if (this.state.status === '拉黑') {
            disabled = true;
        }
        return (
            <tr>
                <td><input disabled={disabled} className="checkBox" type="checkbox" name="select" value={this.props.data.cid} onChange={this.handleChange}/></td>
                <td>{this.props.data.index}</td>
                <td>{this.props.data.dname}</td>
                <td>{this.props.data.stuname}</td>
                <td>{this.props.data.gender}</td>
                <td>{this.props.data.stuid}</td>
                <td>{this.props.data.college}</td>
                <td>{this.props.data.phonenum}</td>
                <td>{this.props.data.info}</td>
                <td>
                    <select name="step" id="selectStatus" className="" onChange={this.changeStatus} value={this.state.status} >
                        <option value="无">无</option>
                        <option value ="未通过">未通过</option>
                        <option value="通过">通过</option>
                        <option value="待定">待定</option>
                        <option value="拉黑">拉黑</option>
                    </select>
                </td>
                <td style={style}>{status}</td>
            </tr>
        )
    }
}

class MyPagination extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        //this.goToPage = this.goToPage.bind(this);
    }
    render() {
        //console.log('p up', this.props.pages)
        let list = [];
        for (let i = 1; i < this.props.pages; i++) {
            if (i === 0) {
                list[i] = <li key={i}><a ref={this.myRef} className="active" onClick={this.props.goToPage.bind(this, {i})}>{i + 1}</a></li>;
                //console.log('active', list[i]);
                continue;
            }
            list[i] = <li key={i}><a onClick={this.props.goToPage.bind(this, {i})}>{i + 1}</a></li>
        }
        return (
            <ul className="pagination">
                <li><a>«</a></li>
                <li key={0}><a className="active" onClick={this.props.goToPage.bind(this, 1)}>1</a></li>
                {list}
                <li><a>»</a></li>
            </ul>
        )
    }
}


export default Table;