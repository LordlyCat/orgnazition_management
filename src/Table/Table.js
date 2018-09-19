import React, {
    Component
} from 'react';
import './Table.css';
import ajax from '../ajax.js';

class Table extends Component {
    constructor(props) {
        super(props);
        this.orz = JSON.parse(localStorage.getItem('orz'));
        this.handleChange = this.handleChange.bind(this);
        this.data = [{
            index: 1,
            statement: '产品策划及运营部',
            username: '张三',
            stuID: 20182195,
            phoneNum: 18722068874,
            remarks: '无',
            send: '未发送'
        }]

        this.state = {
            data: [],
            selected: this.props.selected
        }

        let that = this;
    }
    componentWillReceiveProps(newProps) {
        let that = this;
        console.log(newProps)
        console.log('update');
        ajax({
            async: true,
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/getuserlist',
            method: 'POST',
            data: {
                oname: that.orz.name,
                dname: newProps.selected.dname,
                currindex: 1
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: newProps.authorization
            },
            success: (res) => {
                console.log('getList')
                that.setState({
                    data: res.response
                })
            }
        })
        return true;
    }
    handleChange(event) {
        //console.log(event.target.value)
        this.props.change();
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
                    <table>
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
                <Pagination />
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
        return (
            <div className="pagination">

            </div>
        )
    }
}


export default Table;