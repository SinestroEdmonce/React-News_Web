import React from "react";
import ReactDOM from "react-dom";
import { Container, Card } from "react-bootstrap";
import { MdShare } from "react-icons/md";

// Import self-designed component
import history from "./History";

// Import the self-designed css style
import cssobj from "@/stylesheet/news-bar-cmpt.scss";

// Constant that is used to determine the maximum line of the description paragraph
const MAX_LIMIT_LINE_NUM = 3;

// News card component in section-based news container
export default class NewsBarCmpt extends React.Component {
    constructor(props) {
        super(props);
        // Initialize the state
        this.state = {};
    }

    render() {
        return (
            <Container fluid onClick={this.clickNewsBar} className={cssobj["news-bar"]}>
                <Card.Img className={cssobj["news-bar-image"]} src={this.props.imageURL} alt=""/>
                <div className={cssobj["news-bar-info"]}>
                    <Card.Title className={cssobj["news-bar-title"]}>{ this.props.title } 
                        <span
                            className={cssobj["news-bar-share"]}
                            onClick={
                                (e) => { 
                                    e.stopPropagation(); 
                                    this.props.shareHandler(this.props.url, this.props.title) 
                                }}>
                            <MdShare />
                        </span>
                    </Card.Title>
                    <p className={cssobj["news-bar-desc"]}>{ this.props.description }</p>
                    <Card.Body className={cssobj["news-bar-footer"]}>
                        <span className={cssobj["news-bar-date"]}>{ this.props.publishedAt }</span>
                        <div className={cssobj[this.props.sectionCSSType]}>
                            <span>{ this.props.sectionId.toUpperCase() }</span>
                        </div>
                    </Card.Body>
                </div>
            </Container>
        );
    }

    clickNewsBar = () => {
        
        history.push({
            pathname: "/article",
            search: `?id=${this.props.articleId}`,

            hash: this.props.source
        });
    }
}