import React from "react";
import { EmailShareButton, EmailIcon, 
    FacebookShareButton, FacebookIcon,
    TwitterShareButton, TwitterIcon } from "react-share";
// Unnecessary import
// import ReactTooltip from "react-tooltip";

// Import self-designed css style
import cssobj from "@/stylesheet/share-group-cmpt.scss";

// Share group component
export default class ShareGroupCmpt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "url": this.props.articleURL,
            "tag": "CSCI_571_NewsApp"
        }
    }

    render() {
        return (
            <div className={cssobj["share-group-ctn"]}>
                {/* <ReactTooltip effect="solid" className={cssobj["share-group-tooltip"]} /> */}
                <FacebookShareButton className={cssobj["group-share-btn"]} url={this.state.url} hashtag={"#"+this.state.tag}>
                    <FacebookIcon data-tip="Facebook" size={28} round={true} />
                </FacebookShareButton>
                <TwitterShareButton className={cssobj["group-share-btn"]} url={this.state.url} hashtags={[this.state.tag]} >
                    <TwitterIcon data-tip="Twitter" size={28} round={true} />
                </TwitterShareButton>
                <EmailShareButton className={cssobj["group-share-btn"]} url={this.state.url} subject={this.state.tag} >
                    <EmailIcon data-tip="Email" size={28} round={true} />
                </EmailShareButton>
            </div>

        );
    }
}