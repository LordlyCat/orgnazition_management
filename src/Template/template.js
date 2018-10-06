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
        //console.log(e);
        if (e === 'xbs') {
            this.props.setWay(0);
        } else if (e === 'sms') {
            this.props.setWay(1);
        }
    }
    render() {
        //console.log('way', this.state.way)
        let T;
        if (this.state.way === 'xbs') {
            T = <XbsTemplate 
            showTemplate={this.props.showTemplate} 
            setStep={this.props.setStep}
            send={this.props.send}
            selectTemplate={this.props.selectTemplate}
            setInfo={this.props.setInfo} />
        } else if (this.state.way === 'sms') {
            T = <SMSTemplate 
            showTemplate={this.props.showTemplate} 
            setStep={this.props.setStep}
            send={this.props.send}
            selectTemplate={this.props.selectTemplate}
            setInfo={this.props.setInfo} />
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
                <div className="xbs btn" onClick={this.props.chooseWay.bind(this, 'xbs')} >微信消息推送</div>
                <div className="sms btn" onClick={this.props.chooseWay.bind(this, 'sms')} >短信推送</div>
            </div>

        )
    }
}

/*

"来自"+enpty.getInfo().get(0)+"的提醒:\n" +
                    "学生姓名:"+user.getStuname()+"\n" +
                    "意向部门:"+enpty.getInfo().get(1)+"\n" +
                    "录取结果:"+enpty.getInfo().get(2)+"\n" +
                    enpty.getInfo().get(3);
 */

class XbsTemplate extends Component {
    constructor(props) {
        super(props);
        this.selectT = this.selectT.bind(this);
        this.setT = this.setT.bind(this);
        this.state = {
            select: 1,
            templateArr: [<Txbs_1 setInfo={props.setInfo} setT={this.setT} />,
                <Txbs_2 setInfo={props.setInfo} setT={this.setT} />
            ],
            info: null
        }
    }
    selectT(e) {
        this.setState({
            select: e.target.value
        })
        if (e.target.value == 1) {
            this.props.selectTemplate('H3VNgVqo3r9ewRi0hhGJDKl_-VBginnIgtFmNyRXeiM')
        } else if (e.target.value == 2) {
            this.props.selectTemplate('ptsau_vXeAlzsRubHLqaxlFkyicvDbMUJLGCXdniK_g')
        } else {
            this.props.selectTemplate('H3VNgVqo3r9ewRi0hhGJDKl_-VBginnIgtFmNyRXeiM');
        }

    }
    setT(data) {
        this.setState({
            info: data
        })
    }
    render() {
        return (
            <div className="xbsTemplate">
                <div className="title">小帮手消息推送</div>
                <div className="setStep">
                    <span>定义流程进度：</span>
                    <input type="text" placeholder="如“一面面试”" onChange={this.props.setStep} />
                </div>
                <div className="template">
                    <span>模板选择：</span>
                    <select name="xbsT" className="xbsT" onChange={this.selectT} >
                        <option value ="1">模板一（用于面试通知）</option>
                        <option value ="2">模板二（用于录取通知）</option>
                    </select>
                    <div>{this.state.templateArr[this.state.select - 1]}</div>
                </div>
                <div className="quit" onClick={this.props.showTemplate}>取消</div>
                <div className="check" onClick={this.props.send} >确定</div>
            </div>
        )
    }
}

class Txbs_1 extends Component {
    constructor() {
        super();
        this.getInput = this.getInput.bind(this);
        this.getState = this.getState.bind(this);
        this.info = {
            setStep: '',
            location: '',
            time: '',
            contactName: '',
            contactPhone: ''
        }

        localStorage.setItem('info', JSON.stringify(this.info))
    }
    getInput(key, e) {
        let info = JSON.parse(localStorage.getItem('info'));
        info[key] = e.target.value;
        localStorage.setItem('info', JSON.stringify(info));
    }
    getState() {
        return this.state
    }
    render() {
        return (
            <div className="Twrapper">
                <div className="inputBox"><p>亲爱的xxxx同学,你好，你先前的申请的社团组织需要______，现将详细面试信息发给你。
                社团组织:xxxx</p></div>
                <div className="inputBox"><span>面试时间：</span><input type="text" onChange={this.getInput.bind(this, 'time')}/></div>
                <div className="inputBox"><span>面试地点：</span><input type="text" onChange={this.getInput.bind(this, 'location')}/></div>
                <div className="inputBox"><span>联系人姓名：</span><input type="text" onChange={this.getInput.bind(this, 'contactName')}/></div>
                <div className="inputBox"><span>联系人联系方式：</span><input type="text" onChange={this.getInput.bind(this, 'contactPhone')}/></div>
            </div>
        )
    }
}

class Txbs_2 extends Component {
    constructor() {
        super();
        this.getInput = this.getInput.bind(this);
        this.getState = this.getState.bind(this);
        this.info = {
            result: ''
        }

        localStorage.setItem('info', JSON.stringify(this.info))
    }
    getInput(key, e) {
        let info = JSON.parse(localStorage.getItem('info'));
        info[key] = e.target.value;
        //console.log(info)
        localStorage.setItem('info', JSON.stringify(info));

    }
    getState() {
        return this.state
    }
    render() {
        return (
            <div className="Twrapper">
                <div className="inputBox"><p>来自xxxx的提醒: 学生姓名: xxx,意向部门:xxxx </p></div>
                <div className="inputBox"><span>录取结果：</span><input type="text" onChange={this.getInput.bind(this, 'result')}/></div>
            </div>
        )
    }
}


class SMSTemplate extends Component {
    constructor(props) {
        super(props);
        this.selectT = this.selectT.bind(this);
        this.state = {
            select: 1,
            templateArr: [<Tsms_1 setInfo={props.setInfo} setT={this.setT} />,
                <Tsms_2 setInfo={props.setInfo} setT={this.setT} />
            ],
            templateID: [205662, 196810]
        }
    }
    selectT(e) {
        this.setState({
            select: e.target.value
        })
        if (e.target.value == 1) {
            this.props.selectTemplate(205662)
        } else if (e.target.value == 2) {
            this.props.selectTemplate(196810)
        } else {
            this.props.selectTemplate(205662);
        }

    }
    render() {
        return (
            <div className="xbsTemplate">
                <div className="title">短信推送</div>
                <div className="setStep">
                    <span>定义流程进度：</span>
                    <input type="text" placeholder="如“一面面试”" onChange={this.props.setStep}/>
                </div>
                <div className="template">
                    <span>模板选择：</span>
                    <select name="xbsT" className="xbsT" onChange={this.selectT} >
                        <option value ="1">模板一（用于面试通知）</option>
                        <option value ="2">模板二（用于录取通知）</option>
                    </select>
                    <div>{this.state.templateArr[this.state.select - 1]}</div>
                </div>
                <div className="quit" onClick={this.props.showTemplate}>取消</div>
                <div className="check" onClick={this.props.send} >确定</div>
            </div>
        )
    }
}


class Tsms_1 extends Component {
    constructor() {
        super();
        this.getInput = this.getInput.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.getState = this.getState.bind(this);
        this.info = {
            setStep: '',
            location1: '',
            location2: '',
            time: '',
            contactpeople: '',
            contactPhone: ''
        }

        localStorage.setItem('info', JSON.stringify(this.info))
    }
    getInput(key, e) {
        let info = JSON.parse(localStorage.getItem('info'));
        info[key] = e.target.value;
        //console.log(info)
        localStorage.setItem('info', JSON.stringify(info));
    }
    onBlur(e) {
        //console.log(e.target.value);
        if (e.target.value.length > 12) {
            alert('字符长度不能超过12个单位');
        }
    }
    getState() {
        return this.state
    }
    render() {
        let style = {
            opacity: '0'
        }
        return (
            <div className="Twrapper">
                <div className="inputBox"><span>面试时间：</span><input type="text" 
                onChange={this.getInput.bind(this, 'time')}
                onBlur={this.onBlur.bind(this)} /></div>
                <div className="inputBox"><span>面试地点：</span><input type="text" 
                onChange={this.getInput.bind(this, 'location1')}
                onBlur={this.onBlur.bind(this)} /></div>
                <div className="inputBox"><span style={style}>面试地点：</span><input type="text" 
                onChange={this.getInput.bind(this, 'location2')}
                onBlur={this.onBlur.bind(this)} /></div>
                <div className="inputBox"><span>联系人： </span><input type="text" 
                onChange={this.getInput.bind(this, 'contactpeople')} 
                onBlur={this.onBlur.bind(this)} /></div>
                <div className="inputBox"><span>联系方式：</span><input type="text" 
                onChange={this.getInput.bind(this, 'contactPhone')} 
                onBlur={this.onBlur.bind(this)} /></div>
            </div>
        )
    }
}

class Tsms_2 extends Component {
    constructor() {
        super();
        this.getInput = this.getInput.bind(this);
        this.getState = this.getState.bind(this);
        this.info = {
            result: ''
        }

        localStorage.setItem('info', JSON.stringify(this.info))
    }
    getInput(key, e) {
        let info = JSON.parse(localStorage.getItem('info'));
        info[key] = e.target.value;
        //console.log(info)
        localStorage.setItem('info', JSON.stringify(info));

    }
    getState() {
        return this.state
    }
    render() {
        return (
            <div className="Twrapper">
                <div className="inputBox"><p>来自xxxx的提醒: 学生姓名:xxx ,意向部门:xxxx </p></div>
                <div className="inputBox"><span>录取结果：</span><input type="text" onChange={this.getInput.bind(this, 'result')}/></div>
            </div>
        )
    }
}


export default Template;