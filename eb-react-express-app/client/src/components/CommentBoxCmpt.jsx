import React from "react";
import commentBox from "commentbox.io";

// Constant that is used to create the comment box
const COMMENT_BOX_ID = "5741058474377216-proj";

// Comment box component
export default class CommentBoxCmpt extends React.Component {
    constructor(props) {
        super(props);

        // Initialize the state
        this.state = {};
        
    }

    componentDidMount() {
        this.removeCommentBox = commentBox(COMMENT_BOX_ID);
    }

    componentWillUnmount() {
        this.removeCommentBox();
    }

    render() {
        return (
            <div id={this.props.commentBoxId} className="commentbox" />
        );
    }
}