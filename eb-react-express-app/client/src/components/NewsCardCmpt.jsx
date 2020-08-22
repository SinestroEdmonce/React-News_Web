import React from "react";
import ReactDOM from "react-dom";
import { Card } from "react-bootstrap";
import { MdShare, MdDelete } from "react-icons/md";

// Import self-designed component
import history from "./History";

// Import the self-designed css style
import cssobj from "@/stylesheet/news-card-cmpt.scss";

// News card component
export default class NewsCardCmpt extends React.Component {
    constructor(props) {
        super(props);

        // Initialize the state
        this.state = {};
    }

    componentDidMount() {
        if (this.props.showSource) {
            this.refs.source.style.display = "block";
            this.refs.delete.style.display = "inline";
        }
    }

    render() {
        return (
            <Card className={cssobj["news-card"]} onClick={this.clickNewsCard}>
                <Card.Title className={cssobj["news-card-title"]}>
                    { this.props.title }
                    <span
                        className={cssobj["news-card-share"]}
                        onClick={
                            (e) => { 
                                e.stopPropagation(); 
                                this.props.shareHandler(this.props.url, this.props.title, this.props.source) 
                            }}>
                        <MdShare />
                    </span>
                    <span
                        ref="delete"
                        className={cssobj["news-card-delete"]}
                        onClick={
                            (e) => { 
                                e.stopPropagation(); 
                                this.props.deleteHandler && this.props.deleteHandler(this.props.articleId, this.props.title);
                            }}>
                        <MdDelete />
                    </span>
                </Card.Title>
                <Card.Img className={cssobj["news-card-image"]} src={ this.props.imageURL } alt="" />
                <Card.Body className={cssobj["news-card-footer"]}>
                    <Card.Text className={cssobj["news-card-date"]}>{ this.props.publishedAt }</Card.Text>
                    <div className={cssobj["news-card-2tags"]}>
                        <div className={cssobj[this.props.sectionCSSType]}>
                            <span>{ this.props.sectionId.toUpperCase() }</span>
                        </div>
                        <div ref="source" className={cssobj[this.props.source]}>
                            <span>{ this.props.source.toUpperCase() }</span>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    clickNewsCard = () => {
        history.push({
            pathname: "/article",
            search: `?id=${this.props.articleId}`,
            hash: this.props.source
        });
    }
}