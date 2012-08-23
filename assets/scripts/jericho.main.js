// Copyright 2012 Google Inc. All Rights Reserved.

/**
* @fileoverview The object that will house all main functionality.
* @author gkoehl@nerdery.com (Gary Koehl)
*/

/**
 * Declare global namespace (jericho.Main).
 */
goog.provide('jericho.Main');

/**
 * Require closure dependencies.
 */
goog.require('goog.History');
goog.require('goog.Uri');
goog.require('goog.date');
goog.require('goog.dom');
goog.require('goog.dom.dataset');
goog.require('goog.dom.forms');
goog.require('goog.dom.selection');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.fx');
goog.require('goog.fx.AnimationQueue');
goog.require('goog.fx.dom');
goog.require('goog.history.Html5History');
goog.require('goog.net.cookies');
goog.require('goog.positioning');
goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.AnchoredViewportPosition');
goog.require('goog.positioning.ClientPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.style');
goog.require('goog.ui.AdvancedTooltip');
goog.require('goog.ui.Popup');
goog.require('goog.ui.Tooltip');
goog.require('userFacingGlobals');

/**
 * Initializes the object.
 * @constructor
 */
jericho.Main = function() {
    this.initDomElements();
    this.initVariables();
    this.assignHandlers();
};

/**
 * Initializes the dom elements to be used.
 */
jericho.Main.prototype.initDomElements = function() {
};

/**
 * Initializes the object variables.
 */
jericho.Main.prototype.initVariables = function() {
};

/**
 * Assigns the event handlers
 */
jericho.Main.prototype.assignHandlers = function() {
    // goog.events.listen(
    //     window,
    //     goog.events.EventType.RESIZE,
    //     this.resizeWindowCallback,
    //     false,
    //     this
    // );
};

/**
 * Start the app, only enable in compiled mode.
 */
// var main = new jericho.Main();
