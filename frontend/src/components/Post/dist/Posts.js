"use strict";
exports.__esModule = true;
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var free_regular_svg_icons_1 = require("@fortawesome/free-regular-svg-icons");
var moment_1 = require("moment");
var react_bootstrap_1 = require("react-bootstrap");
var react_1 = require("react");
var Post = function (props) {
    moment_1["default"].locale('en');
    var _a = react_1.useState(false), likeClicked = _a[0], setLikeClicked = _a[1];
    var _b = react_1.useState(props.postData[props.pid].likes), likes = _b[0], setLikes = _b[1];
    var _c = react_1.useState(false), commentClicked = _c[0], setCommentClicked = _c[1];
    var _d = react_1.useState(false), repostClicked = _d[0], setRepostClicked = _d[1];
    var onLikeClick = function () {
        if (likeClicked) {
            setLikes(likes - 1);
        }
        else {
            setLikes(likes + 1);
        }
        setLikeClicked(!likeClicked);
    };
    return (React.createElement(react_bootstrap_1.Card, { className: "my-1" },
        React.createElement(react_bootstrap_1.Card.Body, null,
            React.createElement(react_bootstrap_1.Card.Subtitle, null,
                React.createElement("p", { style: { display: "inline-block" } }, props.uname),
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { className: "mx-2", size: "xs", style: { display: "inline-block" }, icon: free_solid_svg_icons_1.faDotCircle }),
                React.createElement("p", { className: "text-secondary", style: { display: "inline-block", color: "secondary" } },
                    " ",
                    moment_1["default"](props.postData[props.pid].createdDate).format('LL'),
                    " ")),
            React.createElement(react_bootstrap_1.Card.Text, { className: "" }, props.postData[props.pid].content)),
        React.createElement(react_bootstrap_1.Card.Footer, { className: "py-0 my-0" },
            React.createElement(react_bootstrap_1.Row, { fluid: true },
                React.createElement(react_bootstrap_1.Col, { fluid: true }, likeClicked ? ([React.createElement(react_fontawesome_1.FontAwesomeIcon, { onClick: onLikeClick, size: "xs", style: { display: "inline-block" }, icon: free_solid_svg_icons_1.faHeart }), React.createElement("i", { style: { display: "inline-block" } }, likes)]) : ([React.createElement(react_fontawesome_1.FontAwesomeIcon, { onClick: onLikeClick, size: "xs", style: { display: "inline-block" }, icon: free_regular_svg_icons_1.faHeart }), React.createElement("i", { style: { display: "inline-block" } }, likes)])),
                React.createElement(react_bootstrap_1.Col, { fluid: true },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { size: "xs", style: { display: "inline-block" }, icon: free_solid_svg_icons_1.faComment }),
                    " ",
                    React.createElement("i", { style: { display: "inline-block" } }, props.postData[props.pid].comments.length)),
                React.createElement(react_bootstrap_1.Col, { fluid: true },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { size: "xs", style: { display: "inline-block" }, icon: free_solid_svg_icons_1.faRetweet }),
                    " ",
                    React.createElement("i", { style: { display: "inline-block" } }, props.postData[props.pid].reposts)),
                React.createElement(react_bootstrap_1.Col, { fluid: true },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { size: "xs", style: { display: "inline-block" }, icon: free_solid_svg_icons_1.faShare }))))));
};
exports["default"] = Post;
