import React, {
    Component
} from 'react';
import './Function.css';
import search from '../search.png';
//import ajax from '../ajax.js';

class Func extends Component {
    constructor(props) {
        super(props);
        this.orz = JSON.parse(localStorage.getItem('orz'));
    }
    // getSelectValue(e) {
    //     console.log(e.target.value);
    // }
    render() {
        let statementList = this.orz.statement.map((ele, index) =>
            <option value ={ele} key={index}>{ele}</option>
        )
        let stepList = this.props.stepArr.map((ele, index) =>
            <option value ={ele} key={index}>{ele}</option>
        )
        return (
            <div className="func">
        		<select name="statement" id="statement" className="statement" 
        		onChange={this.props.selectModule}>
                    <option value ='' key='allStatement'>{this.orz.name}</option>
        			{statementList}
        		</select>
        		<p>(共有100人)</p>
        		<select name="step" id="step" className="step" onChange={this.props.selectModule}>
                    <option value ='' key='allStep'>流程进度(全部)</option>
        			{stepList}
        		</select>
        		<select name="status" id="status" className="status step" onChange={this.props.selectModule}>
        			<option value ="面试结果">面试结果(全部)</option>
  					<option value ="未通过">未通过</option>
  					<option value="通过">通过</option>
  					<option value="待定">待定</option>
                    <option value="无">无</option>
        		</select>
        		<input type="text" className="search" placeholder="搜索" />
        		<img src={search} alt=""/>
        		<div className="btnWrapper">
        			<button>导出</button>
        			<button>导入</button>
        			<button onClick={this.props.showTemplate}>推送</button>
        			<button>删除</button>
        		</div>

        	</div>
        )
    }
}

export default Func;