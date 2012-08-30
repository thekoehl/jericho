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
goog.require('goog.net.XhrIo');
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
    this.listItemContainerElements =
        goog.dom.getElementsByClass('list-item-container');
    this.headerSectionWrapperElement =
        goog.dom.getElement('header-section-wrapper');
    this.kLogoElement = goog.dom.getElement('k-logo');
    this.heroOverlayElement = goog.dom.getElement('hero-overlay');
    this.heroWrapperElement = goog.dom.getElement('hero-wrapper');
    this.heroImageElement = goog.dom.getElement('hero-image');
    this.previousPageElement = goog.dom.getElement('previous-page');
    this.nextPageElement = goog.dom.getElement('next-page');
    this.postSearchFormElement = goog.dom.getElement('post-search-form');
    this.postSearchElement = goog.dom.getElement('post-search');
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

    goog.events.listen(
        window,
        goog.events.EventType.SCROLL,
        this.scrollCallback,
        false,
        this
    );

    // Equivalent to jquery.live()
    // goog.events.listen(
    //     document.body,
    //     goog.events.EventType.CLICK,
    //     function(e) {
    //         var realEvent = e.event_;
    //         var el = e.target;

    //         if (el.tagName.toLowerCase() == 'a' && (href matches pattern)) {
    //             // ...
    //         }
    //     }
    // );


    // goog.events.listen(
    //     window,
    //     goog.events.EventType.RESIZE,
    //     this.resizeWindowCallback,
    //     false,
    //     this
    // );

    // goog.events.listen(
    //     this.heroWrapperElement,
    //     goog.events.EventType.MOUSEOVER,
    //     this.heroMouseoverCallback,
    //     false,
    //     this
    // );

    // goog.events.listen(
    //     this.heroWrapperElement,
    //     goog.events.EventType.MOUSEOUT,
    //     this.heroMouseoutCallback,
    //     false,
    //     this
    // );

    if (this.previousPageElement != null) {
        goog.events.listen(
            this.previousPageElement,
            goog.events.EventType.CLICK,
            this.previousPageCallback,
            false,
            this
        );
    }

    if (this.nextPageElement != null) {
        goog.events.listen(
            this.nextPageElement,
            goog.events.EventType.CLICK,
            this.nextPageCallback,
            false,
            this
        );
    }

    if (this.postContainerElements != null) {
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
                this.itemMouseoverCallback,
                false,
                this
            );

            goog.events.listen(
                this.postContainerElements[index],
                goog.events.EventType.MOUSEOUT,
                this.itemMouseoutCallback,
                false,
                this
            );
        }
    }

    if (this.listItemContainerElements != null) {
        length = this.listItemContainerElements.length;
        for (index = 0; index < length; index++) {
            // goog.events.listen(
            //     this.listItemContainerElements[index],
            //     goog.events.EventType.CLICK,
            //     this.listItemClickCallback,
            //     false,
            //     this
            // );

            goog.events.listen(
                this.listItemContainerElements[index],
                goog.events.EventType.MOUSEOVER,
                this.itemMouseoverCallback,
                false,
                this
            );

            goog.events.listen(
                this.listItemContainerElements[index],
                goog.events.EventType.MOUSEOUT,
                this.itemMouseoutCallback,
                false,
                this
            );
        }
    }
};

jericho.Main.prototype.scrollCallback = function(e) {
    var scrollY = goog.dom.getDocumentScroll().y;
    var height = goog.dom.getViewportSize().height;
    // var headerHeight =
    //     goog.style.getSize(this.headerSectionWrapperElement).height
    // var totalHeight = height + headerHeight;
    var documentHeight = goog.dom.getDocumentHeight();
    console.log((scrollY + height), (documentHeight - height / 2));
        if (scrollY + height >= documentHeight - height / 2) {
        var xhrHandler = new goog.net.XhrIo();
        var queryData = new goog.Uri.QueryData();
        queryData.add('test', 'val1');
        queryData.add('test2', 'val2');
        var url = '/list-json?' + queryData.toString();
        goog.net.XhrIo.send(
            url,
            this.listJsonCallback
        );
    }
};

jericho.Main.prototype.listJsonCallback = function(e) {
    var xhrHandler = (e.target);
    if (xhrHandler.isSuccess()) {
        var responseJson = xhrHandler.getResponseJson();
        if (responseJson.status == 1) {
            // Success! The response code was 200, 204, or 304.
            console.log(responseJson);
        }
        else {
            console.log(responseJson);
            // Problem hitting the url from the proxy
        }
    }
    else if (xhrHandler.getLastErrorCode() == goog.net.ErrorCode.ABORT) {
        // abort() called.
    }
    else if (xhrHandler.getLastErrorCode() == goog.net.ErrorCode.TIMEOUT) {
        // Timeout exceeded.
    } else {
        // Some other error occurred.
        // Inspecting the value of xhrHandler.getStatus() is
        // a good place to start to determine the source of the error.
    }
};

/**
 * The callback when the hero wrapper has a mouse over event.
 * @param {goog.events.BrowserEvent} e The event fired.
 */
jericho.Main.prototype.heroMouseoverCallback = function(e) {
    console.log('mouseover', e);
    goog.style.setStyle(this.heroOverlayElement, 'display', 'block');
};

/**
 * The callback when the hero wrapper has a mouse out event.
 * @param {goog.events.BrowserEvent} e The event fired.
 */
jericho.Main.prototype.heroMouseoutCallback = function(e) {
    console.log('mouseout', e);
    goog.style.setStyle(this.heroOverlayElement, 'display', 'none');
};

/**
 * The callback for the previous page click event.
 * @param {goog.events.BrowserEvent} e The event fired.
 */
jericho.Main.prototype.previousPageCallback = function(e) {

};

/**
 * The callback for the next page click event.
 * @param {goog.events.BrowserEvent} e The event fired.
 */
jericho.Main.prototype.nextPageCallback = function(e) {

};

/**
 * The callback when a post has a click event.
 * @param {goog.events.BrowserEvent} e The event fired.
 */
jericho.Main.prototype.postClickCallback = function(e) {
    this.selectPost(e.currentTarget);
};

/**
 * The callback when an item has a mouse over event.
 * @param {goog.events.BrowserEvent} e The event fired.
 */
jericho.Main.prototype.itemMouseoverCallback = function(e) {
    this.addClass(e.currentTarget, 'hover');
};

/**
 * The callback when an item has a mouse out event.
 * @param {goog.events.BrowserEvent} e The event fired.
 */
jericho.Main.prototype.itemMouseoutCallback = function(e) {
    this.removeClass(e.currentTarget, 'hover');
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
    // goog.style.setStyle(
    //     this.heroOverlayElement,
    //     'right',
    //     heroOverlayPadding + 'px'
    // );
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
    // this.heroOverlayElement.innerHTML = heroImage.name;
    this.heroImageElement.src = heroImage.src;

    // Update previous / next page buttons
};

/**
 * Start the app, only enable in compiled mode.
 */
// var main = new jericho.Main();
