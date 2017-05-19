import "./auto-complete";
import "./header";
import { loadStyle } from "./auto-complete/load-style";

const autoCompleteStyles = require("./auto-complete/auto-complete.component.scss");

const headerStyles = require("./header/header.component.scss");

loadStyle(autoCompleteStyles, "ce-auto-complete");

loadStyle(headerStyles, "ce-header");