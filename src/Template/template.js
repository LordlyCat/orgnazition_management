import React, {
    Component
} from 'react';

import './template.css';

class Template extends Component {
    constructor(props) {
        super(props);
        this.chooseWay = this.chooseWay.bind(this);
        this.state = {
            way: '',
            T: ''
        }
    }
    chooseWay(e) {
        this.setState({
            way: e
        })
        console.log(e)
    }
    render() {
        console.log('way', this.state.way)
        let T;
        if (this.state.way === 'xbs') {
            T = <XbsTemplate showTemplate={this.props.showTemplate} setStep={this.props.setStep} />
        } else if (this.state.way === 'sms') {
            T = <SMSTemplate showTemplate={this.props.showTemplate} setStep={this.props.setStep} />
        } else {
            T = <SelectWay chooseWay={this.chooseWay} showTemplate={this.props.showTemplate} />
        }
        return (
            <div className="templateWrapper">
                {T}
            </div>
        )
    }
}

class SelectWay extends Component {
    render() {
        return (
            <div className="selectWay">
                <span className="quit" onClick={this.props.showTemplate}>X</span>
                <p>选择推送方式</p>
                <div className="xbs btn" onClick={this.props.chooseWay.bind(this, 'xbs')} >重邮小帮手消息推送</div>
                <div className="sms btn" onClick={this.props.chooseWay.bind(this, 'sms')} >短信推送</div>
            </div>

        )
    }
}

class XbsTemplate extends Component {
    constructor() {
        super();
        this.selectT = this.selectT.bind(this);
        this.state = {
            select: 1,
            templateArr: ['muban1111111', 'muban222222', 'muban333333333']
        }
    }
    selectT(e) {
        this.setState({
            select: e.target.value
        })
    }
    render() {
        return (
            <div className="xbsTemplate">
                <div className="title">小帮手消息推送</div>
                <div className="setStep">
                    <span>定义流程进度：</span>
                    <input type="text" onChange={this.props.setStep} />
                </div>
                <div className="template">
                    <span>模板选择：</span>
                    <select name="xbsT" className="xbsT" onChange={this.selectT} >
                        <option value ="1">模板一</option>
                        <option value ="2">模板二</option>
                        <option value="3">模板三</option>
                    </select>
                    <p>{this.state.templateArr[this.state.select - 1]}</p>
                </div>
                <div className="quit" onClick={this.props.showTemplate}>取消</div>
                <div className="check">确定</div>
            </div>
        )
    }
}


class SMSTemplate extends Component {
    constructor() {
        super();
        this.selectT = this.selectT.bind(this);
        this.state = {
            select: 1,
            templateArr: ['smsmuban1111111', 'smsmuban222222', 'smsmuban333333333']
        }
    }
    selectT(e) {
        this.setState({
            select: e.target.value
        })
    }
    render() {
        return (
            <div className="xbsTemplate">
            <div className="title">短信推送</div>
                <div className="setStep">
                    <span>定义流程进度：</span>
                    <input type="text" onChange={this.props.setStep}/>
                </div>
                <div className="template">
                    <span>模板选择：</span>
                    <select name="xbsT" className="xbsT" onChange={this.selectT} >
                        <option value ="1">模板一</option>
                        <option value ="2">模板二</option>
                        <option value="3">模板三</option>
                    </select>
                    <p>{this.state.templateArr[this.state.select - 1]}</p>
                </div>
                <div className="quit" onClick={this.props.showTemplate}>取消</div>
                <div className="check">确定</div>
            </div>
        )
    }
}

export default Template;