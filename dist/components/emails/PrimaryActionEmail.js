"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimaryActionEmailHtml = exports.EmailTemplate = void 0;
const components_1 = require("@react-email/components");
const React = __importStar(require("react"));
const EmailTemplate = ({ actionLabel, buttonText, href, }) => {
    return (React.createElement(components_1.Html, null,
        React.createElement(components_1.Head, null),
        React.createElement(components_1.Preview, null, "The marketplace for high-quality digital goods."),
        React.createElement(components_1.Body, { style: main },
            React.createElement(components_1.Container, { style: container },
                React.createElement(components_1.Img, { src: `${process.env.NEXT_PUBLIC_SERVER_URL}/hippo-newsletter-sign-up.png`, width: '150', height: '150', alt: 'DigitalHippo', style: logo }),
                React.createElement(components_1.Text, { style: paragraph }, "Hi there,"),
                React.createElement(components_1.Text, { style: paragraph },
                    "Welcome to DigitalHippo, the marketplace for high quality digital goods. Use the button below to ",
                    actionLabel,
                    "."),
                React.createElement(components_1.Section, { style: btnContainer },
                    React.createElement(components_1.Button, { style: button, href: href }, buttonText)),
                React.createElement(components_1.Text, { style: paragraph },
                    "Best,",
                    React.createElement("br", null),
                    "The DigitalHippo team"),
                React.createElement(components_1.Hr, { style: hr }),
                React.createElement(components_1.Text, { style: footer }, "If you did not request this email, you can safely ignore it.")))));
};
exports.EmailTemplate = EmailTemplate;
const PrimaryActionEmailHtml = (props) => (0, components_1.render)(React.createElement(exports.EmailTemplate, Object.assign({}, props)), { pretty: true });
exports.PrimaryActionEmailHtml = PrimaryActionEmailHtml;
const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
};
const logo = {
    margin: '0 auto',
};
const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
};
const btnContainer = {
    textAlign: 'center',
};
const button = {
    padding: '12px 12px',
    backgroundColor: '#2563eb',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
};
const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
};
const footer = {
    color: '#8898aa',
    fontSize: '12px',
};
