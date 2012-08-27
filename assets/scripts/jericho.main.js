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
    this.postContainerElements = goog.dom.getElementsByClass('post-container');
    this.headerSectionWrapperElement =
        goog.dom.getElement('header-section-wrapper');
    this.kLogoElement = goog.dom.getElement('k-logo');
    this.heroOverlayElement = goog.dom.getElement('hero-overlay');
    this.heroWrapperElement = goog.dom.getElement('hero-wrapper');
    this.heroImageElement = goog.dom.getElement('hero-image');
    this.contentSectionWrapperElement =
        goog.dom.getElement('content-section-wrapper');
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
    var index = 0;
    var length = null;

    // goog.events.listen(
    //     window,
    //     goog.events.EventType.RESIZE,
    //     this.resizeWindowCallback,
    //     false,
    //     this
    // );

    goog.events.listen(
        this.heroWrapperElement,
        goog.events.EventType.MOUSEOVER,
        this.heroMouseoverCallback,
        false,
        this
    );

    goog.events.listen(
        this.heroWrapperElement,
        goog.events.EventType.MOUSEOUT,
        this.heroMouseoutCallback,
        false,
        this
    );

    length = this.postContainerElements.length;
    for (index = 0; index < length; index++) {
        goog.events.listen(
            this.postContainerElements[index],
            goog.events.EventType.CLICK,
            this.postClickCallback,
            false,
            this
        );

        goog.events.listen(
            this.postContainerElements[index],
            goog.events.EventType.MOUSEOVER,
            this.postMouseoverCallback,
            false,
            this
        );

        goog.events.listen(
            this.postContainerElements[index],
            goog.events.EventType.MOUSEOUT,
            this.postMouseoutCallback,
            false,
            this
        );
    }
};

/**
 * The callback when the hero wrapper has a mouse over event.
 * @param {goog.events.BrowserEvent} e The event fired.
 */
jericho.Main.prototype.heroMouseoverCallback = function(e) {
    console.log('mouseover', e);
    goog.style.setStyle(this.heroWrapperElement, 'display', 'block');
};

/**
 * The callback when the hero wrapper has a mouse out event.
 * @param {goog.events.BrowserEvent} e The event fired.
 */
jericho.Main.prototype.heroMouseoutCallback = function(e) {
    console.log('mouseout', e);
    goog.style.setStyle(this.heroWrapperElement, 'display', 'none');
};

/**
 * The callback when a post has a click event.
 * @param {goog.events.BrowserEvent} e The event fired.
 */
jericho.Main.prototype.postClickCallback = function(e) {
    console.log('click', e);
    // var postActionsElement =
    //     goog.dom.getElementByClass('post-actions', e.currentTarget);

    // goog.style.setStyle(postActionsElement, 'display', 'block');
    this.selectPost(e.currentTarget);
};

/**
 * The callback when a post has a mouse over event.
 * @param {goog.events.BrowserEvent} e The event fired.
 */
jericho.Main.prototype.postMouseoverCallback = function(e) {
    // console.log('mouseover', e);
    // var postActionsElement =
    //     goog.dom.getElementByClass('post-actions', e.currentTarget);

    // goog.style.setStyle(postActionsElement, 'display', 'block');

    this.addClass(e.currentTarget, 'activity');
};

/**
 * The callback when a post has a mouse out event.
 * @param {goog.events.BrowserEvent} e The event fired.
 */
jericho.Main.prototype.postMouseoutCallback = function(e) {
    // console.log('mouseout', e);
    // var postActionsElement =
    //     goog.dom.getElementByClass('post-actions', e.currentTarget);
    // var postInputFormElement =
    //     goog.dom.getElementByClass('post-input-form', e.currentTarget);
    // goog.style.setStyle(postActionsElement, 'display', 'none');
    // goog.style.setStyle(postInputFormElement, 'display', 'none');

    this.removeClass(e.currentTarget, 'activity');
};

/**
 * Adds a class to a dom element.
 * @param {object} element the dom element to work on.
 * @param {string} className the class to add.
 */
jericho.Main.prototype.addClass = function(element, className) {
    if (goog.dom.classes.has(element, className)) {
        return;
    }
    goog.dom.classes.add(element, className);
};

/**
 * Removes a class to a dom element.
 * @param {object} element the dom element to work on.
 * @param {string} className the class to remove.
 */
jericho.Main.prototype.removeClass = function(element, className) {
    if (!goog.dom.classes.has(element, className)) {
        return;
    }
    goog.dom.classes.remove(element, className);
};

/**
 * Select a given post from the post container.
 * @param {element} container The post container.
 */
jericho.Main.prototype.selectPost = function(container) {
    var postId = container.getAttribute('data-id');

    // var slideFromAnimation = new goog.fx.dom.SlideFrom(
    //     agad.cslider,
    //     [activePos, 5],
    //     agad.CHANGE_QUESTION_SPEED,
    //     goog.fx.easing.easeOut
    // );
    // slideFromAnimation.play();
    // Scroll selected post to the top
    // Show the correct amount of posts underneath
    // Update hero image
    var heroImageNewElement = goog.dom.getElementByClass('hero-image', container);
    var heroImage = {
        'name': heroImageNewElement.getAttribute('data-name'),
        'src': heroImageNewElement.getAttribute('data-src'),
        'height': heroImageNewElement.getAttribute('data-height'),
        'width': heroImageNewElement.getAttribute('data-width')
    };
    var headerHeight = (parseInt(heroImage.height) + 85);
    var headerWidth = parseInt(heroImage.width);
    var logoPadding = (((1070 - parseInt(heroImage.width)) / 2) - 94 - 40);
    var heroOverlayPadding =
        (((1070 - parseInt(heroImage.width)) / 2) - 40);
    goog.style.setStyle(
        this.headerSectionWrapperElement,
        'height',
        headerHeight + 'px'
    );
    goog.style.setStyle(
        this.kLogoElement,
        'left',
        logoPadding + 'px'
    );
    goog.style.setStyle(
        this.heroOverlayElement,
        'right',
        heroOverlayPadding + 'px'
    );
    goog.style.setStyle(
        this.heroWrapperElement,
        'width',
        headerWidth + 'px'
    );
    goog.style.setStyle(
        this.contentSectionWrapperElement,
        'margin-top',
        headerHeight + 'px'
    );
    this.heroOverlayElement.innerHTML = heroImage.name;
    this.heroImageElement.src = heroImage.src;

    // Update previous / next page buttons
};

/**
 * Start the app, only enable in compiled mode.
 */
// var main = new jericho.Main();
