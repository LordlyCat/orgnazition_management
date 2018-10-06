import React, {
	Component
} from 'react';


class Guide extends Component {
	render() {
		return (
			<div className="guide">
    			<div className="content">请看青春邮约反馈群群文件</div>
    			<button className="back" onClick={this.props.back} >返回</button>
    		</div>
		)
	}
}

export default Guide;