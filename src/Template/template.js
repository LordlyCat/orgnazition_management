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
        console.log(e);
        if (e === 'xbs') {
            this.props.setWay(0);
        } else if (e === 'sms') {
            this.props.setWay(1);
        }
    }
    render() {
        console.log('way', this.state.way)
        let T;
        if (this.state.way === 'xbs') {
            T = <XbsTemplate 
            showTemplate={this.props.showTemplate} 
            setStep={this.props.setStep}
            send={this.props.send}
            selectTemplate={this.props.selectTemplate} />
        } else if (this.state.way === 'sms') {
            T = <SMSTemplate 
            showTemplate={this.props.showTemplate} 
            setStep={this.props.setStep}
            send={this.props.send}
            selectTemplate={this.props.selectTemplate} />
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

/*

"来自"+enpty.getInfo().get(0)+"的提醒:\n" +
                    "学生姓名:"+user.getStuname()+"\n" +
                    "意向部门:"+enpty.getInfo().get(1)+"\n" +
                    "录取结果:"+enpty.getInfo().get(2)+"\n" +
                    enpty.getInfo().get(3);
 */

class XbsTemplate extends Component {
    constructor() {
        super();
        this.selectT = this.selectT.bind(this);
        this.state = {
            select: 1,
            templateArr: ['社团组织：XX 面试时间：XX 面试地点：XX 联系人姓名：XX 联系人联系方式：XX',
                '来自 XX 的提醒 学生姓名：XX，意向部门：XX，录取结果：XX'
            ]
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
                    </select>
                    <p>{this.state.templateArr[this.state.select - 1]}</p>
                </div>
                <div className="quit" onClick={this.props.showTemplate}>取消</div>
                <div className="check" onClick={this.props.send} >确定</div>
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
            templateArr: ['XX同学,你先前申请的组织需面试:组织: XX  ,地点: XX ,时间: XX , 联系方式: XX',
                '来自 XX 的提醒: 学生姓名: XX ,意向部门: XX, 录取结果: XX '
            ],
            templateID: [200159, 196813]
        }
    }
    selectT(e) {
        this.setState({
            select: e.target.value
        })
        if (e.target.value == 1) {
            this.props.selectTemplate(200159)
        } else if (e.target.value == 2) {
            this.props.selectTemplate(196813)
        } else {
            this.props.selectTemplate(200159);
        }

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
                    </select>
                    <p>{this.state.templateArr[this.state.select - 1]}</p>
                </div>
                <div className="quit" onClick={this.props.showTemplate}>取消</div>
                <div className="check" onClick={this.props.send} >确定</div>
            </div>
        )
    }
}

export default Template;