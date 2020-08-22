import React from "react";
import { Card } from "react-bootstrap";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import MediaQuery from "react-responsive";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import the self-designed component
import ShareGroupCmpt from "./ShareGroupCmpt";

// Import the self-designed css style
import cssobj from "@/stylesheet/news-article-cmpt.scss";

// Constant that is used to limit the number of lines that a paragraph shows
const MAX_LIMIT_LINE_NUM = 6;
const MAX_LIMIT_HEIGHT = "144px";

// News article component
export default class NewsArticleCmpt extends React.Component {
    constructor(props) {
        super(props);

        // Initialize the state
        this.state = {};
    }

    componentDidMount() {
        // If it is favourite
        if (localStorage.getItem(this.props.articleId)) {
            document.getElementById("news-article-fav-btn").style.display = "none";
            document.getElementById("news-article-unfav-btn").style.display = "block";
        }

        // If the description is required to be truncated
        const currHeight = parseFloat(this.getStyle(this.refs.desc, "height"));
        if (currHeight <= parseFloat(MAX_LIMIT_HEIGHT)) {
            this.refs.footer.style.display = "none";
        }
        else {
            this.refs.desc.style.maxHeight = MAX_LIMIT_HEIGHT;
            this.refs.desc.style.overflow = "hidden";
            this.refs.desc.style.textOverflow = "ellipsis";
            this.refs.desc.style.display = "-webkit-box";
            this.refs.desc.style["-webkit-line-clamp"] = "6";
            this.refs.desc.style["-webkit-box-orient"] = "vertical";
        }
    }

    render() {
        return (
            <Card className={cssobj["news-article"]}>
                <Card.Title className={cssobj["news-article-title"]}>{ this.props.title }</Card.Title>
                <div className={cssobj["news-article-subtitle"]}>
                    <Card.Text className={cssobj["news-article-date"]}>{ this.props.publishedAt }</Card.Text>
                    <div className={cssobj["news-article-user-func"]}>
                        <MediaQuery query="(min-width: 699px)" >
                            <ReactTooltip effect="solid" className={cssobj["news-article-tooltip"]} />
                        </MediaQuery>
                        <ShareGroupCmpt articleURL={this.props.url} />
                        <FaRegBookmark
                            data-tip="Bookmark"
                            id="news-article-fav-btn"
                            className={cssobj["news-article-fav-btn"]}
                            onClick={this.clickFav}
                        />
                        <FaBookmark 
                            data-tip="Bookmark"
                            id="news-article-unfav-btn"
                            className={cssobj["news-article-unfav-btn"]}
                            onClick={this.clickUnfav}
                        />
                    </div>
                </div>
                <Card.Img className={cssobj["news-article-image"]} src={ this.props.imageURL } alt="" />
                <p ref="desc" className={cssobj["news-article-desc"]}>{ this.props.description }</p>
                <div ref="footer" className={cssobj["news-article-footer"]}>
                    <div ref="more" className={cssobj["news-article-expand-more"]}>
                        <MdExpandMore onClick={this.clickExpandMore} size="2em" />
                    </div>
                    <div ref="less" className={cssobj["news-article-expand-less"]}>
                        <MdExpandLess onClick={this.clickExpandLess} size="2em" />
                    </div>
                </div>
            </Card>
        );
    }

    clickFav = () => {
        // Change the icon
        document.getElementById("news-article-fav-btn").style.display = "none";
        document.getElementById("news-article-unfav-btn").style.display = "block";
        // Notify
        toast("Saving "+this.props.title);

        // Store data into the local storage
        // Obtain all favourite news ids
        let newsIds = [];
        if (localStorage.getItem("newsIds")) {
            newsIds = JSON.parse(localStorage.getItem("newsIds")).data;
        }
        
        // Initialize
        if (newsIds.length === 0) {
            localStorage.setItem("newsIds", JSON.stringify({
                "data": [this.props.articleId]
            }));
        }
        else {
            newsIds.push(this.props.articleId)
            localStorage.setItem("newsIds", JSON.stringify({
                "data": newsIds
            }));
        }

        // Store the data into the responding block
        localStorage.setItem(this.props.articleId, JSON.stringify({"data": this.props}));
    }

    clickUnfav = () => {
        // Change the icon
        document.getElementById("news-article-fav-btn").style.display = "block";
        document.getElementById("news-article-unfav-btn").style.display = "none";
        // Notify
        toast("Removing - "+this.props.title);

        // Obtain all favourite news ids
        let newsIds = [];
        if (localStorage.getItem("newsIds")) {
            newsIds = JSON.parse(localStorage.getItem("newsIds")).data;
        }
        
        // Remove the article id from the list
        let index = -1;
        if ((index = newsIds.indexOf(this.props.articleId)) >= 0) {
            newsIds.splice(index, 1);
            console.log(newsIds);
            localStorage.setItem("newsIds", JSON.stringify({
                "data": newsIds
            }));
            localStorage.removeItem(this.props.articleId);
        }
    }

    clickExpandMore = () => {
        this.refs.desc.style.display = "block";
        this.refs.desc.style.maxHeight = "fit-content";
        this.refs.more.style.display = "none";
        this.refs.less.style.display = "block";

        // Move smoothly
        this.refs.less.scrollIntoView({
            behavior: "smooth"
        });
    }

    clickExpandLess = () => {
        this.refs.desc.style.display = "-webkit-box";
        this.refs.desc.style.maxHeight = MAX_LIMIT_HEIGHT;
        this.refs.more.style.display = "block";
        this.refs.less.style.display = "none";

         // Move smoothly
         this.refs.more.scrollIntoView({
            behavior: "smooth"
        });
    }

    /**
     * Function that is used to get the current computed style
     * @param {*} dom 
     * @param {*} style 
     */
    getStyle(dom, style) {
        return window.getComputedStyle(dom, null)[style];
    }
}