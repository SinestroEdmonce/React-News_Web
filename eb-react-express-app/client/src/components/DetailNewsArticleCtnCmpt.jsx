import React from "react";
import ReactDOM from "react-dom";
import { css } from "@emotion/core";
import { BounceLoader } from "react-spinners";
import { Container } from "react-bootstrap";

// Import the self-designed component
import NewsArticleCmpt from "./NewsArticleCmpt";
import CommentBoxCmpt from "./CommentBoxCmpt";

// Import the self-designed css style
import cssobj from "@/stylesheet/detail-news-article-ctn-cmpt.scss";

// Detail news article container component
export default class DetailNewsArticleCtnCmpt extends React.Component {
    constructor(props) {
        super(props);

        // Initialize the state
        this.state = {
            "article": "",
            "isLoading": true,
            "source": this.props.location.hash.split("#")[1]
        };
    }
    
    // Request the nytimes news data
    requestNYNews(id) {
        fetch(`/NY/details/article?id=${id}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.setState({
                    "article": data.result,
                    "isLoading": false
                })
            });
    }

    // Request the guardian news data
    requestGNews(id) {
        fetch(`/G/details/article?id=${id}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.setState({
                    "article": data.result,
                    "isLoading": false
                })
            });
    }

    componentDidMount() {
        // Obtain the articleId param
        let articleId = this.props.articleId;
        this.setState({
            "article": "",
            "isLoading": true
        }, () => {
            if (this.state.source === "guardian") {
                this.requestGNews(articleId);
            }
            else {
                this.requestNYNews(articleId);
            }

        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Obtain the articleId param
        let articleId = nextProps.articleId;
        // Is the same articleId or not
        if (articleId !== this.props.articleId) {
            this.setState({
                "article": "",
                "isLoading": true
            }, () => {
                if (this.state.source === "guardian") {
                    this.requestGNews(articleId);
                }
                else {
                    this.requestNYNews(articleId);
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
                <Container fluid className={cssobj["news-article-container"]}>
                    <NewsArticleCmpt 
                        {...this.state.article}
                    />
                    <CommentBoxCmpt commentBoxId={this.state.article.articleId} />
                </Container>
            );
        }
    }
}