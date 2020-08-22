import React from "react";
import ReactDOM from "react-dom";
import { css } from "@emotion/core";
import { BounceLoader } from "react-spinners";
import { Row, Container, Col } from "react-bootstrap";

// Import the self-designed component
import NewsCardCmpt from "./NewsCardCmpt";
import ShareModalCmpt from "./ShareModalCmpt";

// Import the self-designed css style
import cssobj from "@/stylesheet/search-news-card-ctn-cmpt.scss";

// Constant to determine how many cards will show in one row
const CARDS_NUM_SHOWN = 4;

// Search news card container component
export default class SearchNewsCardCtnCmpt extends React.Component {
    constructor(props) {
        super(props);
        
        // Initialize the state
        this.state = {
            "newsList": [],
            "isLoading": true
        };
    }

    
    // Request the nytimes news data
    requestNYNews(keyword) {
        fetch(`/NY/search/${keyword}`)
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
    requestGNews(keyword) {
        fetch(`/G/search/${keyword}`)
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
        // Obtain the keyword param
        let keyword = this.props.keyword;
        this.setState({
            "newsList": [],
            "isLoading": true
        }, function () {
            if (this.props.source === "guardian") {
                this.requestGNews(keyword);
            }
            else {
                this.requestNYNews(keyword);
            }
        })

    }

    shouldComponentUpdate(nextProps, nextState) {
        // Obtain the keyword param
        let keyword = nextProps.keyword;
        // Is the same keyword or not
        if (keyword !== this.props.keyword) {
            this.setState({
                "newsList": [],
                "isLoading": true
            }, function () {
                if (this.props.source === "guardian") {
                    this.requestGNews(keyword);
                }
                else {
                    this.requestNYNews(keyword);
                }
            })
        }

        return true;
    }

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
                <Container fluid className={cssobj["news-card-container"]}>
                    <ShareModalCmpt onRef={this.storeRef} />
                    <Row>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                            <span className={cssobj["note-header"]}>Results</span>
                        </Col>
                    </Row>
                    <Row>
                        { this.state.newsList.map((item) => {
                            return (
                                <Col key={item.articleId} xs={12} sm={6} md={6} lg={4} xl={3}>
                                    <NewsCardCmpt
                                        {...item}
                                        shareHandler={this.shareHandler}
                                        showSource={false}
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
    shareHandler = (articleURL, articleTitle, articleSource) => {
        this.shareBtn.pHandleShow(articleURL, articleTitle);
    }
}