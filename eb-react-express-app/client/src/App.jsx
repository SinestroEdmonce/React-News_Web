import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import MediaQuery from "react-responsive";
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import self-designed components
import NavbarCmpt from "./components/navbar/NavbarCmpt";
import SectionNewsBarCtnCmpt from "./components/SectionNewsBarCtnCmpt";
import SearchNewsCardCtnCmpt from "./components/SearchNewsCardCtnCmpt";
import DetailNewsArticleCtnCmpt from "./components/DetailNewsArticleCtnCmpt";
import FavNewsCardCtnCmpt from "./components/FavNewsCardCtnCmpt";

// Import self-designed css style
import cssobj from "@/stylesheet/app.scss";

// Globally configure the toast notify
// Toastify -> notify the "fav" or "unfav" operations
toast.configure({
    bodyClassName: cssobj["toast-container"],
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnVisibilityChange: true,
    draggable: false,
    pauseOnHover: true,
    transition: Zoom,
});

// The root component
export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "source": this.props.defaultSource
        };
    }

    // Render the rooter
    render() {
        return (
            <HashRouter>
                <MediaQuery query="(min-width: 992px)" >
                    <ReactTooltip effect="solid" className={cssobj["tooltip-container"]} />
                </MediaQuery>
                <NavbarCmpt 
                    changeSource={this.changeNewsSource.bind(this)}
                    defaultSource={this.props.defaultSource}
                />
                <Switch>
                    <Route exact path="/" component={(props) => {
                        return <SectionNewsBarCtnCmpt 
                                    {...props} 
                                    source={this.state.source} 
                                />
                    }} />
                    <Route path="/search" component={(props) => {
                        return <SearchNewsCardCtnCmpt 
                                    {...props} 
                                    keyword={props.location.search.substring(3)} 
                                    source={this.state.source}
                                />
                    }} />
                    <Route path="/article" component={(props) => {
                        return <DetailNewsArticleCtnCmpt
                                    {...props}
                                    articleId={props.location.search.substring(4)}
                                />
                    }} />
                    <Route path="/favorites" component={(props) => {
                        return <FavNewsCardCtnCmpt
                                    {...props}
                                    source={this.state.source}
                                />
                    }} />
                    <Route path="/:section" component={(props) => {
                        return <SectionNewsBarCtnCmpt 
                                    {...props} 
                                    source={this.state.source}
                                />
                    }} />
                </Switch>
            </HashRouter>
        );
    }

    changeNewsSource(status) {
        this.setState({
            "source": (status? "guardian": "nytimes")
        }, function () {
            localStorage.setItem("defaultSource", this.state.source);
        });   
    }

} 
