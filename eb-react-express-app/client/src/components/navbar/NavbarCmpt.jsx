import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";

// Import react bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from "react-bootstrap";

// Import self-designed components
import SearchCmpt from "./SearchCmpt";
import SwitchCmpt from "./SwitchCmpt";
import FavCmpt from "./FavCmpt";
import history from "@/components/History";

// Import self-designed css style
import navbarCSS from "@/stylesheet/navbar-cmpt.scss";

// Navigation bar component
export default class NavBarCmpt extends React.Component {
    constructor(props) {
        super(props);

        // Initialize the state
        this.state = {
            "searchValue": null
        };
    }

    componentDidMount() {
        let curActiveLink = window.location.hash.split("#")[1].substring(1);
        curActiveLink = (curActiveLink === "")? "home": curActiveLink.toLowerCase();
        this.addrChangeHandler(curActiveLink);

        // Listen to the address transformation
        history.listen(location => {
            let curActiveLink = location.pathname.split("/")[1]+location.search;
            curActiveLink = (curActiveLink === ""? "home":curActiveLink.toLowerCase());
            this.addrChangeHandler(curActiveLink);
        });

    }

    // Render the results
    render() {
        return (
            <Navbar bg="light" variant="dark" expand="lg" className={navbarCSS["navbar-container"]} id="navbar-ctn">
                <SearchCmpt value={this.state.searchValue} />
                <Navbar.Toggle className={navbarCSS["navbar-toggle"]} aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Link ref="home" className={["nav-link", navbarCSS["link"]].join(" ")} to="/" >
                            Home
                        </Link>
                        <Link ref="world" className={["nav-link", navbarCSS["link"]].join(" ")} to="/World" >
                            World
                        </Link>
                        <Link ref="politics" className={["nav-link", navbarCSS["link"]].join(" ")} to="/Politics" >
                            Politics
                        </Link>
                        <Link ref="business" className={["nav-link", navbarCSS["link"]].join(" ")} to="/Business" >
                            Business
                        </Link>
                        <Link ref="technology" className={["nav-link", navbarCSS["link"]].join(" ")} to="/Technology" >
                            Technology
                        </Link>
                        <Link ref="sports" className={["nav-link", navbarCSS["link"]].join(" ")} to="/Sports" >
                            Sports
                        </Link>
                    </Nav>
                    <FavCmpt />
                    <span id="nytimes-ctn" className={navbarCSS["nytimes-container"]}>NYTimes</span>
                    <SwitchCmpt 
                        changeSource={this.props.changeSource}
                        default={this.props.defaultSource}
                    />
                    <span id="guardian-ctn" className={navbarCSS["guardian-container"]}>Guardian</span>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    addrChangeHandler = (addr) => {
        if (addr.includes("search")) {
            this.setState({
                "searchValue": addr.split("=")[1]
            }, () => {
                this.favDisactivated();
                this.linkActivated(addr);
            });
        }
        else {
            this.setState({
                "searchValue": null
            }, () => {
                if (addr.includes("favorites")) {
                    this.favActivated();
                }
                else {
                    this.favDisactivated();
                }

                this.linkActivated(addr);
            });
        }
    };

    favActivated = () => {
        const favInactiveBtn = document.getElementById("inactive-fav-btn");
        const favActiveBtn = document.getElementById("active-fav-btn");
        favActiveBtn.style.display = "block";
        favInactiveBtn.style.display = "none";
    }

    favDisactivated = () => {
        const favInactiveBtn = document.getElementById("inactive-fav-btn");
        const favActiveBtn = document.getElementById("active-fav-btn");
        favActiveBtn.style.display = "none";
        favInactiveBtn.style.display = "block";
    }

    // Link clicked handler
    linkActivated = (linkName) => {
        let refsArr = this.refs;
        // The variable that can judge whether the linkName is in the sections
        let isIn = false;
        Object.keys(this.refs).forEach(function (key) {
            if (key !== linkName) {
                let classes = refsArr[key].className.split(" ");
                if (classes.length > 2) {
                    refsArr[key].className = classes.slice(0, 2).join(" ");
                    refsArr[key].blur();
                }
            }
            else {
                let classes = refsArr[key].className.split(" ");
                if (classes.length === 2) {
                    refsArr[key].className = [refsArr[key].className, "active"].join(" ");
                }

                // Is in
                isIn = true;
            }
        });

        // Show or hide switch
        if (isIn) {
            this.showSwitch();
        }
        else {
            this.hideSwitch();
        }
    };

    hideSwitch = () => {
        let swCtn = document.getElementById("switch-ctn");
        let nytimesCtn = document.getElementById("nytimes-ctn");
        let guardianCtn = document.getElementById("guardian-ctn");

        const containers = [swCtn, nytimesCtn, guardianCtn];
        containers.forEach(function (item) {
            item.style.display = "none";
        });
    };

    showSwitch = () => {
        let swCtn = document.getElementById("switch-ctn");
        let nytimesCtn = document.getElementById("nytimes-ctn");
        let guardianCtn = document.getElementById("guardian-ctn");

        const containers = [swCtn, nytimesCtn, guardianCtn];
        containers.forEach(function (item) {
            item.style.display = "block";
        });;
    };
}