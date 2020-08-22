import React from "react";
import Switch from "react-switch";

// Import self-designed css style
import cssobj from "@/stylesheet/switch-cmpt.scss";
 
export default class SwitchCmpt extends React.Component {
    constructor(props) {
        super(props);

        // Initialize the state
        this.state = { checked: (this.props.default === "guardian"? true: false) };
        this.handleChange = this.handleChange.bind(this);
    }
 
    handleChange(checked) {
        this.setState({ checked });
        this.props.changeSource(checked);
    }
    
    // Rendert the switch component
    render() {
        return (
        <div id="switch-ctn" className={cssobj["switch-container"]}>
            <Switch 
                checked={this.state.checked}
                onChange={this.handleChange}
                onColor="#018efb"
                handleDiameter={25}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={25}
                width={50}
                className={["react-switch", cssobj["switch-btn"]].join(" ")}
                id="material-switch" 
            />
        </div>      
        );
    }
}