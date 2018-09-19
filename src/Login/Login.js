import React, {
    Component
} from 'react';
import ReactDOM from 'react-dom';
import './Login.css';
import ajax from '../ajax.js';

class Login extends Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            oname: '',
            password: ''
        }
    }

    handleSubmit() {
        let that = this;
        console.log(this.state);
        ajax({
            url: 'https://bmtest.redrock.team/469bba0a564235dfceede42db14f17b0/login',
            method: 'POST',
            data: {
                username: this.state.oname,
                passwd: this.state.password
            },
            header: 'application/x-www-form-urlencoded',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
                let headerData = res.getAllResponseHeaders();
                console.log(JSON.parse(res.response));
                if (JSON.parse(res.response).name === this.state.oname) {
                    console.log(headerData)
                    alert('Login successfully');
                } else {
                    alert('Login failed');
                }
                // that.setState({
                //     authorization: headerData.split('\n')[0].split(': ')[1]
                // })
            }
        })
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

    render() {
        return (
            <div>
                <div className="title">组织报名系统后台管理</div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.oname} onChange={this.handleChange} />
                    <input type="password" value={this.state.password} onChange={this.handleChange} />
                    <input type="submit" value="Login"/>
                </form>
            </div>
        )
    }
}



export default Login;