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
            total: 0,
            current: 1
        }

        this.getList({
            oname: this.orz.name,
            currindex: 1,
            size: this.state.pageSize
        })
        this.getPages({
            oname: this.orz.name,
            size: this.state.pageSize
        })
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            current: 1
        })
        let that = this;

        let searchObj = {};
        if (newProps.searchKeyword.length > 0) {
            searchObj.oname = this.orz.name;
            searchObj.stuname = newProps.searchKeyword;
            searchObj.currindex = 1;
            searchObj.size = this.state.pageSize;
            //this.props.setSearchKeyword('');
        }
        console.log('update', searchObj);
        let data = {
            oname: that.orz.name,
            currindex: 1,
            size: this.state.pageSize
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
        console.log(data);
        this.getList(data);
        this.getPages(data);
        return true;
    }

    componentDidMount() {
        this.getPages({
            oname: this.orz.name,
            size: this.state.pageSize
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
        console.log(data);
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
                console.log('pages', res.response);
                that.setState({
                    pages: parseInt(res.response, 10),
                    total: parseInt(res.response, 10) * data.size
                })
            }
        })
    }
    goToPage(currindex) {
        let data = {
            size: this.state.pageSize
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
        this.setState({
            current: page
        })
        console.log(page, pageSize)
        let data = {
            size: pageSize,
            currindex: page
        };
        data.oname = this.orz.name;
        // if (currindex === 1) {
        //     data.currindex = 1
        // } else {
        //     data.currindex = ++currindex.i;
        // }

        if (this.state.selected.dname.length > 0 && this.state.selected.dname !== this.orz.name) {
            data.dname = this.state.selected.dname
        }
        if (this.state.selected.status.length > 0) {
            data.result = this.state.selected.status
        }
        if (this.state.selected.schedule.length > 0) {
            data.info = this.state.selected.schedule
        }
        this.getList(data);

    }
    onShowSizeChange(current, size) {
        this.setState({
            pageSize: size
        })
        console.log(current, size, this.state.total)
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
                className="pagination" 
                current={this.state.current}
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
                console.log('active', list[i]);
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