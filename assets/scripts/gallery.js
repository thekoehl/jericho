// Copyright 2012 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview This script fetches the list of gallery images from the
 * Google Photography Prize moderation app engine page and displays them on
 * the gallery page as a scrollable list.
 *
 * <pre>
 * var container = document.body;
 * var gallery = new photographyPrize.Gallery(container);
 * // ...
 * gallery.dispose();
 * </pre>
 *
 * @author ilmari@google.com (Ilmari Heikkinen)
 *
 */

goog.provide('photographyPrize.Gallery');

goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.net.Jsonp');
goog.require('goog.style');


/**
 * Gallery constructor takes a container element
 * as its parameter. The gallery is created on
 * the container element at gallery creation time.
 *
 * @param {Element} containerElement Container element for the gallery.
 * @constructor
 * @export
 */
photographyPrize.Gallery = function(containerElement) {
  /**
   * The container element for the gallery.
   * @type {Element}
   * @private
   */
  this.containerElement_ = containerElement;

  // State variables for the gallery

  /**
   * Current category object for the gallery.
   * Used to assert that we're only updating the gallery
   * with image objects belonging to the currently selected
   * category.
   *
   * @type {Object}
   * @private
   */
  this.currentCategory_ = null;

  /**
   * Currently loading gallery offset.
   * This moves up, then is followed by loadedOffset_
   * once the loading is complete.
   *
   * When the offsets are equal, the gallery is in
   * sync and we can load more images.
   *
   * @type {number}
   * @private
   */
  this.currentOffset_ = 0;

  /**
   * Currently loaded gallery offset.
   * Tracks behind currentOffset_ and matches
   * the number of image objects seen thus far in
   * the current category.
   *
   * @type {number}
   * @private
   */
  this.loadedOffset_ = -1;

  /**
   * Current category link element.
   * Used to toggle the 'current' className
   * for the category links.
   *
   * @type {Element}
   * @private
   */
  this.currentElem_ = null;

  this.createGallery_();
};
goog.exportSymbol('photographyPrize.Gallery', photographyPrize.Gallery);


/**
 * Removes the gallery and its event listeners from the document.
 */
photographyPrize.Gallery.prototype.dispose = function() {
  if (this.containerElement_) {
    this.containerElement_.removeChild(this.linkBarElement_);
    this.containerElement_.removeChild(this.galleryElement_);
    this.containerElement_.removeChild(this.spinnerElement_);
    this.containerElement_ = null;
  }
  goog.events.unlistenByKey(this.scrollListenerKey);
};


/**
 * Array of category objects for the gallery category link bar.
 * Category objects are {tag: string, name: string} where
 * tag is the query tag for the category and the name is the
 * category name to show.
 *
 * @type {Array.<Object>}
 * @const
 */
photographyPrize.Gallery.Categories = [
  {tag: '', name: 'All'},
  {tag: '#birdpoker', name: 'BirdPoker'},
  {tag: '#grasstuesday', name: 'GrassTuesday'},
  {tag: '#wildlifewednesday', name: 'WildlifeWednesday'}
];


/**
 * The default URL from which to load the image lists.
 * @type {string}
 * @const
 */
photographyPrize.Gallery.IMAGE_LIST_URL =
    '/jsonp';


/**
 * String for the gallery "View album" link.
 * @type {string}
 * @desc "View album" message on each gallery photo.
 * @const
 */
photographyPrize.Gallery.MSG_VIEW_ALBUM = goog.getMsg('View album');


/**
 * String to show when scrolled to the end of the image stream.
 * @type {string}
 * @desc Message shown when there are no more images to load in a non-empty
 *       photo category.
 * @const
 */
photographyPrize.Gallery.MSG_THE_END = goog.getMsg('End of gallery');


/**
 * String to show when scrolled to show #MAX_IMAGE_COUNT images in the image
 * stream.
 * @type {string}
 * @desc Message shown when scrolled down enough to reach the gallery
 *       image count limit.
 * @const
 */
photographyPrize.Gallery.MSG_MAX_IMAGES_REACHED =
    goog.getMsg('End of gallery');


/**
 * String to show when the image stream is empty.
 * @type {string}
 * @desc Message shown when there are no images in a photo category.
 * @const
 */
photographyPrize.Gallery.MSG_NO_IMAGES =
    goog.getMsg('No images found.');


/**
 * Maximum number of images to show.
 * @type {number}
 * @const
 */
photographyPrize.Gallery.MAX_IMAGE_COUNT = 100;


/**
 * Number of images to load initially.
 * @type {number}
 * @const
 */
photographyPrize.Gallery.INITIAL_LOAD_COUNT = 10;


/**
 * Number of images to load when scrolling to the bottom of the page.
 * @type {number}
 * @const
 */
photographyPrize.Gallery.SCROLL_LOAD_COUNT = 5;


/**
 * Maximum size of the images to load. Images are scaled down to fit a
 * bounding box with #MAX_IMAGE_SIZE x #MAX_IMAGE_SIZE dimensions.
 * @type {number}
 * @const
 */
photographyPrize.Gallery.MAX_IMAGE_SIZE = 935;


/**
 * Creates the Google Photography Prize gallery inside the galleryContainer
 * element and sets up an event handler for the window scroll events.
 *
 * @private
 */
photographyPrize.Gallery.prototype.createGallery_ = function() {
  this.linkBarElement_ = goog.dom.createDom('div', 'category-buttons');
  this.galleryElement_ = goog.dom.createDom('div', 'gallery');
  this.spinnerElement_ = goog.dom.createDom('div', 'gallery-spinner');
  this.containerElement_.appendChild(this.linkBarElement_);
  this.containerElement_.appendChild(this.galleryElement_);
  this.containerElement_.appendChild(this.spinnerElement_);

  this.categories_ = photographyPrize.Gallery.Categories;
  this.categoryIndex_ = {};
  this.categoryLinks_ = {};

  for (var i = 0; i < this.categories_.length; i++) {
    var cat = this.categories_[i];
    this.categoryIndex_[this.getCategoryFragment_(cat)] = cat;

    var link = this.createCategoryLink_(cat);
    this.setCategoryLink_(cat, link);
    this.linkBarElement_.appendChild(link);
  }

  var hash = document.location.hash.toString().replace(/#/, '');
  var category = this.categoryIndex_[hash] || this.categories_[0];
  if (category) {
    this.loadCategory_(category);
  }

  this.scrollListenerKey = goog.events.listen(
      window, goog.events.EventType.SCROLL, this.handleScroll_, false, this);
};


/**
 * Get category link element for the category object
 *
 * @param {Object} category Category object to search for.
 * @return {Element} Category link for the category object.
 * @private
 */
photographyPrize.Gallery.prototype.getCategoryLink_ = function(category) {
  return this.categoryLinks_[this.getCategoryFragment_(category)];
};


/**
 * Set category link element for the category object
 *
 * @param {Object} category Category object to set for.
 * @param {Element} link Category link for the category object.
 * @private
 */
photographyPrize.Gallery.prototype.setCategoryLink_ = function(category, link) {
  this.categoryLinks_[this.getCategoryFragment_(category)] = link;
};


/**
 * Loads image list from the App Engine page and sets the callback function
 * for the image list load completion.
 *
 * @param {string} tag Fetch images tagged with this.
 * @param {number} limit How many images to fetch.
 * @param {number} offset Offset for the image list.
 * @param {function(Array.<Object>=)} callback Function to call
 *        with the loaded image list.
 * @private
 */
photographyPrize.Gallery.prototype.loadImages_ =
    function(tag, limit, offset, callback) {
  var jsonp = new goog.net.Jsonp(
      new goog.Uri(photographyPrize.Gallery.IMAGE_LIST_URL));
  jsonp.send({'tag': tag, 'limit': limit, 'offset': offset}, callback);
};


/**
 * Displays images in imageList by putting them inside the section element.
 * Edits image urls to scale them down to imageSize x imageSize bounding
 * box.
 *
 * @param {Array.<Object>} imageList List of image objects to show. Retrieved
 *                                   by loadImages.
 * @return {Element} The generated image list container element.
 * @private
 */
photographyPrize.Gallery.prototype.displayImages_ =
    function(imageList) {
  var seen = {};
  var items = [];
  var sz = photographyPrize.Gallery.MAX_IMAGE_SIZE;
  // find the images and albums from the image list
  for (var j = 0; j < imageList.length; j++) {
    var obj = imageList[j];
    var item = null;
    var album = null;
    var imageObj = null;
    if (obj['object'] && obj['object']['attachments']) {
      var atts = obj['object']['attachments'];
      for (var i = 0; i < atts.length; i++) {
        if (!item && atts[i] && atts[i]['fullImage']) {
          item = atts[i]['fullImage'];
          imageObj = atts[i];
          if (album) {
            break;
          }
        }
        if (!album && atts[i]['objectType'] == 'photo-album') {
          album = atts[i];
          if (item) {
            break;
          }
        }
      }
    }

    // reject items without image and reject dupes
    // change image urls to use imageSize scaling
    if (item && album) {
      item['url'] = item['url'].replace(/\/s0-d\/([^/]+)$/, '/s' + sz + '/$1');
      if (!item['url'].match(/\/s\d+\/[^/]+$/)) {
        item['url'] = item['url'].replace(/\/([^/]+)$/, '/s' + sz + '/$1');
      }
      item['url'] = item['url'].replace(/^https?:/i, '');
      if (!seen[item['url']]) {
        seen[item['url']] = true;
        items.push({item: obj, image: item, album: album, imageObj: imageObj});
      }
    }
  }

  // Go through the image list and create a gallery photo element for each
  // image.
  var category = goog.dom.createDom('div', {className: 'category'});
  for (var k = 0; k < items.length; k++) {
    var fullObj = items[k];
    var plusone = goog.dom.createDom('g:plusone');
    plusone.setAttribute('href', fullObj.imageObj['url']);
    plusone.setAttribute('size', 'standard');
    plusone.setAttribute('annotation', 'none');
    var photo =
    goog.dom.createDom('div', {className: 'gallery-photo'},
        goog.dom.createDom('a', {
              href: fullObj.item['url'],
              className: 'gallery-image-link',
              target: '_new'
            },
            goog.dom.createDom('img',
                {src: fullObj.image['url'], className: 'gallery-image'})
        ),
        goog.dom.createDom('div', {className: 'user-info'},
            goog.dom.createDom('span', {className: 'user-image-container'},
                goog.dom.createDom('a', {
                      href: fullObj.item['actor']['url'] + '/about',
                      className: 'user-image-link',
                      target: '_new'
                    },
                    goog.dom.createDom('img', {
                          src: fullObj.item['actor']['image']['url'].
                               replace(/^https?:/i, ''),
                          className: 'user-image'
                    })
                )
            ),
            goog.dom.createDom('span', {className: 'user-name'},
                goog.dom.createDom('a', {
                      href: fullObj.item['actor']['url'] + '/about',
                      target: '_new'
                    },
                    fullObj.item['actor']['displayName'])
                ),
            goog.dom.createDom('span', {className: 'album-link'},
                goog.dom.createDom('a',
                    {href: fullObj.album['url'], target: '_new'},
                    photographyPrize.Gallery.MSG_VIEW_ALBUM)
            ),
            goog.dom.createDom('span',
                {className: 'plusone'}, plusone)
        )
    );
    category.appendChild(photo);
  }
  this.galleryElement_.appendChild(category);
  return category;
};


/**
 * Creates a category link for the category object.
 * {tag: queryTag, name: categoryName}
 *
 * @param {Object} categoryObj Category object.
 * @return {Element} Category link element for the category object.
 * @private
 */
photographyPrize.Gallery.prototype.createCategoryLink_ =
    function(categoryObj) {
  var category = this.getCategoryFragment_(categoryObj);
  var link = goog.dom.createDom('a', {
    href: '#' + category,
    id: category + '-button',
    className: 'category-link'
  }, categoryObj.name);
  goog.events.listen(
      link,
      goog.events.EventType.CLICK,
      function(ev) {
        this.loadCategory_(categoryObj);
        ev.preventDefault();
      }, false, this);
  return link;
};


/**
 * Builds the category fragment string by lowercasing the category name
 * and removing all non-alphanumeric characters.
 *
 * @param {Object} category Category object to get the fragment of.
 * @return {string} Category fragment string.
 * @private
 */
photographyPrize.Gallery.prototype.getCategoryFragment_ = function(category) {
  return category.name.toLowerCase().replace(/[^a-z0-9]/g, '');
};


/**
 * Load a new category into the gallery. Replaces current gallery contents
 * with the category content. Replaces document.location with category
 * fragment.
 *
 * @param {Object} category Category object to load.
 * @private
 */
photographyPrize.Gallery.prototype.loadCategory_ = function(category) {
  if (this.currentElem_) {
    goog.dom.classes.remove(this.currentElem_, 'current');
  }
  var elem = this.getCategoryLink_(category);
  if (elem) {
    this.currentElem_ = elem;
    goog.dom.classes.add(this.currentElem_, 'current');
  }

  this.currentCategory_ = category;
  this.currentOffset_ = photographyPrize.Gallery.INITIAL_LOAD_COUNT;
  this.loadedOffset_ = 0;
  this.clearGallery_();
  this.loadImageList_(category, photographyPrize.Gallery.INITIAL_LOAD_COUNT, 0);
  document.location.replace('#' + this.getCategoryFragment_(category));
};


/**
 * Clear the gallery element.
 * @private
 */
photographyPrize.Gallery.prototype.clearGallery_ = function() {
  this.endMessagePrinted_ = false;
  goog.dom.removeChildren(this.galleryElement_);
};


/**
 * Show the loading spinner for the gallery.
 * @private
 */
photographyPrize.Gallery.prototype.showSpinner_ = function() {
  goog.style.showElement(this.spinnerElement_, true);
};


/**
 * Hide the loading spinner for the gallery.
 * @private
 */
photographyPrize.Gallery.prototype.hideSpinner_ = function() {
  goog.style.showElement(this.spinnerElement_, false);
};


/**
 * Load and display the images belonging to category.
 *
 * @param {Object} category Category object {tag: string, name: string} to use.
 * @param {number} count Number of images to load.
 * @param {number} offset Image list offset from where to start loading.
 * @private
 */
photographyPrize.Gallery.prototype.loadImageList_ =
    function(category, count, offset) {
  this.showSpinner_();
  this.loadImages_(category.tag, count, offset,
                   goog.bind(this.loadImagesHandler_, this, category, offset));
};


/**
 * Handler for loadImages callback. The handler adds
 * images to the gallery element and displays potential end of stream messages.
 *
 * @param {Object} category Category for the generated callback.
 * @param {number} offset Offset for the image load.
 * @param {Array.<Object>} images The list of images.
 * @private
 */
photographyPrize.Gallery.prototype.loadImagesHandler_ =
    function(category, offset, images)
{
  if (this.currentCategory_.tag != category.tag) {
    return;
  }
  // Some versions of IE parse [1,] as [1,null]
  if (images.length > 0 &&
      images[images.length - 1] == null) {
    images = images.slice(0, -1);
  }
  this.loadedOffset_ += images.length;
  this.hideSpinner_();
  if (images.length > 0) {
    var newImages =
      this.displayImages_(images);
    if (window['gapi'] &&
        window['gapi']['plusone'] &&
        typeof window['gapi']['plusone']['go'] == 'function') {
      window['gapi']['plusone']['go'](newImages);
    }
  }
  if (images.length == 0 && offset == 0) {
    this.showEndMessage_(photographyPrize.Gallery.MSG_NO_IMAGES);
  } else if (this.loadedOffset_ != this.currentOffset_) {
    this.showEndMessage_(photographyPrize.Gallery.MSG_THE_END);
  }
};


/**
 * Adds an end message to the gallery if one isn't shown already.
 *
 * @param {string} msg The end message.
 * @private
 */
photographyPrize.Gallery.prototype.showEndMessage_ = function(msg) {
  if (!this.endMessagePrinted_) {
    this.galleryElement_.appendChild(goog.dom.createDom('p', 'theend', msg));
    this.endMessagePrinted_ = true;
  }
};


/**
 * Handle window scroll events by loading new images when the scroll reaches
 * the last screenful of the page.
 *
 * @param {goog.events.BrowserEvent} ev The scroll event.
 * @private
 */
photographyPrize.Gallery.prototype.handleScroll_ = function(ev) {
  var scrollY = goog.dom.getDocumentScroll().y;
  var height = goog.dom.getViewportSize().height;
  var documentHeight = goog.dom.getDocumentHeight();
  if (scrollY + height >= documentHeight - height / 2) {
    this.tryLoadingNextImages_();
  }
};


/**
 * Try loading the next batch of images objects from the server.
 * Only fires if we have already loaded the previous batch.
 *
 * @private
 */
photographyPrize.Gallery.prototype.tryLoadingNextImages_ = function() {
  if (this.currentOffset_ == this.loadedOffset_) {
    var offset = this.currentOffset_;
    if (offset >= photographyPrize.Gallery.MAX_IMAGE_COUNT) {
      this.showEndMessage_(photographyPrize.Gallery.MSG_MAX_IMAGES_REACHED);
    } else {
      this.currentOffset_ += photographyPrize.Gallery.SCROLL_LOAD_COUNT;
      this.loadImageList_(this.currentCategory_,
                          photographyPrize.Gallery.SCROLL_LOAD_COUNT, offset);
    }
  }
};
