import "./auto-complete";
import "./header";
import { loadStyle } from "./auto-complete/load-style";

const autoCompleteStyles = require("./auto-complete/app.component.scss");

const headerStyles = require("./header/header.component.scss");

loadStyle(autoCompleteStyles, "ce-app");

loadStyle(headerStyles, "ce-header");