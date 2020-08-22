import React from "react";
import ReactDOM from "react-dom";
import { css } from "@emotion/core";
import { BounceLoader } from "react-spinners";
import { Container, Row, Col } from "react-bootstrap";

// Import the self-designed component
import NewsBarCmpt from "./NewsBarCmpt";
import ShareModalCmpt from "./ShareModalCmpt";

// Import the self-designed css style
import cssobj from "@/stylesheet/section-news-bar-ctn-cmpt.scss";

// Section news bar container component
export default class SectionNewsBarCtnCmpt extends React.Component {
    constructor(props) {
        super(props);

        // Initialize the state
        this.state = {
            "newsList": [],
            "isLoading": true
        };

        this.shareHandler = this.shareHandler.bind(this);
    }
    
    // Request the nytimes news data
    requestNYNews(section) {
        fetch(`/NY/${section}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.setState({
                    "newsList": data.results,
                    "isLoading": false
                })
            });
    }

    // Request the guardian news data
    requestGNews(section) {
        fetch(`/G/${section}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.setState({
                    "newsList": data.results,
                    "isLoading": false
                })
            });
    }

    componentDidMount() {
        // Obtain the section param
        let section = this.props.match.params.section;
        section = (section? section.toLowerCase(): "home");
        this.setState({
            "newsList": [],
            "isLoading": true
        }, function () {
            if (this.props.source === "guardian") {
                this.requestGNews(section);
            }
            else {
                this.requestNYNews(section);
            }
        })

    }

    shouldComponentUpdate(nextProps, nextState) {
        // Obtain the section param
        let section = nextProps.match.params.section;
        // Is the same section or not
        if (section !== this.props.match.params.section) {
            section = (section? section.toLowerCase(): "home");
            this.setState({
                "newsList": [],
                "isLoading": true
            }, function () {
                if (this.props.source === "guardian") {
                    this.requestGNews(section);
                }
                else {
                    this.requestNYNews(section);
                }
            })
        }

        return true;
    }

    // Render the news container component
    render() {
        // Is loading or not
        if (this.state.isLoading) {
            return (
                <Container fluid className={cssobj["spinner-container"]}>
                    <BounceLoader
                    css={ css`
                        display: block;
                        margin: 0 auto;
                        padding: 0;
                    `}
                    size={ 45 }
                    color={ "#0046E6" }
                    loading={ this.state.isLoading }
                    />
                    <span>Loading</span>
                </Container>
            );
        }
        else {
            return (
                <Container fluid className={cssobj["news-bar-container"]}>
                    <ShareModalCmpt onRef={this.storeRef} />
                    <Row>
                        { this.state.newsList.map((item) => { 
                            return (
                                <Col key={item.articleId} xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <NewsBarCmpt 
                                        {...item} 
                                        shareHandler={this.shareHandler}
                                    />
                                </Col>
                            );
                        }) }
                    </Row>
                </Container>
            );
        }
    }

    // Obtain the share modal component reference
    storeRef = (shareRef) => {
        this.shareBtn = shareRef;
    }

    // Handle share event
    shareHandler = (articleURL, articleTitle) => {
        this.shareBtn.pHandleShow(articleURL, articleTitle);
    }
}