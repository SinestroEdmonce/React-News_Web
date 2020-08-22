import React from "react";
import { Modal, Button } from "react-bootstrap";
import { EmailShareButton, EmailIcon, 
    FacebookShareButton, FacebookIcon,
    TwitterShareButton, TwitterIcon } from "react-share";

// Import self-designed css style
import cssobj from "@/stylesheet/share-modal-cmpt.scss";

// Share modal component
export default class ShareModalCmpt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "show": false,
            "header": "",
            "url": "",
            "tag": "CSCI_571_NewsApp"
        }
        this.pHandleClose = this.handleClose.bind(this);
        this.pHandleShow = this.handleShow.bind(this);
    }

    componentDidMount() {
        // Send the child reference to the parent component
        this.props.onRef(this);
    }

    handleClose = () => {
        this.setState({
            "show": false
        });
    }

    handleShow = (url, header) => {
        this.setState({
            "show": true,
            "header": header,
            "url": url
        });
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className={cssobj["modal-title"]}>{ this.state.header }</Modal.Title>
                </Modal.Header>
                <Modal.Footer className={cssobj["modal-footer"]}>
                    <h5 className={cssobj["modal-share-via"]}>Share Via</h5>    
                    <div className={cssobj["modal-share-tool"]}>
                        <FacebookShareButton className={cssobj["modal-share-btn"]} url={this.state.url} hashtag={"#"+this.state.tag}>
                            <FacebookIcon size={56} round={true} />
                        </FacebookShareButton>
                        <TwitterShareButton className={cssobj["modal-share-btn"]} url={this.state.url} hashtags={[this.state.tag]} >
                            <TwitterIcon size={56} round={true} />
                        </TwitterShareButton>
                        <EmailShareButton className={cssobj["modal-share-btn"]} url={this.state.url} subject={this.state.tag} >
                            <EmailIcon size={56} round={true} />
                        </EmailShareButton>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}