import React from "react";
import { Row, Container, Col } from "react-bootstrap";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import the self-designed component
import NewsCardCmpt from "./NewsCardCmpt";
import FavShareModalCmpt from "./FavShareModalCmpt";

// Import the self-designed css style
import cssobj from "@/stylesheet/fav-news-card-ctn-cmpt.scss";

// Constant to determine how many cards will show in one row
const CARDS_NUM_SHOWN = 4;

// Search news card container component
export default class FavNewsCardCtnCmpt extends React.Component {
    constructor(props) {
        super(props);
        
        // Initialize the state
        const ret = this.requestLocalStorage();
        this.state = {
            "newsList": ret.newsList,
            "isEmpty": ret.isEmpty
        };
    }

    requestLocalStorage() {
        // Obtain all favourite news ids
        let newsIds = [];
        if (localStorage.getItem("newsIds")) {
            newsIds = JSON.parse(localStorage.getItem("newsIds")).data;
        }
        
        // If empty
        if (newsIds.length === 0) {
            return {
                "newsList": [], 
                "isEmpty": true
            };
        }
        // Not empty
        let articles = [];
        newsIds.forEach(function (item, index) {
            const article = JSON.parse(localStorage.getItem(item)).data;
            articles.push(article);
        });

        return {
            "newsList": articles,
            "isEmpty": false
        };
    }

    render() {
        // Is loading or not
        if (this.state.isEmpty) {
            return (
                <Container fluid className={cssobj["no-results-container"]}>
                    <span>You have no saved articles</span>
                </Container>
            );
        }
        else {
            return (
                <Container fluid className={cssobj["news-card-container"]}>
                    <FavShareModalCmpt onRef={this.storeRef} />
                    <Row>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                            <span className={cssobj["note-header"]}>Favorites</span>
                        </Col>
                    </Row>
                    <Row>
                        { this.state.newsList.map((item) => {
                            return (
                                <Col key={item.articleId} xs={12} sm={6} md={6} lg={4} xl={3}>
                                    <NewsCardCmpt
                                        {...item}
                                        shareHandler={this.shareHandler}
                                        showSource={true}
                                        deleteHandler={this.deleteHandler}
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
        this.shareBtn.pHandleShow(articleURL, articleTitle, articleSource);
    }

    // Handle delete event
    deleteHandler = (articleId, articleTitle) => {
        // Notify
        toast("Removing - "+articleTitle)
        // Obtain all favourite news ids
        let newsIds = [];
        if (localStorage.getItem("newsIds")) {
            newsIds = JSON.parse(localStorage.getItem("newsIds")).data;
        }
        
        // Remove the article id from the list
        let index = -1;
        if ((index = newsIds.indexOf(articleId)) >= 0) {
            newsIds.splice(index, 1);
            console.log(newsIds);
            localStorage.setItem("newsIds", JSON.stringify({
                "data": newsIds
            }));
            localStorage.removeItem(articleId);
        }

        const ret = this.requestLocalStorage();
        this.setState({
            "newsList": ret.newsList,
            "isEmpty": ret.isEmpty
        })
    }
}