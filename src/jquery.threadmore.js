/**
 * Title:       jquery.threadmore.js
 * Description: jQuery plugin to view and hide comments on a page    
 * Author:      Matthew Norris
 */

 // Anonymous function wrap to avoid conflicts
 (function($) {
 	
	/***************************************************************************
     * Threadmore
     **************************************************************************/
    
	// Private helper functions
	
	/**
	 * Shows or hides the 'hide control' depending on the current index. If the 
	 * current index is equal to inital visible item count, hide; 
	 * otherwise, show. 
	 * 
	 *  @param {Object} $control 
	 *  @param {Object} showIndex
	 *  @param {Object} initVisible
	 */
	function toggleHideControl($control, showIndex, initVisible) {
		if (showIndex == initVisible) {
			$control.children(':not(:first)').hide();
		} else {
			$control.children(':not(:first)').show();
		}
	}
	
	/**
	 * Given the number of hidden items, inactivates or activates the 
	 * show control.
	 *  
	 * @param {Object} $control The control to manipulate
	 * @param {Object} hidden The number of hidden items
	 * @param {Object} aCTA Active Call To Action class
	 * @param {Object} iCTA Inactive Call To Action class
	 */
	function toggleShowControl($control, hidden, aCTA, iCTA) {
		if (hidden <= 0) {
			$control
			     .children('a:first')
				 .removeClass(aCTA)
				 .addClass(iCTA)
				 .click(function() {
				 	return false;
				 });
		} else {
			$control
			     .children('a:first')
				 .removeClass(iCTA)
				 .addClass(aCTA);
		}
	}
	
	/**
	 * Updates the text of the show control and returns the new count of 
	 * hidden items. 
	 * 
	 * @param {Object} $control The control to manipulate
	 * @param {Object} total Count of all items
	 * @param {Object} currIndex Current index
	 * @param {Object} disShow Display text for show control 
	 */
	function updateShowControl($control, total, currIndex, disShow) {
		// If the difference between teh total items and current index is 
		// negative, bump it up to zero, since we really have 0 items left, 
		// not -N items left. 
		var dItems = total - currIndex; 
		var cHidden = dItems < 0 ? 0 : dItems; 
		
		// Update the control's text. 
		$control.children('a:first').text(cHidden + ' ' + disShow);
		
		return cHidden; 
	}
	
	// Plugin itself
	
	$.fn.extend({
		threadmore: function(options) {
			
			/**
			 * Given a block of elements, provides the ability to show and 
			 * hide nested elements. This is useful for comment threads. 
			 * 
			 * See the page below for variable notation. 
			 * @see: http://www.joelonsoftware.com/articles/Wrong.html
			 * 
			 * c = count
			 * css = CSS classname
			 * a = active
			 * i = inactive
			 * t = text
			 */
			
			var defaults = {
				initVisible: 2, // Number of items to shown initially
				toShow: 0, // Number of items shown each click; if 0, show ALL
				toHide: 0, // Number of items hidden each click; if 0, hide ALL
				aCTA: "cta-active", // Class name for "call to action"
				iCTA: "cta-inactive", // Class name for inactivated CTA
				disShow: "more", // Control's text to show more 
				disHide: "less", // Control's text to show less
				elType: "li" // Container's repeated element type (li, section, etc.)
			}
			
			var opts = $.extend(defaults, options);
			
			return this.each(function() {
				var $container = $(this); // the given container
				var $items = $("> " + opts.elType, $container); // its children 
				
				// If there are items to show, set up the controls. 
				var cHidden = $items.length - opts.initVisible; 
				if (cHidden > 0) {
					// If toShow or toHide are zero or less, show or hide 
					// ALL remaining items. 
					var cShow = opts.toShow > 0 ? opts.toShow : cHidden; 
					var cHide = opts.toHide > 0 ? opts.toHide : cHidden; 
					
					// Create a new list item: the control for showing & hiding.
					var $control = $container
					   .append('<' + opts.elType + '><a>' + cHidden + ' ' + 
					       opts.disShow + '</a><span> | </span><a>' + 
						   opts.disHide + '</a></' + opts.elType + '>')
					   .children(opts.elType + ':last');
					   
					var showIndex = 0; // start the index at the beginning
					
					// Attach the proper class and function to the control's 
					// "show more" link. 
					$control
					   .children('a:first')
					   .addClass(opts.aCTA)
					   .click(function() {
					       $items
						      .slice(showIndex, showIndex + cShow)
							  .animate({opacity: 'show', height: 'show'}, 'slow');
						   showIndex += cShow;
						   
						   cHidden = updateShowControl(
						      $control, 
							  $items.length, 
							  showIndex, 
							  opts.disShow);
							  
						  toggleHideControl(
						      $control, 
							  showIndex, 
							  opts.initVisible);
							  
						  // If there are no more items to show, disable the 
						  // control to show more. 
						  toggleShowControl(
						      $control, 
							  cHidden, 
							  opts.aCTA, 
							  opts.iCTA);
							  
						  $control.children('a:last')
						      .addClass(opts.aCTA)
							  // Eliminate "jumps" during animation: 
							  // http://bit.ly/hUQ7Lt 
							  .unbind('click').bind('click', function() {
							  	// Check that the items you wish to hide do not
								// go beyond the initial items shown. 
								currIndex = showIndex; 
								if (showIndex - cHide < opts.initVisible) {
									showIndex = opts.initVisible; 
								} else {
									showIndex = showIndex - cHide; 
								}
								
								// If the indexes move beyond the list; this can 
								// happen when toShow and toHide are different 
								// numbers. 
								if (currIndex > $items.length) {
									showIndex = $items.length - cHide;
									currIndex = $items.length; 
								}
								
								$items.slice(showIndex, currIndex)
								    .animate({opacity: 'hide', height: 'hide'}, 'slow');
									
								cHidden = updateShowControl(
								    $control, 
									$items.length, 
									showIndex, 
									opts.disShow);
									
								toggleShowControl($control, cHidden, opts.CTA, 
								    opts.iCTA);
									
								toggleHideControl($control, showIndex, 
								    opts.initVisible);
							  }); 
					   });
					   
				    // Show desired items. 
					$items.hide();
					$items.slice(showIndex, opts.initVisible).show();
					
					// Update the index and hide the Show and Hide controls, 
					// if necessary. 
					showIndex = opts.initVisible; 
					
					if(showIndex + cShow == opts.initVisible) {
						$control.children('a:not(:first)').hide();
					}
					
					toggleHideControl($control, showIndex, opts.initVisible);
				}
			});
			
		} // threadmore	
	}); // $.fn.extend
 })(jQuery);
