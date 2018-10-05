import React, {
	Component
} from 'react';


class Guide extends Component {
	render() {
		return (
			<div className="guide">
    			<div className="content">This is a guidebook</div>
    			<button className="back" onClick={this.props.back} >返回</button>
    		</div>
		)
	}
}

export default Guide;