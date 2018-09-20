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

        this.state = {
            data: [],
            selected: this.props.selected,
            pages: 0
        }

        let that = this;
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
        console.log('update', that.orz.name);
        this.getList({
            oname: that.orz.name,
            dname: newProps.selected.dname,
            currindex: 1
        });
        this.getPages({
            oname: this.orz.name,
            dname: newProps.selected.dname
        })
        return true;
    }
    componentDidMount() {
        this.getPages({
            oname: '红岩网校工作站'
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
                console.log('getList');
                if (res.response.slice(2, 7) === 'error') {
                    console.log('jwt error');
                    alert('登录过期，请重新登录');
                    window.location = '/#/login';
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
                    console.log('jwt error');
                    alert('登录过期，请重新登录');
                    window.location = '/#/login';
                    return
                }
                console.log('pages', res.response);
                that.setState({
                    pages: parseInt(res.response, 10)
                })
            }
        })
    }
    changePage(currindex) {
        //this.getList()
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
                                <th className="selects"></th>
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
                <Pagination pages={this.state.pages}/>
            </div>
        )
    }
}

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false
        }
        //console.log(this.props)
        this.handleChange = this.handleChange.bind(this);
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
                <td>{this.props.data.result}</td>
                <td>{this.props.data.status}</td>
            </tr>
        )
    }
}

class Pagination extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let list = [];
        for (let i = 0; i < this.props.pages; i++) {
            if (i === 0) {
                list[i] = <li key={i}><a className="active">{i + 1}</a></li>;
                continue;
            }
            list[i] = <li key={i}><a>{i + 1}</a></li>
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