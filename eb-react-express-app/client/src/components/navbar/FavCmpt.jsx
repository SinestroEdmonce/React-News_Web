import React from "react";
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import history from "@/components/History";

// Import self-designed css style
import cssobj from "@/stylesheet/fav-cmpt.scss";

export default class FavCmpt extends React.Component {
    constructor(props) {
        super(props);

        // Initialize the state
        this.state = {};
    }

    // Render favorite bookmark component
    render() {
        return (
            <div id="fav-ctn" className={cssobj["fav-bookmark-container"]}>
                <FaRegBookmark data-place="bottom" data-tip="Bookmark" id="inactive-fav-btn" className={cssobj["fav-bookmark"]}  onClick={this.clickFav} />
                <FaBookmark data-place="bottom" data-tip="Bookmark" id="active-fav-btn" className={cssobj["fav-bookmark-active"]} />
            </div>
        );
    }

    clickFav = () => {
        history.push({
            pathname: "/favorites"
        })
    }
}