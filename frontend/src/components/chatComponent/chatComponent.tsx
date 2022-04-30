import NavComponent from "../navComponent/navComponent";
import "./chatComponent.css";
import { App as SendbirdApp } from 'sendbird-uikit';
import "sendbird-uikit/dist/index.css";
import { auth } from "../../firebase/firebase";

const ChatComponent = () => {
    return (
        <div>
            <div className="navcomp">
                <NavComponent/>
            </div>
            <div className="chatcomp">
                <SendbirdApp appId="BDFDFFE0-72A7-4552-8533-3730EAC39259" userId={auth.currentUser?.email || "demo-user"} />
            </div>
        </div>
    );
};

export default ChatComponent;