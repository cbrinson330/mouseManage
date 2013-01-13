// JavaScript Document

//CORE
/*!
 * $ UI 1.8.17
 *
 * Copyright 2011, AUTHORS.txt (http://$ui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://$.org/license
 *
 * http://docs.$.com/UI
 */
(function( $, undefined ) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
	return;
}

$.extend( $.ui, {
	version: "1.8.17",

	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	}
});

// plugins
$.fn.extend({
	propAttr: $.fn.prop || $.fn.attr,

	_focus: $.fn.focus,
	focus: function( delay, fn ) {
		return typeof delay === "number" ?
			this.each(function() {
				var elem = this;
				setTimeout(function() {
					$( elem ).focus();
					if ( fn ) {
						fn.call( elem );
					}
				}, delay );
			}) :
			this._focus.apply( this, arguments );
	},

	scrollParent: function() {
		var scrollParent;
		if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.each( [ "Width", "Height" ], function( i, name ) {
	var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
		type = name.toLowerCase(),
		orig = {
			innerWidth: $.fn.innerWidth,
			innerHeight: $.fn.innerHeight,
			outerWidth: $.fn.outerWidth,
			outerHeight: $.fn.outerHeight
		};

	function reduce( elem, size, border, margin ) {
		$.each( side, function() {
			size -= parseFloat( $.curCSS( elem, "padding" + this, true) ) || 0;
			if ( border ) {
				size -= parseFloat( $.curCSS( elem, "border" + this + "Width", true) ) || 0;
			}
			if ( margin ) {
				size -= parseFloat( $.curCSS( elem, "margin" + this, true) ) || 0;
			}
		});
		return size;
	}

	$.fn[ "inner" + name ] = function( size ) {
		if ( size === undefined ) {
			return orig[ "inner" + name ].call( this );
		}

		return this.each(function() {
			$( this ).css( type, reduce( this, size ) + "px" );
		});
	};

	$.fn[ "outer" + name] = function( size, margin ) {
		if ( typeof size !== "number" ) {
			return orig[ "outer" + name ].call( this, size );
		}

		return this.each(function() {
			$( this).css( type, reduce( this, size, true, margin ) + "px" );
		});
	};
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		var map = element.parentNode,
			mapName = map.name,
			img;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName )
		? !element.disabled
		: "a" == nodeName
			? element.href || isTabIndexNotNaN
			: isTabIndexNotNaN)
		// the element and all of its ancestors must be visible
		&& visible( element );
}

function visible( element ) {
	return !$( element ).parents().andSelf().filter(function() {
		return $.curCSS( this, "visibility" ) === "hidden" ||
			$.expr.filters.hidden( this );
	}).length;
}

$.extend( $.expr[ ":" ], {
	data: function( elem, i, match ) {
		return !!$.data( elem, match[ 3 ] );
	},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support
$(function() {
	var body = document.body,
		div = body.appendChild( div = document.createElement( "div" ) );

	$.extend( div.style, {
		minHeight: "100px",
		height: "auto",
		padding: 0,
		borderWidth: 0
	});

	$.support.minHeight = div.offsetHeight === 100;
	$.support.selectstart = "onselectstart" in div;

	// set display to none to avoid a layout bug in IE
	// http://dev.$.com/ticket/4014
	body.removeChild( div ).style.display = "none";
});





// deprecated
$.extend( $.ui, {
	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function( module, option, set ) {
			var proto = $.ui[ module ].prototype;
			for ( var i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode ) {
				return;
			}
	
			for ( var i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},
	
	// will be deprecated when we switch to $ 1.4 - use $.contains()
	contains: function( a, b ) {
		return document.compareDocumentPosition ?
			a.compareDocumentPosition( b ) & 16 :
			a !== b && a.contains( b );
	},
	
	// only used by resizable
	hasScroll: function( el, a ) {
	
		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}
	
		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;
	
		if ( el[ scroll ] > 0 ) {
			return true;
		}
	
		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},
	
	// these are odd functions, fix the API or move into individual plugins
	isOverAxis: function( x, reference, size ) {
		//Determines when x coordinate is over "b" element axis
		return ( x > reference ) && ( x < ( reference + size ) );
	},
	isOver: function( y, x, top, left, height, width ) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
	}
});

})( $ );


//WIDGET
/*!
 * $ UI Widget 1.8.17
 *
 * Copyright 2011, AUTHORS.txt (http://$ui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://$.org/license
 *
 * http://docs.$.com/UI/Widget
 */
(function( $, undefined ) {

// $ 1.4+
if ( $.cleanData ) {
	var _cleanData = $.cleanData;
	$.cleanData = function( elems ) {
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			try {
				$( elem ).triggerHandler( "remove" );
			// http://bugs.$.com/ticket/8235
			} catch( e ) {}
		}
		_cleanData( elems );
	};
} else {
	var _remove = $.fn.remove;
	$.fn.remove = function( selector, keepData ) {
		return this.each(function() {
			if ( !keepData ) {
				if ( !selector || $.filter( selector, [ this ] ).length ) {
					$( "*", this ).add( [ this ] ).each(function() {
						try {
							$( this ).triggerHandler( "remove" );
						// http://bugs.$.com/ticket/8235
						} catch( e ) {}
					});
				}
			}
			return _remove.call( $(this), selector, keepData );
		});
	};
}

$.widget = function( name, base, prototype ) {
	var namespace = name.split( "." )[ 0 ],
		fullName;
	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName ] = function( elem ) {
		return !!$.data( elem, name );
	};

	$[ namespace ] = $[ namespace ] || {};
	$[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without initializing for simple inheritance
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	var basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
//	$.each( basePrototype, function( key, val ) {
//		if ( $.isPlainObject(val) ) {
//			basePrototype[ key ] = $.extend( {}, val );
//		}
//	});
	basePrototype.options = $.extend( true, {}, basePrototype.options );
	$[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
		namespace: namespace,
		widgetName: name,
		widgetEventPrefix: $[ namespace ][ name ].prototype.widgetEventPrefix || name,
		widgetBaseClass: fullName
	}, prototype );

	$.widget.bridge( name, $[ namespace ][ name ] );
};

$.widget.bridge = function( name, object ) {
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = Array.prototype.slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.extend.apply( null, [ true, options ].concat(args) ) :
			options;

		// prevent calls to internal methods
		if ( isMethodCall && options.charAt( 0 ) === "_" ) {
			return returnValue;
		}

		if ( isMethodCall ) {
			this.each(function() {
				var instance = $.data( this, name ),
					methodValue = instance && $.isFunction( instance[options] ) ?
						instance[ options ].apply( instance, args ) :
						instance;
				// TODO: add this back in 1.9 and use $.error() (see #5972)
//				if ( !instance ) {
//					throw "cannot call methods on " + name + " prior to initialization; " +
//						"attempted to call method '" + options + "'";
//				}
//				if ( !$.isFunction( instance[options] ) ) {
//					throw "no such method '" + options + "' for " + name + " widget instance";
//				}
//				var methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, name );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, name, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( options, element ) {
	// allow instantiation without initializing for simple inheritance
	if ( arguments.length ) {
		this._createWidget( options, element );
	}
};

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	options: {
		disabled: false
	},
	_createWidget: function( options, element ) {
		// $.widget.bridge stores the plugin instance, but we do it anyway
		// so that it's stored even before the _create function runs
		$.data( element, this.widgetName, this );
		this.element = $( element );
		this.options = $.extend( true, {},
			this.options,
			this._getCreateOptions(),
			options );

		var self = this;
		this.element.bind( "remove." + this.widgetName, function() {
			self.destroy();
		});

		this._create();
		this._trigger( "create" );
		this._init();
	},
	_getCreateOptions: function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	},
	_create: function() {},
	_init: function() {},

	destroy: function() {
		this.element
			.unbind( "." + this.widgetName )
			.removeData( this.widgetName );
		this.widget()
			.unbind( "." + this.widgetName )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetBaseClass + "-disabled " +
				"ui-state-disabled" );
	},

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.extend( {}, this.options );
		}

		if  (typeof key === "string" ) {
			if ( value === undefined ) {
				return this.options[ key ];
			}
			options = {};
			options[ key ] = value;
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var self = this;
		$.each( options, function( key, value ) {
			self._setOption( key, value );
		});

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				[ value ? "addClass" : "removeClass"](
					this.widgetBaseClass + "-disabled" + " " +
					"ui-state-disabled" )
				.attr( "aria-disabled", value );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );

		return !( $.isFunction(callback) &&
			callback.call( this.element[0], event, data ) === false ||
			event.isDefaultPrevented() );
	}
};

})( $ );


//MOUSE
/*!
 * $ UI Mouse 1.8.17
 *
 * Copyright 2011, AUTHORS.txt (http://$ui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://$.org/license
 *
 * http://docs.$.com/UI/Mouse
 *
 * Depends:
 *	$.ui.widget.js
 */
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function( e ) {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	options: {
		cancel: ':input,option',
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var self = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return self._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if (true === $.data(event.target, self.widgetName + '.preventClickEvent')) {
				    $.removeData(event.target, self.widgetName + '.preventClickEvent');
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return };

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var self = this,
			btnIsLeft = (event.which == 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel == "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				self.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
			$.removeData(event.target, this.widgetName + '.preventClickEvent');
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return self._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return self._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();
		
		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.browser.msie && !(document.documentMode >= 9) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target == this._mouseDownEvent.target) {
			    $.data(event.target, this.widgetName + '.preventClickEvent', true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
});

})($);


/*
 * Content-Type:text/javascript
 *
 * A bridge between iPad and iPhone touch events and $ draggable, 
 * sortable etc. mouse interactions.
 * @author Oleg Slobodskoi  
 * 
 * modified by John Hardy to use with any touch device
 * fixed breakage caused by $.ui so that mouseHandled internal flag is reset 
 * before each touchStart event
 * 
 */
(function( $ ) {

    $.support.touch = typeof Touch === 'object';

    if (!$.support.touch) {
        return;
    }

    var proto =  $.ui.mouse.prototype,
    _mouseInit = proto._mouseInit;

    $.extend( proto, {
        _mouseInit: function() {
            this.element
            .bind( "touchstart." + this.widgetName, $.proxy( this, "_touchStart" ) );
            _mouseInit.apply( this, arguments );
        },

        _touchStart: function( event ) {
            if ( event.originalEvent.targetTouches.length != 1 ) {
                return false;
            }

            this.element
            .bind( "touchmove." + this.widgetName, $.proxy( this, "_touchMove" ) )
            .bind( "touchend." + this.widgetName, $.proxy( this, "_touchEnd" ) );

            this._modifyEvent( event );

            $( document ).trigger($.Event("mouseup")); //reset mouseHandled flag in ui.mouse
            this._mouseDown( event );

            return false;           
        },

        _touchMove: function( event ) {
            this._modifyEvent( event );
            this._mouseMove( event );   
        },

        _touchEnd: function( event ) {
            this.element
            .unbind( "touchmove." + this.widgetName )
            .unbind( "touchend." + this.widgetName );
            this._mouseUp( event ); 
        },

        _modifyEvent: function( event ) {
            event.which = 1;
            var target = event.originalEvent.targetTouches[0];
            event.pageX = target.clientX;
            event.pageY = target.clientY;
        }

    });

})( $ );



//SORTABLE
/*
 * $ UI Sortable 1.8.17
 *
 * Copyright 2011, AUTHORS.txt (http://$ui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://$.org/license
 *
 * http://docs.$.com/UI/Sortables
 *
 * Depends:
 *	$.ui.core.js
 *	$.ui.mouse.js
 *	$.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.sortable", $.ui.mouse, {
	widgetEventPrefix: "sort",
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: 'auto',
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: '> *',
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000
	},
	_create: function() {

		var o = this.options;
		this.containerCache = {};
		this.element.addClass("ui-sortable");

		//Get the items
		this.refresh();

		//Let's determine if the items are being displayed horizontally
		this.floating = this.items.length ? o.axis === 'x' || (/left|right/).test(this.items[0].item.css('float')) || (/inline|table-cell/).test(this.items[0].item.css('display')) : false;

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

	},

	destroy: function() {
		this.element
			.removeClass("ui-sortable ui-sortable-disabled");
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- )
			this.items[i].item.removeData(this.widgetName + "-item");

		return this;
	},

	_setOption: function(key, value){
		if ( key === "disabled" ) {
			this.options[ key ] = value;
	
			this.widget()
				[ value ? "addClass" : "removeClass"]( "ui-sortable-disabled" );
		} else {
			// Don't call widget base _setOption for disable as it adds ui-state-disabled class
			$.Widget.prototype._setOption.apply(this, arguments);
		}
	},

	_mouseCapture: function(event, overrideHandle) {
		var that = this;

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type == 'static') return false;

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		var currentItem = null, self = this, nodes = $(event.target).parents().each(function() {
			if($.data(this, that.widgetName + '-item') == self) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, that.widgetName + '-item') == self) currentItem = $(event.target);

		if(!currentItem) return false;
		if(this.options.handle && !overrideHandle) {
			var validHandle = false;

			$(this.options.handle, currentItem).find("*").andSelf().each(function() { if(this == event.target) validHandle = true; });
			if(!validHandle) return false;
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var o = this.options, self = this;
		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if(this.helper[0] != this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		if(o.cursor) { // cursor option
			if ($('body').css("cursor")) this._storedCursor = $('body').css("cursor");
			$('body').css("cursor", o.cursor);
		}

		if(o.opacity) { // opacity option
			if (this.helper.css("opacity")) this._storedOpacity = this.helper.css("opacity");
			this.helper.css("opacity", o.opacity);
		}

		if(o.zIndex) { // zIndex option
			if (this.helper.css("zIndex")) this._storedZIndex = this.helper.css("zIndex");
			this.helper.css("zIndex", o.zIndex);
		}

		//Prepare scrolling
		if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML')
			this.overflowOffset = this.scrollParent.offset();

		//Call callbacks
		this._trigger("start", event, this._uiHash());

		//Recache the helper size
		if(!this._preserveHelperProportions)
			this._cacheHelperProportions();


		//Post 'activate' events to possible containers
		if(!noActivation) {
			 for (var i = this.containers.length - 1; i >= 0; i--) { this.containers[i]._trigger("activate", event, self._uiHash(this)); }
		}

		//Prepare possible droppables
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if(this.options.scroll) {
			var o = this.options, scrolled = false;
			if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML') {

				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity)
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;

				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity)
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;

			} else {

				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);

				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);

			}

			if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
				$.ui.ddmanager.prepareOffsets(this, event);
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';

		//Rearrange
		for (var i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			var item = this.items[i], itemElement = item.item[0], intersection = this._intersectsWithPointer(item);
			if (!intersection) continue;

			if(itemElement != this.currentItem[0] //cannot intersect with itself
				&&	this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
				&&	!$.ui.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
				&& (this.options.type == 'semi-dynamic' ? !$.ui.contains(this.element[0], itemElement) : true)
				//&& itemElement.parentNode == this.placeholder[0].parentNode // only rearrange items within the same container
			) {

				this.direction = intersection == 1 ? "down" : "up";

				if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		//Call callbacks
		this._trigger('sort', event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) return;

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			$.ui.ddmanager.drop(this, event);

		if(this.options.revert) {
			var self = this;
			var cur = self.placeholder.offset();

			self.reverting = true;

			$(this.helper).animate({
				left: cur.left - this.offset.parent.left - self.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
				top: cur.top - this.offset.parent.top - self.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
			}, parseInt(this.options.revert, 10) || 500, function() {
				self._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		var self = this;

		if(this.dragging) {

			this._mouseUp({ target: null });

			if(this.options.helper == "original")
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			else
				this.currentItem.show();

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, self._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, self._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		if (this.placeholder) {
			//$(this.placeholder[0]).remove(); would have been the $ way - unfortunately, it unbinds ALL events from the original node!
			if(this.placeholder[0].parentNode) this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
			if(this.options.helper != "original" && this.helper && this.helper[0].parentNode) this.helper.remove();

			$.extend(this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			});

			if(this.domPosition.prev) {
				$(this.domPosition.prev).after(this.currentItem);
			} else {
				$(this.domPosition.parent).prepend(this.currentItem);
			}
		}

		return this;

	},

	serialize: function(o) {

		var items = this._getItemsAs$(o && o.connected);
		var str = []; o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || 'id') || '').match(o.expression || (/(.+)[-=_](.+)/));
			if(res) str.push((o.key || res[1]+'[]')+'='+(o.key && o.expression ? res[1] : res[2]));
		});

		if(!str.length && o.key) {
			str.push(o.key + '=');
		}

		return str.join('&');

	},

	toArray: function(o) {

		var items = this._getItemsAs$(o && o.connected);
		var ret = []; o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || 'id') || ''); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height;

		var l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height;

		var dyClick = this.offset.click.top,
			dxClick = this.offset.click.left;

		var isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;

		if(	   this.options.tolerance == "pointer"
			|| this.options.forcePointerForContainers
			|| (this.options.tolerance != "pointer" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height'])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) // Right Half
				&& x2 - (this.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (this.helperProportions.height / 2) // Bottom Half
				&& y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement)
			return false;

		return this.floating ?
			( ((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection == "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta != 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta != 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor == String
			? [options.connectWith]
			: options.connectWith;
	},
	
	_getItemsAs$: function(connected) {

		var self = this;
		var items = [];
		var queries = [];
		var connectWith = this._connectWith();

		if(connectWith && connected) {
			for (var i = connectWith.length - 1; i >= 0; i--){
				var cur = $(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], this.widgetName);
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), inst]);
					}
				};
			};
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), this]);

		for (var i = queries.length - 1; i >= 0; i--){
			queries[i][0].each(function() {
				items.push(this);
			});
		};

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

		for (var i=0; i < this.items.length; i++) {

			for (var j=0; j < list.length; j++) {
				if(list[j] == this.items[i].item[0])
					this.items.splice(i,1);
			};

		};

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];
		var items = this.items;
		var self = this;
		var queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]];
		var connectWith = this._connectWith();

		if(connectWith) {
			for (var i = connectWith.length - 1; i >= 0; i--){
				var cur = $(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], this.widgetName);
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				};
			};
		}

		for (var i = queries.length - 1; i >= 0; i--) {
			var targetData = queries[i][1];
			var _queries = queries[i][0];

			for (var j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				var item = $(_queries[j]);

				item.data(this.widgetName + '-item', targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			};
		};

	},

	refreshPositions: function(fast) {

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		for (var i = this.items.length - 1; i >= 0; i--){
			var item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if(item.instance != this.currentContainer && this.currentContainer && item.item[0] != this.currentItem[0])
				continue;

			var t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			var p = t.offset();
			item.left = p.left;
			item.top = p.top;
		};

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (var i = this.containers.length - 1; i >= 0; i--){
				var p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			};
		}

		return this;
	},

	_createPlaceholder: function(that) {

		var self = that || this, o = self.options;

		if(!o.placeholder || o.placeholder.constructor == String) {
			var className = o.placeholder;
			o.placeholder = {
				element: function() {

					var el = $(document.createElement(self.currentItem[0].nodeName))
						.addClass(className || self.currentItem[0].className+" ui-sortable-placeholder")
						.removeClass("ui-sortable-helper")[0];

					if(!className)
						el.style.visibility = "hidden";

					return el;
				},
				update: function(container, p) {

					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if(className && !o.forcePlaceholderSize) return;

					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if(!p.height()) { p.height(self.currentItem.innerHeight() - parseInt(self.currentItem.css('paddingTop')||0, 10) - parseInt(self.currentItem.css('paddingBottom')||0, 10)); };
					if(!p.width()) { p.width(self.currentItem.innerWidth() - parseInt(self.currentItem.css('paddingLeft')||0, 10) - parseInt(self.currentItem.css('paddingRight')||0, 10)); };
				}
			};
		}

		//Create the placeholder
		self.placeholder = $(o.placeholder.element.call(self.element, self.currentItem));

		//Append it after the actual current item
		self.currentItem.after(self.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(self, self.placeholder);

	},

	_contactContainers: function(event) {
		
		// get innermost container that intersects with item 
		var innermostContainer = null, innermostIndex = null;		
		
		
		for (var i = this.containers.length - 1; i >= 0; i--){

			// never consider a container that's located within the item itself 
			if($.ui.contains(this.currentItem[0], this.containers[i].element[0]))
				continue;

			if(this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue 
				if(innermostContainer && $.ui.contains(this.containers[i].element[0], innermostContainer.element[0]))
					continue;

				innermostContainer = this.containers[i]; 
				innermostIndex = i;
					
			} else {
				// container doesn't intersect. trigger "out" event if necessary 
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}
		
		// if no intersecting containers found, return 
		if(!innermostContainer) return; 

		// move the item into the container if it's not there already
		if(this.containers.length === 1) {
			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		} else if(this.currentContainer != this.containers[innermostIndex]) { 

			//When entering a new container, we will find the item with the least distance and append our item near it 
			var dist = 10000; var itemWithLeastDistance = null; var base = this.positionAbs[this.containers[innermostIndex].floating ? 'left' : 'top']; 
			for (var j = this.items.length - 1; j >= 0; j--) { 
				if(!$.ui.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) continue; 
				var cur = this.items[j][this.containers[innermostIndex].floating ? 'left' : 'top']; 
				if(Math.abs(cur - base) < dist) { 
					dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j]; 
				} 
			} 

			if(!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled 
				return; 

			this.currentContainer = this.containers[innermostIndex]; 
			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true); 
			this._trigger("change", event, this._uiHash()); 
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this)); 

			//Update the placeholder 
			this.options.placeholder.update(this.currentContainer, this.placeholder); 
		
			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this)); 
			this.containers[innermostIndex].containerCache.over = 1;
		} 
	
		
	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper == 'clone' ? this.currentItem.clone() : this.currentItem);

		if(!helper.parents('body').length) //Add the helper to the DOM if that didn't happen already
			$(o.appendTo != 'parent' ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);

		if(helper[0] == this.currentItem[0])
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };

		if(helper[0].style.width == '' || o.forceHelperSize) helper.width(this.currentItem.width());
		if(helper[0].style.height == '' || o.forceHelperSize) helper.height(this.currentItem.height());

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			0 - this.offset.relative.left - this.offset.parent.left,
			0 - this.offset.relative.top - this.offset.parent.top,
			$(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			var ce = $(o.containment)[0];
			var co = $(o.containment).offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == 'down' ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var self = this, counter = this.counter;

		window.setTimeout(function() {
			if(counter == self.counter) self.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
		},0);

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var delayedTriggers = [], self = this;

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if(!this._noFinalSort && this.currentItem.parent().length) this.placeholder.before(this.currentItem);
		this._noFinalSort = null;

		if(this.helper[0] == this.currentItem[0]) {
			for(var i in this._storedCSS) {
				if(this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static') this._storedCSS[i] = '';
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		if((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !noPropagation) delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		if(!$.ui.contains(this.element[0], this.currentItem[0])) { //Node was moved out of the current element
			if(!noPropagation) delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
			for (var i = this.containers.length - 1; i >= 0; i--){
				if($.ui.contains(this.containers[i].element[0], this.currentItem[0]) && !noPropagation) {
					delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
					delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.containers[i]));
				}
			};
		};

		//Post events to containers
		for (var i = this.containers.length - 1; i >= 0; i--){
			if(!noPropagation) delayedTriggers.push((function(c) { return function(event) { c._trigger("deactivate", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push((function(c) { return function(event) { c._trigger("out", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if(this._storedCursor) $('body').css("cursor", this._storedCursor); //Reset cursor
		if(this._storedOpacity) this.helper.css("opacity", this._storedOpacity); //Reset opacity
		if(this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == 'auto' ? '' : this._storedZIndex); //Reset z-index

		this.dragging = false;
		if(this.cancelHelperRemoval) {
			if(!noPropagation) {
				this._trigger("beforeStop", event, this._uiHash());
				for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
				this._trigger("stop", event, this._uiHash());
			}
			return false;
		}

		if(!noPropagation) this._trigger("beforeStop", event, this._uiHash());

		//$(this.placeholder[0]).remove(); would have been the $ way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if(this.helper[0] != this.currentItem[0]) this.helper.remove(); this.helper = null;

		if(!noPropagation) {
			for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return true;

	},

	_trigger: function() {
		if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(inst) {
		var self = inst || this;
		return {
			helper: self.helper,
			placeholder: self.placeholder || $([]),
			position: self.position,
			originalPosition: self.originalPosition,
			offset: self.positionAbs,
			item: self.currentItem,
			sender: inst ? inst.element : null
		};
	}

});

$.extend($.ui.sortable, {
	version: "1.8.17"
});


//DRAGGABLE
/*
 * $ UI Draggable 1.8.17
 *
 * Copyright 2011, AUTHORS.txt (http://$ui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://$.org/license
 *
 * http://docs.$.com/UI/Draggables
 *
 * Depends:
 *	$.ui.core.js
 *	$.ui.mouse.js
 *	$.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false
	},
	_create: function() {

		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
			this.element[0].style.position = 'relative';

		(this.options.addClasses && this.element.addClass("ui-draggable"));
		(this.options.disabled && this.element.addClass("ui-draggable-disabled"));

		this._mouseInit();

	},

	destroy: function() {
		if(!this.element.data('draggable')) return;
		this.element
			.removeData("draggable")
			.unbind(".draggable")
			.removeClass("ui-draggable"
				+ " ui-draggable-dragging"
				+ " ui-draggable-disabled");
		this._mouseDestroy();

		return this;
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
			return false;

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle)
			return false;
		
		if ( o.iframeFix ) {
			$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
				$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
				.css({
					width: this.offsetWidth+"px", height: this.offsetHeight+"px",
					position: "absolute", opacity: "0.001", zIndex: 1000
				})
				.css($(this).offset())
				.appendTo("body");
			});
		}

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.helper.addClass("ui-draggable-dragging");
		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		
		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) $.ui.ddmanager.dragStart(this, event);
		
		return true;
	},

	_mouseDrag: function(event, noPropagation) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger('drag', event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			dropped = $.ui.ddmanager.drop(this, event);

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}
		
		//if the original element is removed, don't bother to continue if helper is set to "original"
		if((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original")
			return false;

		if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			var self = this;
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if(self._trigger("stop", event) !== false) {
					self._clear();
				}
			});
		} else {
			if(this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},
	
	_mouseUp: function(event) {
		if (this.options.iframeFix === true) {
			$("div.ui-draggable-iframeFix").each(function() { 
				this.parentNode.removeChild(this); 
			}); //Remove frame helpers
		}
		
		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if( $.ui.ddmanager ) $.ui.ddmanager.dragStop(this, event);
		
		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},
	
	cancel: function() {
		
		if(this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}
		
		return this;
		
	},

	_getHandle: function(event) {

		var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
		$(this.options.handle, this.element)
			.find("*")
			.andSelf()
			.each(function() {
				if(this == event.target) handle = true;
			});

		return handle;

	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);

		if(!helper.parents('body').length)
			helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

		if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
			helper.css("position", "absolute");

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0),
			right: (parseInt(this.element.css("marginRight"),10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
			o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
			(o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			(o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
		        var c = $(o.containment);
			var ce = c[0]; if(!ce) return;
			var co = c.offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				(parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
				(parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
				(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
				(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
			];
			this.relative_container = c;

		} else if(o.containment.constructor == Array) {
			this.containment = o.containment;
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options
		         var containment;
		         if(this.containment) {
				 if (this.relative_container){
				     var co = this.relative_container.offset();
				     containment = [ this.containment[0] + co.left,
						     this.containment[1] + co.top,
						     this.containment[2] + co.left,
						     this.containment[3] + co.top ];
				 }
				 else {
				     containment = this.containment;
				 }

				if(event.pageX - this.offset.click.left < containment[0]) pageX = containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < containment[1]) pageY = containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > containment[2]) pageX = containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > containment[3]) pageY = containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				var top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY = containment ? (!(top - this.offset.click.top < containment[1] || top - this.offset.click.top > containment[3]) ? top : (!(top - this.offset.click.top < containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
				pageX = containment ? (!(left - this.offset.click.left < containment[0] || left - this.offset.click.left > containment[2]) ? left : (!(left - this.offset.click.left < containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
		//if($.ui.ddmanager) $.ui.ddmanager.current = null;
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function(event) {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.extend($.ui.draggable, {
	version: "1.8.17"
});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options,
			uiSortable = $.extend({}, ui, { item: inst.element });
		inst.sortables = [];
		$(o.connectToSortable).each(function() {
			var sortable = $.data(this, 'sortable');
			if (sortable && !sortable.options.disabled) {
				inst.sortables.push({
					instance: sortable,
					shouldRevert: sortable.options.revert
				});
				sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
				sortable._trigger("activate", event, uiSortable);
			}
		});

	},
	stop: function(event, ui) {

		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
		var inst = $(this).data("draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
				if(this.shouldRevert) this.instance.options.revert = true;

				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper == 'original')
					this.instance.currentItem.css({ top: 'auto', left: 'auto' });

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), self = this;

		var checkPos = function(o) {
			var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
			var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
			var itemHeight = o.height, itemWidth = o.width;
			var itemTop = o.top, itemLeft = o.left;

			return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
		};

		$.each(inst.sortables, function(i) {
			
			//Copy over some variables to allow calling the sortable's native _intersectsWith
			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;
			
			if(this.instance._intersectsWith(this.instance.containerCache)) {

				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(self).clone().removeAttr('id').appendTo(this.instance.element).data("sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					//hack so receive/update callbacks work (mostly)
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) this.instance._mouseDrag(event);

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;
					
					//Prevent reverting on this forced stop
					this.instance.options.revert = false;
					
					// The out event needs to be triggered independently
					this.instance._trigger('out', event, this.instance._uiHash(this.instance));
					
					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) this.instance.placeholder.remove();

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			};

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function(event, ui) {
		var t = $('body'), o = $(this).data('draggable').options;
		if (t.css("cursor")) o._cursor = t.css("cursor");
		t.css("cursor", o.cursor);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if (o._cursor) $('body').css("cursor", o._cursor);
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data('draggable').options;
		if(t.css("opacity")) o._opacity = t.css("opacity");
		t.css('opacity', o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if(o._opacity) $(ui.helper).css('opacity', o._opacity);
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function(event, ui) {
		var i = $(this).data("draggable");
		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
	},
	drag: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if(!o.axis || o.axis != 'x') {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
			}

			if(!o.axis || o.axis != 'y') {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
			}

		} else {

			if(!o.axis || o.axis != 'x') {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
			}

			if(!o.axis || o.axis != 'y') {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(i, event);

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options;
		i.snapElements = [];

		$(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
			var $t = $(this); var $o = $t.offset();
			if(this != i.element[0]) i.snapElements.push({
				item: this,
				width: $t.outerWidth(), height: $t.outerHeight(),
				top: $o.top, left: $o.left
			});
		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options;
		var d = o.snapTolerance;

		var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (var i = inst.snapElements.length - 1; i >= 0; i--){

			var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
				t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

			//Yes, I know, this is insane ;)
			if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
				if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode != 'inner') {
				var ts = Math.abs(t - y2) <= d;
				var bs = Math.abs(b - y1) <= d;
				var ls = Math.abs(l - x2) <= d;
				var rs = Math.abs(r - x1) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
			}

			var first = (ts || bs || ls || rs);

			if(o.snapMode != 'outer') {
				var ts = Math.abs(t - y1) <= d;
				var bs = Math.abs(b - y2) <= d;
				var ls = Math.abs(l - x1) <= d;
				var rs = Math.abs(r - x2) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		};

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function(event, ui) {

		var o = $(this).data("draggable").options;

		var group = $.makeArray($(o.stack)).sort(function(a,b) {
			return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
		});
		if (!group.length) { return; }
		
		var min = parseInt(group[0].style.zIndex) || 0;
		$(group).each(function(i) {
			this.style.zIndex = min + i;
		});

		this[0].style.zIndex = min + group.length;

	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("draggable").options;
		if(t.css("zIndex")) o._zIndex = t.css("zIndex");
		t.css('zIndex', o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("draggable").options;
		if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
	}
});

})($);




})($);


// LEAN MODAL

(function($){
 
    $.fn.extend({ 
         
        leanModal: function(options) {
 
            var defaults = {
                top: 100,
                overlay: 0.5,
                closeButton: null
            }
            
            options =  $.extend(defaults, options);
 
            return this.each(function() {
            
                var o = options;
               
                $(this).live("click" , function(e) {
		//GET mouse ID if it is detail link
		var clickTarget = $(this).attr('class');
		if(clickTarget == "detaillink"){
		  var rawMouseID = $(this).attr('id');
		  var mouseIDHolder = rawMouseID.split('-');
		  var mouseID = parseInt(mouseIDHolder[1]);
		  getMouseInfo(mouseID);
		}
		else if( clickTarget == "button"){
		  setCagesDropdown('.createMouse-input-cage');
		}
		
              	var modal_id = $(this).attr("href");

		$("#lean_overlay").click(function() { 
                     close_modal(modal_id);                    
                });
                
                $(o.closeButton).click(function() { 
		     $('#panel').removeClass('flip');
                     close_modal(modal_id);                    
                });
                         	
              	var modal_height = $(modal_id).outerHeight();
        	  	var modal_width = $(modal_id).outerWidth();

        		$('#lean_overlay').css({ 'display' : 'block', opacity : 0 });

        		$('#lean_overlay').fadeTo(200,o.overlay);

        		$(modal_id).css({ 
        		
        			'display' : 'block',
        			'position' : 'fixed',
        			'opacity' : 0,
        			'z-index': 11000,
        			'left' : 50 + '%',
        			'margin-left' : -(modal_width/2) + "px",
        			'top' : o.top + "px"
        		
        		});

        		$(modal_id).fadeTo(200,1);

                e.preventDefault();
                		
              	});
             
            });

			function close_modal(modal_id){

        		$("#lean_overlay").fadeOut(200);

        		$(modal_id).css({ 'display' : 'none' });
			
			}
    
        }
    });
     
})($);




/*! $ Mobile v1.0.1 $mobile.com | $.org/license */
(function(a,e){if(a.cleanData){var b=a.cleanData;a.cleanData=function(f){for(var c=0,d;(d=f[c])!=null;c++)a(d).triggerHandler("remove");b(f)}}else{var d=a.fn.remove;a.fn.remove=function(b,c){return this.each(function(){c||(!b||a.filter(b,[this]).length)&&a("*",this).add([this]).each(function(){a(this).triggerHandler("remove")});return d.call(a(this),b,c)})}}a.widget=function(b,c,d){var e=b.split(".")[0],i,b=b.split(".")[1];i=e+"-"+b;if(!d)d=c,c=a.Widget;a.expr[":"][i]=function(c){return!!a.data(c,
b)};a[e]=a[e]||{};a[e][b]=function(a,b){arguments.length&&this._createWidget(a,b)};c=new c;c.options=a.extend(true,{},c.options);a[e][b].prototype=a.extend(true,c,{namespace:e,widgetName:b,widgetEventPrefix:a[e][b].prototype.widgetEventPrefix||b,widgetBaseClass:i},d);a.widget.bridge(b,a[e][b])};a.widget.bridge=function(b,c){a.fn[b]=function(d){var g=typeof d==="string",i=Array.prototype.slice.call(arguments,1),l=this,d=!g&&i.length?a.extend.apply(null,[true,d].concat(i)):d;if(g&&d.charAt(0)==="_")return l;
g?this.each(function(){var c=a.data(this,b);if(!c)throw"cannot call methods on "+b+" prior to initialization; attempted to call method '"+d+"'";if(!a.isFunction(c[d]))throw"no such method '"+d+"' for "+b+" widget instance";var g=c[d].apply(c,i);if(g!==c&&g!==e)return l=g,false}):this.each(function(){var e=a.data(this,b);e?e.option(d||{})._init():a.data(this,b,new c(d,this))});return l}};a.Widget=function(a,b){arguments.length&&this._createWidget(a,b)};a.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",
options:{disabled:false},_createWidget:function(b,c){a.data(c,this.widgetName,this);this.element=a(c);this.options=a.extend(true,{},this.options,this._getCreateOptions(),b);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){var b={};a.metadata&&(b=a.metadata.get(element)[this.widgetName]);return b},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);
this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},widget:function(){return this.element},option:function(b,c){var d=b;if(arguments.length===0)return a.extend({},this.options);if(typeof b==="string"){if(c===e)return this.options[b];d={};d[b]=c}this._setOptions(d);return this},_setOptions:function(b){var c=this;a.each(b,function(a,b){c._setOption(a,b)});return this},_setOption:function(a,b){this.options[a]=b;a==="disabled"&&
this.widget()[b?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",b);return this},enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(b,c,d){var e=this.options[b],c=a.Event(c);c.type=(b===this.widgetEventPrefix?b:this.widgetEventPrefix+b).toLowerCase();d=d||{};if(c.originalEvent)for(var b=a.event.props.length,i;b;)i=a.event.props[--b],c[i]=c.originalEvent[i];this.element.trigger(c,
d);return!(a.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})($);
(function(a,e){a.widget("mobile.widget",{_createWidget:function(){a.Widget.prototype._createWidget.apply(this,arguments);this._trigger("init")},_getCreateOptions:function(){var b=this.element,d={};a.each(this.options,function(a){var c=b.jqmData(a.replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()}));c!==e&&(d[a]=c)});return d},enhanceWithin:function(b){var d=a.mobile.closestPageData(a(b)),d=d&&d.keepNativeSelector()||"";a(this.options.initSelector,b).not(d)[this.widgetName]()}})})($);
(function(a){a(window);var e=a("html");a.mobile.media=function(){var b={},d=a("<div id='$-mediatest'>"),f=a("<body>").append(d);return function(a){if(!(a in b)){var h=document.createElement("style"),g="@media "+a+" { #$-mediatest { position:absolute; } }";h.type="text/css";h.styleSheet?h.styleSheet.cssText=g:h.appendChild(document.createTextNode(g));e.prepend(f).prepend(h);b[a]=d.css("position")==="absolute";f.add(h).remove()}return b[a]}}()})($);
(function(a,e){function b(a){var b=a.charAt(0).toUpperCase()+a.substr(1),a=(a+" "+c.join(b+" ")+b).split(" "),d;for(d in a)if(f[a[d]]!==e)return true}var d=a("<body>").prependTo("html"),f=d[0].style,c=["Webkit","Moz","O"],h="palmGetResource"in window,g=window.operamini&&{}.toString.call(window.operamini)==="[object OperaMini]",i=window.blackberry;a.mobile.browser={};a.mobile.browser.ie=function(){for(var a=3,b=document.createElement("div"),c=b.all||[];b.innerHTML="<\!--[if gt IE "+ ++a+"]><br><![endif]--\>",
c[0];);return a>4?a:!a}();a.extend(a.support,{orientation:"orientation"in window&&"onorientationchange"in window,touch:"ontouchend"in document,cssTransitions:"WebKitTransitionEvent"in window,pushState:"pushState"in history&&"replaceState"in history,mediaquery:a.mobile.media("only all"),cssPseudoElement:!!b("content"),touchOverflow:!!b("overflowScrolling"),boxShadow:!!b("boxShadow")&&!i,scrollTop:("pageXOffset"in window||"scrollTop"in document.documentElement||"scrollTop"in d[0])&&!h&&!g,dynamicBaseTag:function(){var b=
location.protocol+"//"+location.host+location.pathname+"ui-dir/",c=a("head base"),f=null,e="",h;c.length?e=c.attr("href"):c=f=a("<base>",{href:b}).appendTo("head");h=a("<a href='testurl' />").prependTo(d)[0].href;c[0].href=e||location.pathname;f&&f.remove();return h.indexOf(b)===0}()});d.remove();h=function(){var a=window.navigator.userAgent;return a.indexOf("Nokia")>-1&&(a.indexOf("Symbian/3")>-1||a.indexOf("Series60/5")>-1)&&a.indexOf("AppleWebKit")>-1&&a.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/)}();
a.mobile.ajaxBlacklist=window.blackberry&&!window.WebKitPoint||g||h;h&&a(function(){a("head link[rel='stylesheet']").attr("rel","alternate stylesheet").attr("rel","stylesheet")});a.support.boxShadow||a("html").addClass("ui-mobile-nosupport-boxshadow")})($);
(function(a,e,b,d){function f(a){for(;a&&typeof a.originalEvent!=="undefined";)a=a.originalEvent;return a}function c(b){for(var c={},f,d;b;){f=a.data(b,m);for(d in f)if(f[d])c[d]=c.hasVirtualBinding=true;b=b.parentNode}return c}function h(){w&&(clearTimeout(w),w=0);w=setTimeout(function(){D=w=0;u.length=0;C=false;y=true},a.vmouse.resetTimerDuration)}function g(b,c,r){var e,h;if(!(h=r&&r[b])){if(r=!r)a:{for(r=c.target;r;){if((h=a.data(r,m))&&(!b||h[b]))break a;r=r.parentNode}r=null}h=r}if(h){e=c;var r=
e.type,g,i;e=a.Event(e);e.type=b;h=e.originalEvent;g=a.event.props;if(h)for(i=g.length;i;)b=g[--i],e[b]=h[b];if(r.search(/mouse(down|up)|click/)>-1&&!e.which)e.which=1;if(r.search(/^touch/)!==-1&&(b=f(h),r=b.touches,b=b.changedTouches,r=r&&r.length?r[0]:b&&b.length?b[0]:d))for(h=0,len=z.length;h<len;h++)b=z[h],e[b]=r[b];a(c.target).trigger(e)}return e}function i(b){var c=a.data(b.target,A);if(!C&&(!D||D!==c))if(c=g("v"+b.type,b))c.isDefaultPrevented()&&b.preventDefault(),c.isPropagationStopped()&&
b.stopPropagation(),c.isImmediatePropagationStopped()&&b.stopImmediatePropagation()}function l(b){var d=f(b).touches,e;if(d&&d.length===1&&(e=b.target,d=c(e),d.hasVirtualBinding))D=r++,a.data(e,A,D),w&&(clearTimeout(w),w=0),x=y=false,e=f(b).touches[0],v=e.pageX,s=e.pageY,g("vmouseover",b,d),g("vmousedown",b,d)}function k(a){y||(x||g("vmousecancel",a,c(a.target)),x=true,h())}function o(b){if(!y){var d=f(b).touches[0],r=x,e=a.vmouse.moveDistanceThreshold;x=x||Math.abs(d.pageX-v)>e||Math.abs(d.pageY-
s)>e;flags=c(b.target);x&&!r&&g("vmousecancel",b,flags);g("vmousemove",b,flags);h()}}function n(a){if(!y){y=true;var b=c(a.target),d;g("vmouseup",a,b);if(!x&&(d=g("vclick",a,b))&&d.isDefaultPrevented())d=f(a).changedTouches[0],u.push({touchID:D,x:d.clientX,y:d.clientY}),C=true;g("vmouseout",a,b);x=false;h()}}function q(b){var b=a.data(b,m),c;if(b)for(c in b)if(b[c])return true;return false}function j(){}function p(b){var c=b.substr(1);return{setup:function(){q(this)||a.data(this,m,{});a.data(this,
m)[b]=true;t[b]=(t[b]||0)+1;t[b]===1&&B.bind(c,i);a(this).bind(c,j);if(E)t.touchstart=(t.touchstart||0)+1,t.touchstart===1&&B.bind("touchstart",l).bind("touchend",n).bind("touchmove",o).bind("scroll",k)},teardown:function(){--t[b];t[b]||B.unbind(c,i);E&&(--t.touchstart,t.touchstart||B.unbind("touchstart",l).unbind("touchmove",o).unbind("touchend",n).unbind("scroll",k));var d=a(this),f=a.data(this,m);f&&(f[b]=false);d.unbind(c,j);q(this)||d.removeData(m)}}}var m="virtualMouseBindings",A="virtualTouchID",
e="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),z="clientX clientY pageX pageY screenX screenY".split(" "),t={},w=0,v=0,s=0,x=false,u=[],C=false,y=false,E="addEventListener"in b,B=a(b),r=1,D=0;a.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};for(var F=0;F<e.length;F++)a.event.special[e[F]]=p(e[F]);E&&b.addEventListener("click",function(b){var c=u.length,d=b.target,f,r,e,h,g;if(c){f=b.clientX;r=b.clientY;threshold=a.vmouse.clickDistanceThreshold;
for(e=d;e;){for(h=0;h<c;h++)if(g=u[h],e===d&&Math.abs(g.x-f)<threshold&&Math.abs(g.y-r)<threshold||a.data(e,A)===g.touchID){b.preventDefault();b.stopPropagation();return}e=e.parentNode}}},true)})($,window,document);
(function(a,e,b){function d(b,c,d){var f=d.type;d.type=c;a.event.handle.call(b,d);d.type=f}a.each("touchstart touchmove touchend orientationchange throttledresize tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "),function(b,c){a.fn[c]=function(a){return a?this.bind(c,a):this.trigger(c)};a.attrFn[c]=true});var f=a.support.touch,c=f?"touchstart":"mousedown",h=f?"touchend":"mouseup",g=f?"touchmove":"mousemove";a.event.special.scrollstart={enabled:true,setup:function(){function b(a,
e){f=e;d(c,f?"scrollstart":"scrollstop",a)}var c=this,f,e;a(c).bind("touchmove scroll",function(c){a.event.special.scrollstart.enabled&&(f||b(c,true),clearTimeout(e),e=setTimeout(function(){b(c,false)},50))})}};a.event.special.tap={setup:function(){var b=this,c=a(b);c.bind("vmousedown",function(f){function e(){clearTimeout(p)}function h(){e();c.unbind("vclick",g).unbind("vmouseup",e).unbind("vmousecancel",h)}function g(a){h();j==a.target&&d(b,"tap",a)}if(f.which&&f.which!==1)return false;var j=f.target,
p;c.bind("vmousecancel",h).bind("vmouseup",e).bind("vclick",g);p=setTimeout(function(){d(b,"taphold",a.Event("taphold"))},750)})}};a.event.special.swipe={scrollSupressionThreshold:10,durationThreshold:1E3,horizontalDistanceThreshold:30,verticalDistanceThreshold:75,setup:function(){var d=a(this);d.bind(c,function(c){function f(b){if(n){var c=b.originalEvent.touches?b.originalEvent.touches[0]:b;q={time:(new Date).getTime(),coords:[c.pageX,c.pageY]};Math.abs(n.coords[0]-q.coords[0])>a.event.special.swipe.scrollSupressionThreshold&&
b.preventDefault()}}var e=c.originalEvent.touches?c.originalEvent.touches[0]:c,n={time:(new Date).getTime(),coords:[e.pageX,e.pageY],origin:a(c.target)},q;d.bind(g,f).one(h,function(){d.unbind(g,f);n&&q&&q.time-n.time<a.event.special.swipe.durationThreshold&&Math.abs(n.coords[0]-q.coords[0])>a.event.special.swipe.horizontalDistanceThreshold&&Math.abs(n.coords[1]-q.coords[1])<a.event.special.swipe.verticalDistanceThreshold&&n.origin.trigger("swipe").trigger(n.coords[0]>q.coords[0]?"swipeleft":"swiperight");
n=q=b})})}};(function(a,b){function c(){var a=f();a!==e&&(e=a,d.trigger("orientationchange"))}var d=a(b),f,e,h,g,m={0:true,180:true};if(a.support.orientation&&(h=a.mobile.media("all and (orientation: landscape)"),g=m[b.orientation],h&&g||!h&&!g))m={"-90":true,90:true};a.event.special.orientationchange={setup:function(){if(a.support.orientation&&a.mobile.orientationChangeEnabled)return false;e=f();d.bind("throttledresize",c)},teardown:function(){if(a.support.orientation&&a.mobile.orientationChangeEnabled)return false;
d.unbind("throttledresize",c)},add:function(a){var b=a.handler;a.handler=function(a){a.orientation=f();return b.apply(this,arguments)}}};a.event.special.orientationchange.orientation=f=function(){var c=true,c=document.documentElement;return(c=a.support.orientation?m[b.orientation]:c&&c.clientWidth/c.clientHeight<1.1)?"portrait":"landscape"}})($,e);(function(){a.event.special.throttledresize={setup:function(){a(this).bind("resize",b)},teardown:function(){a(this).unbind("resize",b)}};var b=function(){f=
(new Date).getTime();e=f-c;e>=250?(c=f,a(this).trigger("throttledresize")):(d&&clearTimeout(d),d=setTimeout(b,250-e))},c=0,d,f,e})();a.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe",swiperight:"swipe"},function(b,c){a.event.special[b]={setup:function(){a(this).bind(c,a.noop)}}})})($,this);
(function(a,e,b){function d(a){a=a||location.href;return"#"+a.replace(/^[^#]*#?(.*)$/,"$1")}var f="hashchange",c=document,h,g=a.event.special,i=c.documentMode,l="on"+f in e&&(i===b||i>7);a.fn[f]=function(a){return a?this.bind(f,a):this.trigger(f)};a.fn[f].delay=50;g[f]=a.extend(g[f],{setup:function(){if(l)return false;a(h.start)},teardown:function(){if(l)return false;a(h.stop)}});h=function(){function h(){var b=d(),c=m(q);if(b!==q)p(q=b,c),a(e).trigger(f);else if(c!==q)location.href=location.href.replace(/#.*/,
"")+c;i=setTimeout(h,a.fn[f].delay)}var g={},i,q=d(),j=function(a){return a},p=j,m=j;g.start=function(){i||h()};g.stop=function(){i&&clearTimeout(i);i=b};a.browser.msie&&!l&&function(){var b,e;g.start=function(){if(!b)e=(e=a.fn[f].src)&&e+d(),b=a('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){e||p(d());h()}).attr("src",e||"javascript:0").insertAfter("body")[0].contentWindow,c.onpropertychange=function(){try{if(event.propertyName==="title")b.document.title=c.title}catch(a){}}};
g.stop=j;m=function(){return d(b.location.href)};p=function(d,e){var h=b.document,g=a.fn[f].domain;if(d!==e)h.title=c.title,h.open(),g&&h.write('<script>document.domain="'+g+'"<\/script>'),h.close(),b.location.hash=d}}();return g}()})($,this);
(function(a){a.widget("mobile.page",a.mobile.widget,{options:{theme:"c",domCache:false,keepNativeDefault:":jqmData(role='none'), :jqmData(role='nojs')"},_create:function(){this._trigger("beforecreate");this.element.attr("tabindex","0").addClass("ui-page ui-body-"+this.options.theme)},keepNativeSelector:function(){var e=this.options;return e.keepNative&&a.trim(e.keepNative)&&e.keepNative!==e.keepNativeDefault?[e.keepNative,e.keepNativeDefault].join(", "):e.keepNativeDefault}})})($);
(function(a,e){var b={};a.extend(a.mobile,{ns:"",subPageUrlKey:"ui-page",activePageClass:"ui-page-active",activeBtnClass:"ui-btn-active",ajaxEnabled:true,hashListeningEnabled:true,linkBindingEnabled:true,defaultPageTransition:"slide",minScrollBack:250,defaultDialogTransition:"pop",loadingMessage:"loading",pageLoadErrorMessage:"Error Loading Page",autoInitializePage:true,pushStateEnabled:true,orientationChangeEnabled:true,gradeA:function(){return a.support.mediaquery||a.mobile.browser.ie&&a.mobile.browser.ie>=
7},keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91},silentScroll:function(b){if(a.type(b)!=="number")b=a.mobile.defaultHomeScroll;a.event.special.scrollstart.enabled=false;
setTimeout(function(){e.scrollTo(0,b);a(document).trigger("silentscroll",{x:0,y:b})},20);setTimeout(function(){a.event.special.scrollstart.enabled=true},150)},nsNormalizeDict:b,nsNormalize:function(c){return!c?void 0:b[c]||(b[c]=a.camelCase(a.mobile.ns+c))},getInheritedTheme:function(a,b){for(var d=a[0],f="",e=/ui-(bar|body)-([a-z])\b/,k,o;d;){k=d.className||"";if((o=e.exec(k))&&(f=o[2]))break;d=d.parentNode}return f||b||"a"},closestPageData:function(a){return a.closest(':jqmData(role="page"), :jqmData(role="dialog")').data("page")}});
a.fn.jqmData=function(b,d){var f;typeof b!="undefined"&&(f=this.data(b?a.mobile.nsNormalize(b):b,d));return f};a.jqmData=function(b,d,f){var e;typeof d!="undefined"&&(e=a.data(b,d?a.mobile.nsNormalize(d):d,f));return e};a.fn.jqmRemoveData=function(b){return this.removeData(a.mobile.nsNormalize(b))};a.jqmRemoveData=function(b,d){return a.removeData(b,a.mobile.nsNormalize(d))};a.fn.removeWithDependents=function(){a.removeWithDependents(this)};a.removeWithDependents=function(b){b=a(b);(b.jqmData("dependents")||
a()).remove();b.remove()};a.fn.addDependents=function(b){a.addDependents(a(this),b)};a.addDependents=function(b,d){var f=a(b).jqmData("dependents")||a();a(b).jqmData("dependents",a.merge(f,d))};a.fn.getEncodedText=function(){return a("<div/>").text(a(this).text()).html()};var d=a.find,f=/:jqmData\(([^)]*)\)/g;a.find=function(b,e,g,i){b=b.replace(f,"[data-"+(a.mobile.ns||"")+"$1]");return d.call(this,b,e,g,i)};a.extend(a.find,d);a.find.matches=function(b,d){return a.find(b,null,null,d)};a.find.matchesSelector=
function(b,d){return a.find(d,null,null,[b]).length>0}})($,this);
(function(a,e){function b(a){var b=a.find(".ui-title:eq(0)");b.length?b.focus():a.focus()}function d(b){p&&(!p.closest(".ui-page-active").length||b)&&p.removeClass(a.mobile.activeBtnClass);p=null}function f(){z=false;A.length>0&&a.mobile.changePage.apply(null,A.pop())}function c(c,d,f,e){var g=a.mobile.urlHistory.getActive(),j=a.support.touchOverflow&&a.mobile.touchOverflowEnabled,i=g.lastScroll||(j?0:a.mobile.defaultHomeScroll),g=h();window.scrollTo(0,a.mobile.defaultHomeScroll);d&&d.data("page")._trigger("beforehide",
null,{nextPage:c});j||c.height(g+i);c.data("page")._trigger("beforeshow",null,{prevPage:d||a("")});a.mobile.hidePageLoadingMsg();j&&i&&(c.addClass("ui-mobile-pre-transition"),b(c),c.is(".ui-native-fixed")?c.find(".ui-content").scrollTop(i):c.scrollTop(i));f=(a.mobile.transitionHandlers[f||"none"]||a.mobile.defaultTransitionHandler)(f,e,c,d);f.done(function(){j||(c.height(""),b(c));j||a.mobile.silentScroll(i);d&&(j||d.height(""),d.data("page")._trigger("hide",null,{nextPage:c}));c.data("page")._trigger("show",
null,{prevPage:d||a("")})});return f}function h(){var b=a.event.special.orientationchange.orientation()==="portrait",c=b?screen.availHeight:screen.availWidth,b=Math.max(b?480:320,a(window).height());return Math.min(c,b)}function g(){(!a.support.touchOverflow||!a.mobile.touchOverflowEnabled)&&a("."+a.mobile.activePageClass).css("min-height",h())}function i(b,c){c&&b.attr("data-"+a.mobile.ns+"role",c);b.page()}function l(a){for(;a;){if(typeof a.nodeName==="string"&&a.nodeName.toLowerCase()=="a")break;
a=a.parentNode}return a}function k(b){var b=a(b).closest(".ui-page").jqmData("url"),c=s.hrefNoHash;if(!b||!j.isPath(b))b=c;return j.makeUrlAbsolute(b,c)}var o=a(window),n=a("html"),q=a("head"),j={urlParseRE:/^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,parseUrl:function(b){if(a.type(b)==="object")return b;b=j.urlParseRE.exec(b||"")||[];return{href:b[0]||"",hrefNoHash:b[1]||
"",hrefNoSearch:b[2]||"",domain:b[3]||"",protocol:b[4]||"",doubleSlash:b[5]||"",authority:b[6]||"",username:b[8]||"",password:b[9]||"",host:b[10]||"",hostname:b[11]||"",port:b[12]||"",pathname:b[13]||"",directory:b[14]||"",filename:b[15]||"",search:b[16]||"",hash:b[17]||""}},makePathAbsolute:function(a,b){if(a&&a.charAt(0)==="/")return a;for(var a=a||"",c=(b=b?b.replace(/^\/|(\/[^\/]*|[^\/]+)$/g,""):"")?b.split("/"):[],d=a.split("/"),f=0;f<d.length;f++){var e=d[f];switch(e){case ".":break;case "..":c.length&&
c.pop();break;default:c.push(e)}}return"/"+c.join("/")},isSameDomain:function(a,b){return j.parseUrl(a).domain===j.parseUrl(b).domain},isRelativeUrl:function(a){return j.parseUrl(a).protocol===""},isAbsoluteUrl:function(a){return j.parseUrl(a).protocol!==""},makeUrlAbsolute:function(a,b){if(!j.isRelativeUrl(a))return a;var c=j.parseUrl(a),d=j.parseUrl(b),f=c.protocol||d.protocol,e=c.protocol?c.doubleSlash:c.doubleSlash||d.doubleSlash,h=c.authority||d.authority,g=c.pathname!=="",i=j.makePathAbsolute(c.pathname||
d.filename,d.pathname);return f+e+h+i+(c.search||!g&&d.search||"")+c.hash},addSearchParams:function(b,c){var d=j.parseUrl(b),f=typeof c==="object"?a.param(c):c,e=d.search||"?";return d.hrefNoSearch+e+(e.charAt(e.length-1)!=="?"?"&":"")+f+(d.hash||"")},convertUrlToDataUrl:function(a){var b=j.parseUrl(a);if(j.isEmbeddedPage(b))return b.hash.split(t)[0].replace(/^#/,"");else if(j.isSameDomain(b,s))return b.hrefNoHash.replace(s.domain,"");return a},get:function(a){if(a===e)a=location.hash;return j.stripHash(a).replace(/[^\/]*\.[^\/*]+$/,
"")},getFilePath:function(b){var c="&"+a.mobile.subPageUrlKey;return b&&b.split(c)[0].split(t)[0]},set:function(a){location.hash=a},isPath:function(a){return/\//.test(a)},clean:function(a){return a.replace(s.domain,"")},stripHash:function(a){return a.replace(/^#/,"")},cleanHash:function(a){return j.stripHash(a.replace(/\?.*$/,"").replace(t,""))},isExternal:function(a){a=j.parseUrl(a);return a.protocol&&a.domain!==v.domain?true:false},hasProtocol:function(a){return/^(:?\w+:)/.test(a)},isFirstPageUrl:function(b){var b=
j.parseUrl(j.makeUrlAbsolute(b,s)),c=a.mobile.firstPage,c=c&&c[0]?c[0].id:e;return(b.hrefNoHash===v.hrefNoHash||x&&b.hrefNoHash===s.hrefNoHash)&&(!b.hash||b.hash==="#"||c&&b.hash.replace(/^#/,"")===c)},isEmbeddedPage:function(a){a=j.parseUrl(a);return a.protocol!==""?a.hash&&(a.hrefNoHash===v.hrefNoHash||x&&a.hrefNoHash===s.hrefNoHash):/^#/.test(a.href)},isPermittedCrossDomainRequest:function(b,c){return a.mobile.allowCrossDomainPages&&b.protocol==="file:"&&c.search(/^https?:/)!=-1}},p=null,m={stack:[],
activeIndex:0,getActive:function(){return m.stack[m.activeIndex]},getPrev:function(){return m.stack[m.activeIndex-1]},getNext:function(){return m.stack[m.activeIndex+1]},addNew:function(a,b,c,d,f){m.getNext()&&m.clearForward();m.stack.push({url:a,transition:b,title:c,pageUrl:d,role:f});m.activeIndex=m.stack.length-1},clearForward:function(){m.stack=m.stack.slice(0,m.activeIndex+1)},directHashChange:function(b){var c,d,f;this.getActive();a.each(m.stack,function(a,e){b.currentUrl===e.url&&(c=a<m.activeIndex,
d=!c,f=a)});this.activeIndex=f!==e?f:this.activeIndex;c?(b.either||b.isBack)(true):d&&(b.either||b.isForward)(false)},ignoreNextHashChange:false},A=[],z=false,t="&ui-state=dialog",w=q.children("base"),v=j.parseUrl(location.href),s=w.length?j.parseUrl(j.makeUrlAbsolute(w.attr("href"),v.href)):v,x=v.hrefNoHash!==s.hrefNoHash,u=a.support.dynamicBaseTag?{element:w.length?w:a("<base>",{href:s.hrefNoHash}).prependTo(q),set:function(a){u.element.attr("href",j.makeUrlAbsolute(a,s))},reset:function(){u.element.attr("href",
s.hrefNoHash)}}:e,C=true,y,E,B;y=function(){var b=o;a.support.touchOverflow&&a.mobile.touchOverflowEnabled&&(b=a(".ui-page-active"),b=b.is(".ui-native-fixed")?b.find(".ui-content"):b);return b};E=function(b){if(C){var c=a.mobile.urlHistory.getActive();if(c)b=b&&b.scrollTop(),c.lastScroll=b<a.mobile.minScrollBack?a.mobile.defaultHomeScroll:b}};B=function(){setTimeout(E,100,a(this))};o.bind(a.support.pushState?"popstate":"hashchange",function(){C=false});o.one(a.support.pushState?"popstate":"hashchange",
function(){C=true});o.one("pagecontainercreate",function(){a.mobile.pageContainer.bind("pagechange",function(){var a=y();C=true;a.unbind("scrollstop",B);a.bind("scrollstop",B)})});y().bind("scrollstop",B);a.mobile.getScreenHeight=h;a.fn.animationComplete=function(b){return a.support.cssTransitions?a(this).one("webkitAnimationEnd",b):(setTimeout(b,0),a(this))};a.mobile.path=j;a.mobile.base=u;a.mobile.urlHistory=m;a.mobile.dialogHashKey=t;a.mobile.noneTransitionHandler=function(b,c,d,f){f&&f.removeClass(a.mobile.activePageClass);
d.addClass(a.mobile.activePageClass);return a.Deferred().resolve(b,c,d,f).promise()};a.mobile.defaultTransitionHandler=a.mobile.noneTransitionHandler;a.mobile.transitionHandlers={none:a.mobile.defaultTransitionHandler};a.mobile.allowCrossDomainPages=false;a.mobile.getDocumentUrl=function(b){return b?a.extend({},v):v.href};a.mobile.getDocumentBase=function(b){return b?a.extend({},s):s.href};a.mobile._bindPageRemove=function(){var b=a(this);!b.data("page").options.domCache&&b.is(":jqmData(external-page='true')")&&
b.bind("pagehide.remove",function(){var b=a(this),c=new a.Event("pageremove");b.trigger(c);c.isDefaultPrevented()||b.removeWithDependents()})};a.mobile.loadPage=function(b,c){var d=a.Deferred(),f=a.extend({},a.mobile.loadPage.defaults,c),h=null,g=null,n=j.makeUrlAbsolute(b,a.mobile.activePage&&k(a.mobile.activePage)||s.hrefNoHash);if(f.data&&f.type==="get")n=j.addSearchParams(n,f.data),f.data=e;if(f.data&&f.type==="post")f.reloadPage=true;var t=j.getFilePath(n),m=j.convertUrlToDataUrl(n);f.pageContainer=
f.pageContainer||a.mobile.pageContainer;h=f.pageContainer.children(":jqmData(url='"+m+"')");h.length===0&&m&&!j.isPath(m)&&(h=f.pageContainer.children("#"+m).attr("data-"+a.mobile.ns+"url",m));if(h.length===0)if(a.mobile.firstPage&&j.isFirstPageUrl(t))a.mobile.firstPage.parent().length&&(h=a(a.mobile.firstPage));else if(j.isEmbeddedPage(t))return d.reject(n,c),d.promise();u&&u.reset();if(h.length){if(!f.reloadPage)return i(h,f.role),d.resolve(n,c,h),d.promise();g=h}var q=f.pageContainer,l=new a.Event("pagebeforeload"),
p={url:b,absUrl:n,dataUrl:m,deferred:d,options:f};q.trigger(l,p);if(l.isDefaultPrevented())return d.promise();if(f.showLoadMsg)var w=setTimeout(function(){a.mobile.showPageLoadingMsg()},f.loadMsgDelay);!a.mobile.allowCrossDomainPages&&!j.isSameDomain(v,n)?d.reject(n,c):a.ajax({url:t,type:f.type,data:f.data,dataType:"html",success:function(e,q,k){var l=a("<div></div>"),o=e.match(/<title[^>]*>([^<]*)/)&&RegExp.$1,s=RegExp("\\bdata-"+a.mobile.ns+"url=[\"']?([^\"'>]*)[\"']?");RegExp("(<[^>]+\\bdata-"+
a.mobile.ns+"role=[\"']?page[\"']?[^>]*>)").test(e)&&RegExp.$1&&s.test(RegExp.$1)&&RegExp.$1&&(b=t=j.getFilePath(RegExp.$1));u&&u.set(t);l.get(0).innerHTML=e;h=l.find(":jqmData(role='page'), :jqmData(role='dialog')").first();h.length||(h=a("<div data-"+a.mobile.ns+"role='page'>"+e.split(/<\/?body[^>]*>/gmi)[1]+"</div>"));o&&!h.jqmData("title")&&(~o.indexOf("&")&&(o=a("<div>"+o+"</div>").text()),h.jqmData("title",o));if(!a.support.dynamicBaseTag){var v=j.get(t);h.find("[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]").each(function(){var b=
a(this).is("[href]")?"href":a(this).is("[src]")?"src":"action",c=a(this).attr(b),c=c.replace(location.protocol+"//"+location.host+location.pathname,"");/^(\w+:|#|\/)/.test(c)||a(this).attr(b,v+c)})}h.attr("data-"+a.mobile.ns+"url",j.convertUrlToDataUrl(t)).attr("data-"+a.mobile.ns+"external-page",true).appendTo(f.pageContainer);h.one("pagecreate",a.mobile._bindPageRemove);i(h,f.role);n.indexOf("&"+a.mobile.subPageUrlKey)>-1&&(h=f.pageContainer.children(":jqmData(url='"+m+"')"));f.showLoadMsg&&(clearTimeout(w),
a.mobile.hidePageLoadingMsg());p.xhr=k;p.textStatus=q;p.page=h;f.pageContainer.trigger("pageload",p);d.resolve(n,c,h,g)},error:function(b,e,h){u&&u.set(j.get());p.xhr=b;p.textStatus=e;p.errorThrown=h;b=new a.Event("pageloadfailed");f.pageContainer.trigger(b,p);b.isDefaultPrevented()||(f.showLoadMsg&&(clearTimeout(w),a.mobile.hidePageLoadingMsg(),a("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>"+a.mobile.pageLoadErrorMessage+"</h1></div>").css({display:"block",opacity:0.96,
top:o.scrollTop()+100}).appendTo(f.pageContainer).delay(800).fadeOut(400,function(){a(this).remove()})),d.reject(n,c))}});return d.promise()};a.mobile.loadPage.defaults={type:"get",data:e,reloadPage:false,role:e,showLoadMsg:false,pageContainer:e,loadMsgDelay:50};a.mobile.changePage=function(b,h){if(z)A.unshift(arguments);else{var g=a.extend({},a.mobile.changePage.defaults,h);g.pageContainer=g.pageContainer||a.mobile.pageContainer;g.fromPage=g.fromPage||a.mobile.activePage;var q=g.pageContainer,l=
new a.Event("pagebeforechange"),k={toPage:b,options:g};q.trigger(l,k);if(!l.isDefaultPrevented())if(b=k.toPage,z=true,typeof b=="string")a.mobile.loadPage(b,g).done(function(b,c,d,f){z=false;c.duplicateCachedPage=f;a.mobile.changePage(d,c)}).fail(function(){z=false;d(true);f();g.pageContainer.trigger("pagechangefailed",k)});else{if(b[0]===a.mobile.firstPage[0]&&!g.dataUrl)g.dataUrl=v.hrefNoHash;var l=g.fromPage,p=g.dataUrl&&j.convertUrlToDataUrl(g.dataUrl)||b.jqmData("url"),o=p;j.getFilePath(p);var s=
m.getActive(),w=m.activeIndex===0,x=0,u=document.title,y=g.role==="dialog"||b.jqmData("role")==="dialog";if(l&&l[0]===b[0]&&!g.allowSamePageTransition)z=false,q.trigger("pagechange",k);else{i(b,g.role);g.fromHashChange&&m.directHashChange({currentUrl:p,isBack:function(){x=-1},isForward:function(){x=1}});try{document.activeElement&&document.activeElement.nodeName.toLowerCase()!="body"?a(document.activeElement).blur():a("input:focus, textarea:focus, select:focus").blur()}catch(C){}y&&s&&(p=(s.url||
"")+t);if(g.changeHash!==false&&p)m.ignoreNextHashChange=true,j.set(p);var B=!s?u:b.jqmData("title")||b.children(":jqmData(role='header')").find(".ui-title").getEncodedText();B&&u==document.title&&(u=B);b.jqmData("title")||b.jqmData("title",u);g.transition=g.transition||(x&&!w?s.transition:e)||(y?a.mobile.defaultDialogTransition:a.mobile.defaultPageTransition);x||m.addNew(p,g.transition,u,o,g.role);document.title=m.getActive().title;a.mobile.activePage=b;g.reverse=g.reverse||x<0;c(b,l,g.transition,
g.reverse).done(function(){d();g.duplicateCachedPage&&g.duplicateCachedPage.remove();n.removeClass("ui-mobile-rendering");f();q.trigger("pagechange",k)})}}}};a.mobile.changePage.defaults={transition:e,reverse:false,changeHash:true,fromHashChange:false,role:e,duplicateCachedPage:e,pageContainer:e,showLoadMsg:true,dataUrl:e,fromPage:e,allowSamePageTransition:false};a.mobile._registerInternalEvents=function(){a(document).delegate("form","submit",function(b){var c=a(this);if(a.mobile.ajaxEnabled&&!c.is(":jqmData(ajax='false')")){var d=
c.attr("method"),f=c.attr("target"),e=c.attr("action");if(!e&&(e=k(c),e===s.hrefNoHash))e=v.hrefNoSearch;e=j.makeUrlAbsolute(e,k(c));j.isExternal(e)&&!j.isPermittedCrossDomainRequest(v,e)||f||(a.mobile.changePage(e,{type:d&&d.length&&d.toLowerCase()||"get",data:c.serialize(),transition:c.jqmData("transition"),direction:c.jqmData("direction"),reloadPage:true}),b.preventDefault())}});a(document).bind("vclick",function(b){if(!(b.which>1)&&a.mobile.linkBindingEnabled&&(b=l(b.target))&&j.parseUrl(b.getAttribute("href")||
"#").hash!=="#")d(true),p=a(b).closest(".ui-btn").not(".ui-disabled"),p.addClass(a.mobile.activeBtnClass),a("."+a.mobile.activePageClass+" .ui-btn").not(b).blur()});a(document).bind("click",function(b){if(a.mobile.linkBindingEnabled){var c=l(b.target);if(c&&!(b.which>1)){var f=a(c),h=function(){window.setTimeout(function(){d(true)},200)};if(f.is(":jqmData(rel='back')"))return window.history.back(),false;var g=k(f),c=j.makeUrlAbsolute(f.attr("href")||"#",g);if(!a.mobile.ajaxEnabled&&!j.isEmbeddedPage(c))h();
else{if(c.search("#")!=-1)if(c=c.replace(/[^#]*#/,""))c=j.isPath(c)?j.makeUrlAbsolute(c,g):j.makeUrlAbsolute("#"+c,v.hrefNoHash);else{b.preventDefault();return}f.is("[rel='external']")||f.is(":jqmData(ajax='false')")||f.is("[target]")||j.isExternal(c)&&!j.isPermittedCrossDomainRequest(v,c)?h():(h=f.jqmData("transition"),g=(g=f.jqmData("direction"))&&g==="reverse"||f.jqmData("back"),f=f.attr("data-"+a.mobile.ns+"rel")||e,a.mobile.changePage(c,{transition:h,reverse:g,role:f}),b.preventDefault())}}}});
a(document).delegate(".ui-page","pageshow.prefetch",function(){var b=[];a(this).find("a:jqmData(prefetch)").each(function(){var c=a(this),f=c.attr("href");f&&a.inArray(f,b)===-1&&(b.push(f),a.mobile.loadPage(f,{role:c.attr("data-"+a.mobile.ns+"rel")}))})});a.mobile._handleHashChange=function(b){var c=j.stripHash(b),f={transition:a.mobile.urlHistory.stack.length===0?"none":e,changeHash:false,fromHashChange:true};if(!a.mobile.hashListeningEnabled||m.ignoreNextHashChange)m.ignoreNextHashChange=false;
else{if(m.stack.length>1&&c.indexOf(t)>-1)if(a.mobile.activePage.is(".ui-dialog"))m.directHashChange({currentUrl:c,either:function(b){var d=a.mobile.urlHistory.getActive();c=d.pageUrl;a.extend(f,{role:d.role,transition:d.transition,reverse:b})}});else{m.directHashChange({currentUrl:c,isBack:function(){window.history.back()},isForward:function(){window.history.forward()}});return}c?(c=typeof c==="string"&&!j.isPath(c)?j.makeUrlAbsolute("#"+c,s):c,a.mobile.changePage(c,f)):a.mobile.changePage(a.mobile.firstPage,
f)}};o.bind("hashchange",function(){a.mobile._handleHashChange(location.hash)});a(document).bind("pageshow",g);a(window).bind("throttledresize",g)}})($);
(function(a,e){var b={},d=a(e),f=a.mobile.path.parseUrl(location.href);a.extend(b,{initialFilePath:f.pathname+f.search,initialHref:f.hrefNoHash,hashchangeFired:false,state:function(){return{hash:location.hash||"#"+b.initialFilePath,title:document.title,initialHref:b.initialHref}},resetUIKeys:function(b){var f="&"+a.mobile.subPageUrlKey,d=b.indexOf(a.mobile.dialogHashKey);d>-1?b=b.slice(0,d)+"#"+b.slice(d):b.indexOf(f)>-1&&(b=b.split(f).join("#"+f));return b},nextHashChangePrevented:function(c){a.mobile.urlHistory.ignoreNextHashChange=
c;b.onHashChangeDisabled=c},onHashChange:function(){if(!b.onHashChangeDisabled){var c,f;c=location.hash;var d=a.mobile.path.isPath(c),e=d?location.href:a.mobile.getDocumentUrl();c=d?c.replace("#",""):c;f=b.state();c=a.mobile.path.makeUrlAbsolute(c,e);d&&(c=b.resetUIKeys(c));history.replaceState(f,document.title,c)}},onPopState:function(c){var f=c.originalEvent.state;f&&(b.nextHashChangePrevented(true),setTimeout(function(){b.nextHashChangePrevented(false);a.mobile._handleHashChange(f.hash)},100))},
init:function(){d.bind("hashchange",b.onHashChange);d.bind("popstate",b.onPopState);location.hash===""&&history.replaceState(b.state(),document.title,location.href)}});a(function(){a.mobile.pushStateEnabled&&a.support.pushState&&b.init()})})($,this);
(function(a){function e(b,d,f,c){var e=new a.Deferred,g=d?" reverse":"",i="ui-mobile-viewport-transitioning viewport-"+b;f.animationComplete(function(){f.add(c).removeClass("out in reverse "+b);c&&c[0]!==f[0]&&c.removeClass(a.mobile.activePageClass);f.parent().removeClass(i);e.resolve(b,d,f,c)});f.parent().addClass(i);c&&c.addClass(b+" out"+g);f.addClass(a.mobile.activePageClass+" "+b+" in"+g);return e.promise()}a.mobile.css3TransitionHandler=e;if(a.mobile.defaultTransitionHandler===a.mobile.noneTransitionHandler)a.mobile.defaultTransitionHandler=
e})($,this);
(function(a){a.mobile.page.prototype.options.degradeInputs={color:false,date:false,datetime:false,"datetime-local":false,email:false,month:false,number:false,range:"number",search:"text",tel:false,time:false,url:false,week:false};a(document).bind("pagecreate create",function(e){var b=a.mobile.closestPageData(a(e.target));if(b)options=b.options,a(e.target).find("input").not(b.keepNativeSelector()).each(function(){var b=a(this),f=this.getAttribute("type"),c=options.degradeInputs[f]||"text";if(options.degradeInputs[f]){var e=
a("<div>").html(b.clone()).html(),g=e.indexOf(" type=")>-1;b.replaceWith(e.replace(g?/\s+type=["']?\w+['"]?/:/\/?>/,' type="'+c+'" data-'+a.mobile.ns+'type="'+f+'"'+(g?"":">")))}})})})($);
(function(a,e){a.widget("mobile.dialog",a.mobile.widget,{options:{closeBtnText:"Close",overlayTheme:"a",initSelector:":jqmData(role='dialog')"},_create:function(){var b=this,d=this.element,f=a("<a href='#' data-"+a.mobile.ns+"icon='delete' data-"+a.mobile.ns+"iconpos='notext'>"+this.options.closeBtnText+"</a>");d.addClass("ui-overlay-"+this.options.overlayTheme);d.attr("role","dialog").addClass("ui-dialog").find(":jqmData(role='header')").addClass("ui-corner-top ui-overlay-shadow").prepend(f).end().find(":jqmData(role='content'),:jqmData(role='footer')").addClass("ui-overlay-shadow").last().addClass("ui-corner-bottom");
f.bind("click",function(){b.close()});d.bind("vclick submit",function(b){var b=a(b.target).closest(b.type==="vclick"?"a":"form"),f;b.length&&!b.jqmData("transition")&&(f=a.mobile.urlHistory.getActive()||{},b.attr("data-"+a.mobile.ns+"transition",f.transition||a.mobile.defaultDialogTransition).attr("data-"+a.mobile.ns+"direction","reverse"))}).bind("pagehide",function(){a(this).find("."+a.mobile.activeBtnClass).removeClass(a.mobile.activeBtnClass)})},close:function(){e.history.back()}});a(document).delegate(a.mobile.dialog.prototype.options.initSelector,
"pagecreate",function(){a(this).dialog()})})($,this);
(function(a){a.mobile.page.prototype.options.backBtnText="Back";a.mobile.page.prototype.options.addBackBtn=false;a.mobile.page.prototype.options.backBtnTheme=null;a.mobile.page.prototype.options.headerTheme="a";a.mobile.page.prototype.options.footerTheme="a";a.mobile.page.prototype.options.contentTheme=null;a(document).delegate(":jqmData(role='page'), :jqmData(role='dialog')","pagecreate",function(){var e=a(this),b=e.data("page").options,d=e.jqmData("role"),f=b.theme;a(":jqmData(role='header'), :jqmData(role='footer'), :jqmData(role='content')",
this).each(function(){var c=a(this),e=c.jqmData("role"),g=c.jqmData("theme"),i=g||b.contentTheme||d==="dialog"&&f,l;c.addClass("ui-"+e);if(e==="header"||e==="footer"){var k=g||(e==="header"?b.headerTheme:b.footerTheme)||f;c.addClass("ui-bar-"+k).attr("role",e==="header"?"banner":"contentinfo");g=c.children("a");i=g.hasClass("ui-btn-left");l=g.hasClass("ui-btn-right");i=i||g.eq(0).not(".ui-btn-right").addClass("ui-btn-left").length;l||g.eq(1).addClass("ui-btn-right");b.addBackBtn&&e==="header"&&a(".ui-page").length>
1&&c.jqmData("url")!==a.mobile.path.stripHash(location.hash)&&!i&&a("<a href='#' class='ui-btn-left' data-"+a.mobile.ns+"rel='back' data-"+a.mobile.ns+"icon='arrow-l'>"+b.backBtnText+"</a>").attr("data-"+a.mobile.ns+"theme",b.backBtnTheme||k).prependTo(c);c.children("h1, h2, h3, h4, h5, h6").addClass("ui-title").attr({tabindex:"0",role:"heading","aria-level":"1"})}else e==="content"&&(i&&c.addClass("ui-body-"+i),c.attr("role","main"))})})})($);
(function(a){a.widget("mobile.collapsible",a.mobile.widget,{options:{expandCueText:" click to expand contents",collapseCueText:" click to collapse contents",collapsed:true,heading:"h1,h2,h3,h4,h5,h6,legend",theme:null,contentTheme:null,iconTheme:"d",initSelector:":jqmData(role='collapsible')"},_create:function(){var e=this.element,b=this.options,d=e.addClass("ui-collapsible"),f=e.children(b.heading).first(),c=d.wrapInner("<div class='ui-collapsible-content'></div>").find(".ui-collapsible-content"),
h=e.closest(":jqmData(role='collapsible-set')").addClass("ui-collapsible-set");f.is("legend")&&(f=a("<div role='heading'>"+f.html()+"</div>").insertBefore(f),f.next().remove());if(h.length){if(!b.theme)b.theme=h.jqmData("theme");if(!b.contentTheme)b.contentTheme=h.jqmData("content-theme")}c.addClass(b.contentTheme?"ui-body-"+b.contentTheme:"");f.insertBefore(c).addClass("ui-collapsible-heading").append("<span class='ui-collapsible-heading-status'></span>").wrapInner("<a href='#' class='ui-collapsible-heading-toggle'></a>").find("a").first().buttonMarkup({shadow:false,
corners:false,iconPos:"left",icon:"plus",theme:b.theme}).add(".ui-btn-inner").addClass("ui-corner-top ui-corner-bottom");d.bind("expand collapse",function(e){if(!e.isDefaultPrevented()){e.preventDefault();var i=a(this),e=e.type==="collapse",l=b.contentTheme;f.toggleClass("ui-collapsible-heading-collapsed",e).find(".ui-collapsible-heading-status").text(e?b.expandCueText:b.collapseCueText).end().find(".ui-icon").toggleClass("ui-icon-minus",!e).toggleClass("ui-icon-plus",e);i.toggleClass("ui-collapsible-collapsed",
e);c.toggleClass("ui-collapsible-content-collapsed",e).attr("aria-hidden",e);if(l&&(!h.length||d.jqmData("collapsible-last")))f.find("a").first().add(f.find(".ui-btn-inner")).toggleClass("ui-corner-bottom",e),c.toggleClass("ui-corner-bottom",!e);c.trigger("updatelayout")}}).trigger(b.collapsed?"collapse":"expand");f.bind("click",function(a){var b=f.is(".ui-collapsible-heading-collapsed")?"expand":"collapse";d.trigger(b);a.preventDefault()})}});a(document).bind("pagecreate create",function(e){a(a.mobile.collapsible.prototype.options.initSelector,
e.target).collapsible()})})($);
(function(a){a.widget("mobile.collapsibleset",a.mobile.widget,{options:{initSelector:":jqmData(role='collapsible-set')"},_create:function(){var e=this.element.addClass("ui-collapsible-set"),b=this.options,d=e.children(":jqmData(role='collapsible')");if(!b.theme)b.theme=e.jqmData("theme");if(!b.contentTheme)b.contentTheme=e.jqmData("content-theme");e.jqmData("collapsiblebound")||(e.jqmData("collapsiblebound",true).bind("expand collapse",function(b){var c=b.type==="collapse",b=a(b.target).closest(".ui-collapsible"),
d=b.data("collapsible");d.options.contentTheme&&b.jqmData("collapsible-last")&&(b.find(d.options.heading).first().find("a").first().add(".ui-btn-inner").toggleClass("ui-corner-bottom",c),b.find(".ui-collapsible-content").toggleClass("ui-corner-bottom",!c))}).bind("expand",function(b){a(b.target).closest(".ui-collapsible").siblings(".ui-collapsible").trigger("collapse")}),d.each(function(){a(this).find(a.mobile.collapsible.prototype.options.heading).find("a").first().add(".ui-btn-inner").removeClass("ui-corner-top ui-corner-bottom")}),
d.first().find("a").first().addClass("ui-corner-top").find(".ui-btn-inner").addClass("ui-corner-top"),d.last().jqmData("collapsible-last",true).find("a").first().addClass("ui-corner-bottom").find(".ui-btn-inner").addClass("ui-corner-bottom"))}});a(document).bind("pagecreate create",function(e){a(a.mobile.collapsibleset.prototype.options.initSelector,e.target).collapsibleset()})})($);
(function(a){a.fn.fieldcontain=function(){return this.addClass("ui-field-contain ui-body ui-br")};a(document).bind("pagecreate create",function(e){a(":jqmData(role='fieldcontain')",e.target).fieldcontain()})})($);
(function(a){a.fn.grid=function(e){return this.each(function(){var b=a(this),d=a.extend({grid:null},e),f=b.children(),c={solo:1,a:2,b:3,c:4,d:5},d=d.grid;if(!d)if(f.length<=5)for(var h in c)c[h]===f.length&&(d=h);else d="a";c=c[d];b.addClass("ui-grid-"+d);f.filter(":nth-child("+c+"n+1)").addClass("ui-block-a");c>1&&f.filter(":nth-child("+c+"n+2)").addClass("ui-block-b");c>2&&f.filter(":nth-child(3n+3)").addClass("ui-block-c");c>3&&f.filter(":nth-child(4n+4)").addClass("ui-block-d");c>4&&f.filter(":nth-child(5n+5)").addClass("ui-block-e")})}})($);
(function(a,e){a.widget("mobile.navbar",a.mobile.widget,{options:{iconpos:"top",grid:null,initSelector:":jqmData(role='navbar')"},_create:function(){var b=this.element,d=b.find("a"),f=d.filter(":jqmData(icon)").length?this.options.iconpos:e;b.addClass("ui-navbar").attr("role","navigation").find("ul").grid({grid:this.options.grid});f||b.addClass("ui-navbar-noicons");d.buttonMarkup({corners:false,shadow:false,iconpos:f});b.delegate("a","vclick",function(b){a(b.target).hasClass("ui-disabled")||(d.not(".ui-state-persist").removeClass(a.mobile.activeBtnClass),
a(this).addClass(a.mobile.activeBtnClass))})}});a(document).bind("pagecreate create",function(b){a(a.mobile.navbar.prototype.options.initSelector,b.target).navbar()})})($);
(function(a){var e={};a.widget("mobile.listview",a.mobile.widget,{options:{theme:null,countTheme:"c",headerTheme:"b",dividerTheme:"b",splitIcon:"arrow-r",splitTheme:"b",inset:false,initSelector:":jqmData(role='listview')"},_create:function(){var a=this;a.element.addClass(function(d,f){return f+" ui-listview "+(a.options.inset?" ui-listview-inset ui-corner-all ui-shadow ":"")});a.refresh(true)},_removeCorners:function(a,d){a=a.add(a.find(".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb"));d==="top"?a.removeClass("ui-corner-top ui-corner-tr ui-corner-tl"):
d==="bottom"?a.removeClass("ui-corner-bottom ui-corner-br ui-corner-bl"):a.removeClass("ui-corner-top ui-corner-tr ui-corner-tl ui-corner-bottom ui-corner-br ui-corner-bl")},_refreshCorners:function(a){var d,f;this.options.inset&&(d=this.element.children("li"),f=a?d.not(".ui-screen-hidden"):d.filter(":visible"),this._removeCorners(d),d=f.first().addClass("ui-corner-top"),d.add(d.find(".ui-btn-inner").not(".ui-li-link-alt span:first-child")).addClass("ui-corner-top").end().find(".ui-li-link-alt, .ui-li-link-alt span:first-child").addClass("ui-corner-tr").end().find(".ui-li-thumb").not(".ui-li-icon").addClass("ui-corner-tl"),
f=f.last().addClass("ui-corner-bottom"),f.add(f.find(".ui-btn-inner")).find(".ui-li-link-alt").addClass("ui-corner-br").end().find(".ui-li-thumb").not(".ui-li-icon").addClass("ui-corner-bl"));a||this.element.trigger("updatelayout")},_findFirstElementByTagName:function(a,d,f,c){var e={};for(e[f]=e[c]=true;a;){if(e[a.nodeName])return a;a=a[d]}return null},_getChildrenByTagName:function(b,d,f){var c=[],e={};e[d]=e[f]=true;for(b=b.firstChild;b;)e[b.nodeName]&&c.push(b),b=b.nextSibling;return a(c)},_addThumbClasses:function(b){var d,
f,c=b.length;for(d=0;d<c;d++)f=a(this._findFirstElementByTagName(b[d].firstChild,"nextSibling","img","IMG")),f.length&&(f.addClass("ui-li-thumb"),a(this._findFirstElementByTagName(f[0].parentNode,"parentNode","li","LI")).addClass(f.is(".ui-li-icon")?"ui-li-has-icon":"ui-li-has-thumb"))},refresh:function(b){this.parentPage=this.element.closest(".ui-page");this._createSubPages();var d=this.options,f=this.element,c=f.jqmData("dividertheme")||d.dividerTheme,e=f.jqmData("splittheme"),g=f.jqmData("spliticon"),
i=this._getChildrenByTagName(f[0],"li","LI"),l=a.support.cssPseudoElement||!a.nodeName(f[0],"ol")?0:1,k={},o,n,q,j,p;l&&f.find(".ui-li-dec").remove();if(!d.theme)d.theme=a.mobile.getInheritedTheme(this.element,"c");for(var m=0,A=i.length;m<A;m++){o=i.eq(m);n="ui-li";if(b||!o.hasClass("ui-li"))q=o.jqmData("theme")||d.theme,j=this._getChildrenByTagName(o[0],"a","A"),j.length?(p=o.jqmData("icon"),o.buttonMarkup({wrapperEls:"div",shadow:false,corners:false,iconpos:"right",icon:j.length>1||p===false?false:
p||"arrow-r",theme:q}),p!=false&&j.length==1&&o.addClass("ui-li-has-arrow"),j.first().addClass("ui-link-inherit"),j.length>1&&(n+=" ui-li-has-alt",j=j.last(),p=e||j.jqmData("theme")||d.splitTheme,j.appendTo(o).attr("title",j.getEncodedText()).addClass("ui-li-link-alt").empty().buttonMarkup({shadow:false,corners:false,theme:q,icon:false,iconpos:false}).find(".ui-btn-inner").append(a(document.createElement("span")).buttonMarkup({shadow:true,corners:true,theme:p,iconpos:"notext",icon:g||j.jqmData("icon")||
d.splitIcon})))):o.jqmData("role")==="list-divider"?(n+=" ui-li-divider ui-btn ui-bar-"+c,o.attr("role","heading"),l&&(l=1)):n+=" ui-li-static ui-body-"+q;l&&n.indexOf("ui-li-divider")<0&&(q=o.is(".ui-li-static:first")?o:o.find(".ui-link-inherit"),q.addClass("ui-li-jsnumbering").prepend("<span class='ui-li-dec'>"+l++ +". </span>"));k[n]||(k[n]=[]);k[n].push(o[0])}for(n in k)a(k[n]).addClass(n).children(".ui-btn-inner").addClass(n);f.find("h1, h2, h3, h4, h5, h6").addClass("ui-li-heading").end().find("p, dl").addClass("ui-li-desc").end().find(".ui-li-aside").each(function(){var b=
a(this);b.prependTo(b.parent())}).end().find(".ui-li-count").each(function(){a(this).closest("li").addClass("ui-li-has-count")}).addClass("ui-btn-up-"+(f.jqmData("counttheme")||this.options.countTheme)+" ui-btn-corner-all");this._addThumbClasses(i);this._addThumbClasses(f.find(".ui-link-inherit"));this._refreshCorners(b)},_idStringEscape:function(a){return a.replace(/[^a-zA-Z0-9]/g,"-")},_createSubPages:function(){var b=this.element,d=b.closest(".ui-page"),f=d.jqmData("url"),c=f||d[0][a.expando],
h=b.attr("id"),g=this.options,i="data-"+a.mobile.ns,l=this,k=d.find(":jqmData(role='footer')").jqmData("id"),o;typeof e[c]==="undefined"&&(e[c]=-1);h=h||++e[c];a(b.find("li>ul, li>ol").toArray().reverse()).each(function(c){var d=a(this),e=d.attr("id")||h+"-"+c,c=d.parent(),l=a(d.prevAll().toArray().reverse()),l=l.length?l:a("<span>"+a.trim(c.contents()[0].nodeValue)+"</span>"),m=l.first().getEncodedText(),e=(f||"")+"&"+a.mobile.subPageUrlKey+"="+e,A=d.jqmData("theme")||g.theme,z=d.jqmData("counttheme")||
b.jqmData("counttheme")||g.countTheme;o=true;d.detach().wrap("<div "+i+"role='page' "+i+"url='"+e+"' "+i+"theme='"+A+"' "+i+"count-theme='"+z+"'><div "+i+"role='content'></div></div>").parent().before("<div "+i+"role='header' "+i+"theme='"+g.headerTheme+"'><div class='ui-title'>"+m+"</div></div>").after(k?a("<div "+i+"role='footer' "+i+"id='"+k+"'>"):"").parent().appendTo(a.mobile.pageContainer).page();d=c.find("a:first");d.length||(d=a("<a/>").html(l||m).prependTo(c.empty()));d.attr("href","#"+e)}).listview();
o&&d.is(":jqmData(external-page='true')")&&d.data("page").options.domCache===false&&d.unbind("pagehide.remove").bind("pagehide.remove",function(b,c){var e=c.nextPage;c.nextPage&&(e=e.jqmData("url"),e.indexOf(f+"&"+a.mobile.subPageUrlKey)!==0&&(l.childPages().remove(),d.remove()))})},childPages:function(){var b=this.parentPage.jqmData("url");return a(":jqmData(url^='"+b+"&"+a.mobile.subPageUrlKey+"')")}});a(document).bind("pagecreate create",function(b){a(a.mobile.listview.prototype.options.initSelector,
b.target).listview()})})($);
(function(a){a.mobile.listview.prototype.options.filter=false;a.mobile.listview.prototype.options.filterPlaceholder="Filter items...";a.mobile.listview.prototype.options.filterTheme="c";a.mobile.listview.prototype.options.filterCallback=function(a,b){return a.toLowerCase().indexOf(b)===-1};a(document).delegate(":jqmData(role='listview')","listviewcreate",function(){var e=a(this),b=e.data("listview");if(b.options.filter){var d=a("<form>",{"class":"ui-listview-filter ui-bar-"+b.options.filterTheme,
role:"search"});a("<input>",{placeholder:b.options.filterPlaceholder}).attr("data-"+a.mobile.ns+"type","search").jqmData("lastval","").bind("keyup change",function(){var d=a(this),c=this.value.toLowerCase(),h=null,h=d.jqmData("lastval")+"",g=false,i="";d.jqmData("lastval",c);h=c.length<h.length||c.indexOf(h)!==0?e.children():e.children(":not(.ui-screen-hidden)");if(c){for(var l=h.length-1;l>=0;l--)d=a(h[l]),i=d.jqmData("filtertext")||d.text(),d.is("li:jqmData(role=list-divider)")?(d.toggleClass("ui-filter-hidequeue",
!g),g=false):b.options.filterCallback(i,c)?d.toggleClass("ui-filter-hidequeue",true):g=true;h.filter(":not(.ui-filter-hidequeue)").toggleClass("ui-screen-hidden",false);h.filter(".ui-filter-hidequeue").toggleClass("ui-screen-hidden",true).toggleClass("ui-filter-hidequeue",false)}else h.toggleClass("ui-screen-hidden",false);b._refreshCorners()}).appendTo(d).textinput();a(this).jqmData("inset")&&d.addClass("ui-listview-filter-inset");d.bind("submit",function(){return false}).insertBefore(e)}})})($);
(function(a){a(document).bind("pagecreate create",function(e){a(":jqmData(role='nojs')",e.target).addClass("ui-nojs")})})($);
(function(a,e){a.widget("mobile.checkboxradio",a.mobile.widget,{options:{theme:null,initSelector:"input[type='checkbox'],input[type='radio']"},_create:function(){var b=this,d=this.element,f=d.closest("form,fieldset,:jqmData(role='page')").find("label").filter("[for='"+d[0].id+"']"),c=d.attr("type"),h=c+"-on",g=c+"-off",i=d.parents(":jqmData(type='horizontal')").length?e:g;if(!(c!=="checkbox"&&c!=="radio")){a.extend(this,{label:f,inputtype:c,checkedClass:"ui-"+h+(i?"":" "+a.mobile.activeBtnClass),
uncheckedClass:"ui-"+g,checkedicon:"ui-icon-"+h,uncheckedicon:"ui-icon-"+g});if(!this.options.theme)this.options.theme=this.element.jqmData("theme");f.buttonMarkup({theme:this.options.theme,icon:i,shadow:false});d.add(f).wrapAll("<div class='ui-"+c+"'></div>");f.bind({vmouseover:function(b){a(this).parent().is(".ui-disabled")&&b.stopPropagation()},vclick:function(a){if(d.is(":disabled"))a.preventDefault();else return b._cacheVals(),d.prop("checked",c==="radio"&&true||!d.prop("checked")),d.triggerHandler("click"),
b._getInputSet().not(d).prop("checked",false),b._updateAll(),false}});d.bind({vmousedown:function(){b._cacheVals()},vclick:function(){var c=a(this);c.is(":checked")?(c.prop("checked",true),b._getInputSet().not(c).prop("checked",false)):c.prop("checked",false);b._updateAll()},focus:function(){f.addClass("ui-focus")},blur:function(){f.removeClass("ui-focus")}});this.refresh()}},_cacheVals:function(){this._getInputSet().each(function(){var b=a(this);b.jqmData("cacheVal",b.is(":checked"))})},_getInputSet:function(){return this.inputtype==
"checkbox"?this.element:this.element.closest("form,fieldset,:jqmData(role='page')").find("input[name='"+this.element.attr("name")+"'][type='"+this.inputtype+"']")},_updateAll:function(){var b=this;this._getInputSet().each(function(){var d=a(this);(d.is(":checked")||b.inputtype==="checkbox")&&d.trigger("change")}).checkboxradio("refresh")},refresh:function(){var b=this.element,d=this.label,f=d.find(".ui-icon");a(b[0]).prop("checked")?(d.addClass(this.checkedClass).removeClass(this.uncheckedClass),
f.addClass(this.checkedicon).removeClass(this.uncheckedicon)):(d.removeClass(this.checkedClass).addClass(this.uncheckedClass),f.removeClass(this.checkedicon).addClass(this.uncheckedicon));b.is(":disabled")?this.disable():this.enable()},disable:function(){this.element.prop("disabled",true).parent().addClass("ui-disabled")},enable:function(){this.element.prop("disabled",false).parent().removeClass("ui-disabled")}});a(document).bind("pagecreate create",function(b){a.mobile.checkboxradio.prototype.enhanceWithin(b.target)})})($);
(function(a,e){a.widget("mobile.button",a.mobile.widget,{options:{theme:null,icon:null,iconpos:null,inline:null,corners:true,shadow:true,iconshadow:true,initSelector:"button, [type='button'], [type='submit'], [type='reset'], [type='image']"},_create:function(){var b=this.element,d=this.options,f,c;b[0].tagName==="A"?b.hasClass("ui-btn")||b.buttonMarkup():(this.button=a("<div></div>").text(b.text()||b.val()).insertBefore(b).buttonMarkup({theme:d.theme,icon:d.icon,iconpos:d.iconpos,inline:d.inline,
corners:d.corners,shadow:d.shadow,iconshadow:d.iconshadow}).append(b.addClass("ui-btn-hidden")),d=b.attr("type"),f=b.attr("name"),d!=="button"&&d!=="reset"&&f&&b.bind("vclick",function(){c===e&&(c=a("<input>",{type:"hidden",name:b.attr("name"),value:b.attr("value")}).insertBefore(b),a(document).one("submit",function(){c.remove();c=e}))}),this.refresh())},enable:function(){this.element.attr("disabled",false);this.button.removeClass("ui-disabled").attr("aria-disabled",false);return this._setOption("disabled",
false)},disable:function(){this.element.attr("disabled",true);this.button.addClass("ui-disabled").attr("aria-disabled",true);return this._setOption("disabled",true)},refresh:function(){var a=this.element;a.prop("disabled")?this.disable():this.enable();this.button.data("textWrapper").text(a.text()||a.val())}});a(document).bind("pagecreate create",function(b){a.mobile.button.prototype.enhanceWithin(b.target)})})($);
(function(a,e){a.widget("mobile.slider",a.mobile.widget,{options:{theme:null,trackTheme:null,disabled:false,initSelector:"input[type='range'], :jqmData(type='range'), :jqmData(role='slider')"},_create:function(){var b=this,d=this.element,f=a.mobile.getInheritedTheme(d,"c"),c=this.options.theme||f,h=this.options.trackTheme||f,g=d[0].nodeName.toLowerCase(),f=g=="select"?"ui-slider-switch":"",i=d.attr("id"),l=i+"-label",i=a("[for='"+i+"']").attr("id",l),k=function(){return g=="input"?parseFloat(d.val()):
d[0].selectedIndex},o=g=="input"?parseFloat(d.attr("min")):0,n=g=="input"?parseFloat(d.attr("max")):d.find("option").length-1,q=window.parseFloat(d.attr("step")||1),j=a("<div class='ui-slider "+f+" ui-btn-down-"+h+" ui-btn-corner-all' role='application'></div>"),p=a("<a href='#' class='ui-slider-handle'></a>").appendTo(j).buttonMarkup({corners:true,theme:c,shadow:true}).attr({role:"slider","aria-valuemin":o,"aria-valuemax":n,"aria-valuenow":k(),"aria-valuetext":k(),title:k(),"aria-labelledby":l});
a.extend(this,{slider:j,handle:p,dragging:false,beforeStart:null,userModified:false,mouseMoved:false});g=="select"&&(j.wrapInner("<div class='ui-slider-inneroffset'></div>"),p.addClass("ui-slider-handle-snapping"),d.find("option"),d.find("option").each(function(b){var c=!b?"b":"a",d=!b?"right":"left",b=!b?" ui-btn-down-"+h:" "+a.mobile.activeBtnClass;a("<div class='ui-slider-labelbg ui-slider-labelbg-"+c+b+" ui-btn-corner-"+d+"'></div>").prependTo(j);a("<span class='ui-slider-label ui-slider-label-"+
c+b+" ui-btn-corner-"+d+"' role='img'>"+a(this).getEncodedText()+"</span>").prependTo(p)}));i.addClass("ui-slider");d.addClass(g==="input"?"ui-slider-input":"ui-slider-switch").change(function(){b.mouseMoved||b.refresh(k(),true)}).keyup(function(){b.refresh(k(),true,true)}).blur(function(){b.refresh(k(),true)});a(document).bind("vmousemove",function(a){if(b.dragging)return b.mouseMoved=true,g==="select"&&p.removeClass("ui-slider-handle-snapping"),b.refresh(a),b.userModified=b.beforeStart!==d[0].selectedIndex,
false});j.bind("vmousedown",function(a){b.dragging=true;b.userModified=false;b.mouseMoved=false;if(g==="select")b.beforeStart=d[0].selectedIndex;b.refresh(a);return false});j.add(document).bind("vmouseup",function(){if(b.dragging)return b.dragging=false,g==="select"&&(p.addClass("ui-slider-handle-snapping"),b.mouseMoved?b.userModified?b.refresh(b.beforeStart==0?1:0):b.refresh(b.beforeStart):b.refresh(b.beforeStart==0?1:0)),b.mouseMoved=false});j.insertAfter(d);this.handle.bind("vmousedown",function(){a(this).focus()}).bind("vclick",
false);this.handle.bind("keydown",function(c){var d=k();if(!b.options.disabled){switch(c.keyCode){case a.mobile.keyCode.HOME:case a.mobile.keyCode.END:case a.mobile.keyCode.PAGE_UP:case a.mobile.keyCode.PAGE_DOWN:case a.mobile.keyCode.UP:case a.mobile.keyCode.RIGHT:case a.mobile.keyCode.DOWN:case a.mobile.keyCode.LEFT:if(c.preventDefault(),!b._keySliding)b._keySliding=true,a(this).addClass("ui-state-active")}switch(c.keyCode){case a.mobile.keyCode.HOME:b.refresh(o);break;case a.mobile.keyCode.END:b.refresh(n);
break;case a.mobile.keyCode.PAGE_UP:case a.mobile.keyCode.UP:case a.mobile.keyCode.RIGHT:b.refresh(d+q);break;case a.mobile.keyCode.PAGE_DOWN:case a.mobile.keyCode.DOWN:case a.mobile.keyCode.LEFT:b.refresh(d-q)}}}).keyup(function(){if(b._keySliding)b._keySliding=false,a(this).removeClass("ui-state-active")});this.refresh(e,e,true)},refresh:function(a,d,f){(this.options.disabled||this.element.attr("disabled"))&&this.disable();var c=this.element,e=c[0].nodeName.toLowerCase(),g=e==="input"?parseFloat(c.attr("min")):
0,i=e==="input"?parseFloat(c.attr("max")):c.find("option").length-1,l=e==="input"&&parseFloat(c.attr("step"))>0?parseFloat(c.attr("step")):1;if(typeof a==="object"){if(!this.dragging||a.pageX<this.slider.offset().left-8||a.pageX>this.slider.offset().left+this.slider.width()+8)return;a=Math.round((a.pageX-this.slider.offset().left)/this.slider.width()*100)}else a==null&&(a=e==="input"?parseFloat(c.val()||0):c[0].selectedIndex),a=(parseFloat(a)-g)/(i-g)*100;if(!isNaN(a)){a<0&&(a=0);a>100&&(a=100);var k=
a/100*(i-g)+g,o=(k-g)%l;k-=o;Math.abs(o)*2>=l&&(k+=o>0?l:-l);k=parseFloat(k.toFixed(5));k<g&&(k=g);k>i&&(k=i);this.handle.css("left",a+"%");this.handle.attr({"aria-valuenow":e==="input"?k:c.find("option").eq(k).attr("value"),"aria-valuetext":e==="input"?k:c.find("option").eq(k).getEncodedText(),title:e==="input"?k:c.find("option").eq(k).getEncodedText()});e==="select"&&(k===0?this.slider.addClass("ui-slider-switch-a").removeClass("ui-slider-switch-b"):this.slider.addClass("ui-slider-switch-b").removeClass("ui-slider-switch-a"));
if(!f)f=false,e==="input"?(f=c.val()!==k,c.val(k)):(f=c[0].selectedIndex!==k,c[0].selectedIndex=k),!d&&f&&c.trigger("change")}},enable:function(){this.element.attr("disabled",false);this.slider.removeClass("ui-disabled").attr("aria-disabled",false);return this._setOption("disabled",false)},disable:function(){this.element.attr("disabled",true);this.slider.addClass("ui-disabled").attr("aria-disabled",true);return this._setOption("disabled",true)}});a(document).bind("pagecreate create",function(b){a.mobile.slider.prototype.enhanceWithin(b.target)})})($);
(function(a){a.widget("mobile.textinput",a.mobile.widget,{options:{theme:null,initSelector:"input[type='text'], input[type='search'], :jqmData(type='search'), input[type='number'], :jqmData(type='number'), input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='time'], input[type='date'], input[type='month'], input[type='week'], input[type='datetime'], input[type='datetime-local'], input[type='color'], input:not([type])"},_create:function(){var e=this.element,
b=this.options.theme||a.mobile.getInheritedTheme(this.element,"c"),d=" ui-body-"+b,f,c;a("label[for='"+e.attr("id")+"']").addClass("ui-input-text");f=e.addClass("ui-input-text ui-body-"+b);typeof e[0].autocorrect!=="undefined"&&!a.support.touchOverflow&&(e[0].setAttribute("autocorrect","off"),e[0].setAttribute("autocomplete","off"));e.is("[type='search'],:jqmData(type='search')")?(f=e.wrap("<div class='ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-searchfield"+d+"'></div>").parent(),
c=a("<a href='#' class='ui-input-clear' title='clear text'>clear text</a>").tap(function(a){e.val("").focus();e.trigger("change");c.addClass("ui-input-clear-hidden");a.preventDefault()}).appendTo(f).buttonMarkup({icon:"delete",iconpos:"notext",corners:true,shadow:true}),b=function(){setTimeout(function(){c.toggleClass("ui-input-clear-hidden",!e.val())},0)},b(),e.bind("paste cut keyup focus change blur",b)):e.addClass("ui-corner-all ui-shadow-inset"+d);e.focus(function(){f.addClass("ui-focus")}).blur(function(){f.removeClass("ui-focus")});
if(e.is("textarea")){var h=function(){var a=e[0].scrollHeight;e[0].clientHeight<a&&e.height(a+15)},g;e.keyup(function(){clearTimeout(g);g=setTimeout(h,100)});a(document).one("pagechange",h);a.trim(e.val())&&a(window).load(h)}},disable:function(){(this.element.attr("disabled",true).is("[type='search'],:jqmData(type='search')")?this.element.parent():this.element).addClass("ui-disabled")},enable:function(){(this.element.attr("disabled",false).is("[type='search'],:jqmData(type='search')")?this.element.parent():
this.element).removeClass("ui-disabled")}});a(document).bind("pagecreate create",function(e){a.mobile.textinput.prototype.enhanceWithin(e.target)})})($);
(function(a){var e=function(b){var d=b.selectID,f=b.label,c=b.select.closest(".ui-page"),e=a("<div>",{"class":"ui-selectmenu-screen ui-screen-hidden"}).appendTo(c),g=b._selectOptions(),i=b.isMultiple=b.select[0].multiple,l=d+"-button",k=d+"-menu",o=a("<div data-"+a.mobile.ns+"role='dialog' data-"+a.mobile.ns+"theme='"+b.options.theme+"' data-"+a.mobile.ns+"overlay-theme='"+b.options.overlayTheme+"'><div data-"+a.mobile.ns+"role='header'><div class='ui-title'>"+f.getEncodedText()+"</div></div><div data-"+
a.mobile.ns+"role='content'></div></div>").appendTo(a.mobile.pageContainer).page(),n=a("<div>",{"class":"ui-selectmenu ui-selectmenu-hidden ui-overlay-shadow ui-corner-all ui-body-"+b.options.overlayTheme+" "+a.mobile.defaultDialogTransition}).insertAfter(e),q=a("<ul>",{"class":"ui-selectmenu-list",id:k,role:"listbox","aria-labelledby":l}).attr("data-"+a.mobile.ns+"theme",b.options.theme).appendTo(n),j=a("<div>",{"class":"ui-header ui-bar-"+b.options.theme}).prependTo(n),p=a("<h1>",{"class":"ui-title"}).appendTo(j),
m=a("<a>",{text:b.options.closeText,href:"#","class":"ui-btn-left"}).attr("data-"+a.mobile.ns+"iconpos","notext").attr("data-"+a.mobile.ns+"icon","delete").appendTo(j).buttonMarkup(),A=o.find(".ui-content"),z=o.find(".ui-header a");a.extend(b,{select:b.select,selectID:d,buttonId:l,menuId:k,thisPage:c,menuPage:o,label:f,screen:e,selectOptions:g,isMultiple:i,theme:b.options.theme,listbox:n,list:q,header:j,headerTitle:p,headerClose:m,menuPageContent:A,menuPageClose:z,placeholder:"",build:function(){var b=
this;b.refresh();b.select.attr("tabindex","-1").focus(function(){a(this).blur();b.button.focus()});b.button.bind("vclick keydown",function(c){if(c.type=="vclick"||c.keyCode&&(c.keyCode===a.mobile.keyCode.ENTER||c.keyCode===a.mobile.keyCode.SPACE))b.open(),c.preventDefault()});b.list.attr("role","listbox").delegate(".ui-li>a","focusin",function(){a(this).attr("tabindex","0")}).delegate(".ui-li>a","focusout",function(){a(this).attr("tabindex","-1")}).delegate("li:not(.ui-disabled, .ui-li-divider)",
"click",function(c){var d=b.select[0].selectedIndex,f=b.list.find("li:not(.ui-li-divider)").index(this),e=b._selectOptions().eq(f)[0];e.selected=b.isMultiple?!e.selected:true;b.isMultiple&&a(this).find(".ui-icon").toggleClass("ui-icon-checkbox-on",e.selected).toggleClass("ui-icon-checkbox-off",!e.selected);(b.isMultiple||d!==f)&&b.select.trigger("change");b.isMultiple||b.close();c.preventDefault()}).keydown(function(b){var c=a(b.target),d=c.closest("li");switch(b.keyCode){case 38:return b=d.prev(),
b.length&&(c.blur().attr("tabindex","-1"),b.find("a").first().focus()),false;case 40:return b=d.next(),b.length&&(c.blur().attr("tabindex","-1"),b.find("a").first().focus()),false;case 13:case 32:return c.trigger("click"),false}});b.menuPage.bind("pagehide",function(){b.list.appendTo(b.listbox);b._focusButton();a.mobile._bindPageRemove.call(b.thisPage)});b.screen.bind("vclick",function(){b.close()});b.headerClose.click(function(){if(b.menuType=="overlay")return b.close(),false});b.thisPage.addDependents(this.menuPage)},
_isRebuildRequired:function(){var a=this.list.find("li");return this._selectOptions().text()!==a.text()},refresh:function(b){var c=this;this._selectOptions();this.selected();var d=this.selectedIndices();(b||this._isRebuildRequired())&&c._buildList();c.setButtonText();c.setButtonCount();c.list.find("li:not(.ui-li-divider)").removeClass(a.mobile.activeBtnClass).attr("aria-selected",false).each(function(b){a.inArray(b,d)>-1&&(b=a(this),b.attr("aria-selected",true),c.isMultiple?b.find(".ui-icon").removeClass("ui-icon-checkbox-off").addClass("ui-icon-checkbox-on"):
b.addClass(a.mobile.activeBtnClass))})},close:function(){if(!this.options.disabled&&this.isOpen)this.menuType=="page"?window.history.back():(this.screen.addClass("ui-screen-hidden"),this.listbox.addClass("ui-selectmenu-hidden").removeAttr("style").removeClass("in"),this.list.appendTo(this.listbox),this._focusButton()),this.isOpen=false},open:function(){if(!this.options.disabled){var b=this,c=b.list.parent().outerHeight(),d=b.list.parent().outerWidth(),f=a(".ui-page-active"),e=a.support.touchOverflow&&
a.mobile.touchOverflowEnabled,f=f.is(".ui-native-fixed")?f.find(".ui-content"):f,g=e?f.scrollTop():a(window).scrollTop(),h=b.button.offset().top,j=a(window).height(),e=a(window).width();b.button.addClass(a.mobile.activeBtnClass);setTimeout(function(){b.button.removeClass(a.mobile.activeBtnClass)},300);if(c>j-80||!a.support.scrollTop){b.thisPage.unbind("pagehide.remove");if(g==0&&h>j)b.thisPage.one("pagehide",function(){a(this).jqmData("lastScroll",h)});b.menuPage.one("pageshow",function(){a(window).one("silentscroll",
function(){b.list.find(a.mobile.activeBtnClass).focus()});b.isOpen=true});b.menuType="page";b.menuPageContent.append(b.list);b.menuPage.find("div .ui-title").text(b.label.text());a.mobile.changePage(b.menuPage,{transition:a.mobile.defaultDialogTransition})}else{b.menuType="overlay";b.screen.height(a(document).height()).removeClass("ui-screen-hidden");var i=h-g,n=g+j-h,m=c/2,f=parseFloat(b.list.parent().css("max-width")),c=i>c/2&&n>c/2?h+b.button.outerHeight()/2-m:i>n?g+j-c-30:g+30;d<f?f=(e-d)/2:(f=
b.button.offset().left+b.button.outerWidth()/2-d/2,f<30?f=30:f+d>e&&(f=e-d-30));b.listbox.append(b.list).removeClass("ui-selectmenu-hidden").css({top:c,left:f}).addClass("in");b.list.find(a.mobile.activeBtnClass).focus();b.isOpen=true}}},_buildList:function(){var b=this,c=this.options,d=this.placeholder,f=[],e=[],g=b.isMultiple?"checkbox-off":"false";b.list.empty().filter(".ui-listview").listview("destroy");b.select.find("option").each(function(h){var j=a(this),i=j.parent(),n=j.getEncodedText(),m=
"<a href='#'>"+n+"</a>",k=[],l=[];i.is("optgroup")&&(i=i.attr("label"),a.inArray(i,f)===-1&&(e.push("<li data-"+a.mobile.ns+"role='list-divider'>"+i+"</li>"),f.push(i)));if(!this.getAttribute("value")||n.length==0||j.jqmData("placeholder"))c.hidePlaceholderMenuItems&&k.push("ui-selectmenu-placeholder"),d=b.placeholder=n;this.disabled&&(k.push("ui-disabled"),l.push("aria-disabled='true'"));e.push("<li data-"+a.mobile.ns+"option-index='"+h+"' data-"+a.mobile.ns+"icon='"+g+"' class='"+k.join(" ")+"' "+
l.join(" ")+">"+m+"</li>")});b.list.html(e.join(" "));b.list.find("li").attr({role:"option",tabindex:"-1"}).first().attr("tabindex","0");this.isMultiple||this.headerClose.hide();!this.isMultiple&&!d.length?this.header.hide():this.headerTitle.text(this.placeholder);b.list.listview()},_button:function(){return a("<a>",{href:"#",role:"button",id:this.buttonId,"aria-haspopup":"true","aria-owns":this.menuId})}})};a(document).delegate("select","selectmenubeforecreate",function(){var b=a(this).data("selectmenu");
b.options.nativeMenu||e(b)})})($);
(function(a){a.widget("mobile.selectmenu",a.mobile.widget,{options:{theme:null,disabled:false,icon:"arrow-d",iconpos:"right",inline:null,corners:true,shadow:true,iconshadow:true,menuPageTheme:"b",overlayTheme:"a",hidePlaceholderMenuItems:true,closeText:"Close",nativeMenu:true,initSelector:"select:not(:jqmData(role='slider'))"},_button:function(){return a("<div/>")},_setDisabled:function(a){this.element.attr("disabled",a);this.button.attr("aria-disabled",a);return this._setOption("disabled",a)},_focusButton:function(){var a=
this;setTimeout(function(){a.button.focus()},40)},_selectOptions:function(){return this.select.find("option")},_preExtension:function(){this.select=this.element.wrap("<div class='ui-select'>");this.selectID=this.select.attr("id");this.label=a("label[for='"+this.selectID+"']").addClass("ui-select");this.isMultiple=this.select[0].multiple;if(!this.options.theme)this.options.theme=a.mobile.getInheritedTheme(this.select,"c")},_create:function(){this._preExtension();this._trigger("beforeCreate");this.button=
this._button();var e=this,b=this.options,d=this.button.text(a(this.select[0].options.item(this.select[0].selectedIndex==-1?0:this.select[0].selectedIndex)).text()).insertBefore(this.select).buttonMarkup({theme:b.theme,icon:b.icon,iconpos:b.iconpos,inline:b.inline,corners:b.corners,shadow:b.shadow,iconshadow:b.iconshadow});b.nativeMenu&&window.opera&&window.opera.version&&this.select.addClass("ui-select-nativeonly");if(this.isMultiple)this.buttonCount=a("<span>").addClass("ui-li-count ui-btn-up-c ui-btn-corner-all").hide().appendTo(d.addClass("ui-li-has-count"));
(b.disabled||this.element.attr("disabled"))&&this.disable();this.select.change(function(){e.refresh()});this.build()},build:function(){var e=this;this.select.appendTo(e.button).bind("vmousedown",function(){e.button.addClass(a.mobile.activeBtnClass)}).bind("focus vmouseover",function(){e.button.trigger("vmouseover")}).bind("vmousemove",function(){e.button.removeClass(a.mobile.activeBtnClass)}).bind("change blur vmouseout",function(){e.button.trigger("vmouseout").removeClass(a.mobile.activeBtnClass)}).bind("change blur",
function(){e.button.removeClass("ui-btn-down-"+e.options.theme)})},selected:function(){return this._selectOptions().filter(":selected")},selectedIndices:function(){var a=this;return this.selected().map(function(){return a._selectOptions().index(this)}).get()},setButtonText:function(){var e=this,b=this.selected();this.button.find(".ui-btn-text").text(function(){return!e.isMultiple?b.text():b.length?b.map(function(){return a(this).text()}).get().join(", "):e.placeholder})},setButtonCount:function(){var a=
this.selected();this.isMultiple&&this.buttonCount[a.length>1?"show":"hide"]().text(a.length)},refresh:function(){this.setButtonText();this.setButtonCount()},open:a.noop,close:a.noop,disable:function(){this._setDisabled(true);this.button.addClass("ui-disabled")},enable:function(){this._setDisabled(false);this.button.removeClass("ui-disabled")}});a(document).bind("pagecreate create",function(e){a.mobile.selectmenu.prototype.enhanceWithin(e.target)})})($);
(function(a,e){function b(a){for(var b;a;){if((b=typeof a.className==="string"&&a.className+" ")&&b.indexOf("ui-btn ")>-1&&b.indexOf("ui-disabled ")<0)break;a=a.parentNode}return a}a.fn.buttonMarkup=function(b){for(var b=b||{},c=0;c<this.length;c++){var h=this.eq(c),g=h[0],i=a.extend({},a.fn.buttonMarkup.defaults,{icon:b.icon!==e?b.icon:h.jqmData("icon"),iconpos:b.iconpos!==e?b.iconpos:h.jqmData("iconpos"),theme:b.theme!==e?b.theme:h.jqmData("theme"),inline:b.inline!==e?b.inline:h.jqmData("inline"),
shadow:b.shadow!==e?b.shadow:h.jqmData("shadow"),corners:b.corners!==e?b.corners:h.jqmData("corners"),iconshadow:b.iconshadow!==e?b.iconshadow:h.jqmData("iconshadow")},b),l="ui-btn-inner",k,o,n=document.createElement(i.wrapperEls),q=document.createElement(i.wrapperEls),j=i.icon?document.createElement("span"):null;if(!(g.tagName==="INPUT"&&h.jqmData("role")==="button"))if(g.tagName==="BUTTON")a(g.parentNode).hasClass("ui-btn")||a(g).button();else{d&&d();if(!i.theme)i.theme=a.mobile.getInheritedTheme(h,
"c");k="ui-btn ui-btn-up-"+i.theme;i.inline&&(k+=" ui-btn-inline");if(i.icon)i.icon="ui-icon-"+i.icon,i.iconpos=i.iconpos||"left",o="ui-icon "+i.icon,i.iconshadow&&(o+=" ui-icon-shadow");i.iconpos&&(k+=" ui-btn-icon-"+i.iconpos,i.iconpos=="notext"&&!h.attr("title")&&h.attr("title",h.getEncodedText()));i.corners&&(k+=" ui-btn-corner-all",l+=" ui-btn-corner-all");i.shadow&&(k+=" ui-shadow");g.setAttribute("data-"+a.mobile.ns+"theme",i.theme);h.addClass(k);n.className=l;q.className="ui-btn-text";n.appendChild(q);
if(j)j.className=o,n.appendChild(j);for(;g.firstChild;)q.appendChild(g.firstChild);g.appendChild(n);a.data(g,"textWrapper",a(q))}}return this};a.fn.buttonMarkup.defaults={corners:true,shadow:true,iconshadow:true,inline:false,wrapperEls:"span"};var d=function(){a(document).bind({vmousedown:function(d){var d=b(d.target),c;d&&(d=a(d),c=d.attr("data-"+a.mobile.ns+"theme"),d.removeClass("ui-btn-up-"+c).addClass("ui-btn-down-"+c))},"vmousecancel vmouseup":function(d){var d=b(d.target),c;d&&(d=a(d),c=d.attr("data-"+
a.mobile.ns+"theme"),d.removeClass("ui-btn-down-"+c).addClass("ui-btn-up-"+c))},"vmouseover focus":function(d){var d=b(d.target),c;d&&(d=a(d),c=d.attr("data-"+a.mobile.ns+"theme"),d.removeClass("ui-btn-up-"+c).addClass("ui-btn-hover-"+c))},"vmouseout blur":function(d){var d=b(d.target),c;d&&(d=a(d),c=d.attr("data-"+a.mobile.ns+"theme"),d.removeClass("ui-btn-hover-"+c+" ui-btn-down-"+c).addClass("ui-btn-up-"+c))}});d=null};a(document).bind("pagecreate create",function(b){a(":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a, .ui-bar > :jqmData(role='controlgroup') > a",
b.target).not(".ui-btn, :jqmData(role='none'), :jqmData(role='nojs')").buttonMarkup()})})($);
(function(a){a.fn.controlgroup=function(e){return this.each(function(){function b(a){a.removeClass("ui-btn-corner-all ui-shadow").eq(0).addClass(h[0]).end().last().addClass(h[1]).addClass("ui-controlgroup-last")}var d=a(this),f=a.extend({direction:d.jqmData("type")||"vertical",shadow:false,excludeInvisible:true},e),c=d.children("legend"),h=f.direction=="horizontal"?["ui-corner-left","ui-corner-right"]:["ui-corner-top","ui-corner-bottom"];d.find("input").first().attr("type");c.length&&(d.wrapInner("<div class='ui-controlgroup-controls'></div>"),
a("<div role='heading' class='ui-controlgroup-label'>"+c.html()+"</div>").insertBefore(d.children(0)),c.remove());d.addClass("ui-corner-all ui-controlgroup ui-controlgroup-"+f.direction);b(d.find(".ui-btn"+(f.excludeInvisible?":visible":"")));b(d.find(".ui-btn-inner"));f.shadow&&d.addClass("ui-shadow")})};a(document).bind("pagecreate create",function(e){a(":jqmData(role='controlgroup')",e.target).controlgroup({excludeInvisible:false})})})($);
(function(a){a(document).bind("pagecreate create",function(e){a(e.target).find("a").not(".ui-btn, .ui-link-inherit, :jqmData(role='none'), :jqmData(role='nojs')").addClass("ui-link")})})($);
(function(a,e){a.fn.fixHeaderFooter=function(){return!a.support.scrollTop||a.support.touchOverflow&&a.mobile.touchOverflowEnabled?this:this.each(function(){var b=a(this);b.jqmData("fullscreen")&&b.addClass("ui-page-fullscreen");b.find(".ui-header:jqmData(position='fixed')").addClass("ui-header-fixed ui-fixed-inline fade");b.find(".ui-footer:jqmData(position='fixed')").addClass("ui-footer-fixed ui-fixed-inline fade")})};a.mobile.fixedToolbars=function(){function b(){!i&&g==="overlay"&&(h||a.mobile.fixedToolbars.hide(true),
a.mobile.fixedToolbars.startShowTimer())}function d(a){var b=0,c,d;if(a){d=document.body;c=a.offsetParent;for(b=a.offsetTop;a&&a!=d;){b+=a.scrollTop||0;if(a==c)b+=c.offsetTop,c=a.offsetParent;a=a.parentNode}}return b}function f(b){var c=a(window).scrollTop(),e=d(b[0]),f=b.css("top")=="auto"?0:parseFloat(b.css("top")),g=window.innerHeight,h=b.outerHeight(),i=b.parents(".ui-page:not(.ui-page-fullscreen)").length;return b.is(".ui-header-fixed")?(f=c-e+f,f<e&&(f=0),b.css("top",i?f:c)):b.css("top",i?c+
g-h-(e-f):c+g-h)}if(a.support.scrollTop&&(!a.support.touchOverflow||!a.mobile.touchOverflowEnabled)){var c,h,g="inline",i=false,l=null,k=false,o=true;a(function(){var c=a(document),d=a(window);c.bind("vmousedown",function(){o&&(l=g)}).bind("vclick",function(b){o&&!a(b.target).closest("a,input,textarea,select,button,label,.ui-header-fixed,.ui-footer-fixed").length&&!k&&(a.mobile.fixedToolbars.toggle(l),l=null)}).bind("silentscroll",b);(c.scrollTop()===0?d:c).bind("scrollstart",function(){k=true;l===
null&&(l=g);var b=l=="overlay";if(i=b||!!h)a.mobile.fixedToolbars.clearShowTimer(),b&&a.mobile.fixedToolbars.hide(true)}).bind("scrollstop",function(b){a(b.target).closest("a,input,textarea,select,button,label,.ui-header-fixed,.ui-footer-fixed").length||(k=false,i&&(a.mobile.fixedToolbars.startShowTimer(),i=false),l=null)});d.bind("resize updatelayout",b)});a(document).delegate(".ui-page","pagebeforeshow",function(b,d){var e=a(b.target).find(":jqmData(role='footer')"),g=e.data("id"),h=d.prevPage,
h=h&&h.find(":jqmData(role='footer')"),h=h.length&&h.jqmData("id")===g;g&&h&&(c=e,f(c.removeClass("fade in out").appendTo(a.mobile.pageContainer)))}).delegate(".ui-page","pageshow",function(){var b=a(this);c&&c.length&&setTimeout(function(){f(c.appendTo(b).addClass("fade"));c=null},500);a.mobile.fixedToolbars.show(true,this)});a(document).delegate(".ui-collapsible-contain","collapse expand",b);return{show:function(b,c){a.mobile.fixedToolbars.clearShowTimer();g="overlay";return(c?a(c):a.mobile.activePage?
a.mobile.activePage:a(".ui-page-active")).children(".ui-header-fixed:first, .ui-footer-fixed:not(.ui-footer-duplicate):last").each(function(){var c=a(this),e=a(window).scrollTop(),g=d(c[0]),h=window.innerHeight,i=c.outerHeight(),e=c.is(".ui-header-fixed")&&e<=g+i||c.is(".ui-footer-fixed")&&g<=e+h;c.addClass("ui-fixed-overlay").removeClass("ui-fixed-inline");!e&&!b&&c.animationComplete(function(){c.removeClass("in")}).addClass("in");f(c)})},hide:function(b){g="inline";return(a.mobile.activePage?a.mobile.activePage:
a(".ui-page-active")).children(".ui-header-fixed:first, .ui-footer-fixed:not(.ui-footer-duplicate):last").each(function(){var c=a(this),d=c.css("top"),d=d=="auto"?0:parseFloat(d);c.addClass("ui-fixed-inline").removeClass("ui-fixed-overlay");if(d<0||c.is(".ui-header-fixed")&&d!==0)b?c.css("top",0):c.css("top")!=="auto"&&parseFloat(c.css("top"))!==0&&c.animationComplete(function(){c.removeClass("out reverse").css("top",0)}).addClass("out reverse")})},startShowTimer:function(){a.mobile.fixedToolbars.clearShowTimer();
var b=[].slice.call(arguments);h=setTimeout(function(){h=e;a.mobile.fixedToolbars.show.apply(null,b)},100)},clearShowTimer:function(){h&&clearTimeout(h);h=e},toggle:function(b){b&&(g=b);return g==="overlay"?a.mobile.fixedToolbars.hide():a.mobile.fixedToolbars.show()},setTouchToggleEnabled:function(a){o=a}}}}();a(document).bind("pagecreate create",function(b){a(":jqmData(position='fixed')",b.target).length&&a(b.target).each(function(){if(!a.support.scrollTop||a.support.touchOverflow&&a.mobile.touchOverflowEnabled)return this;
var b=a(this);b.jqmData("fullscreen")&&b.addClass("ui-page-fullscreen");b.find(".ui-header:jqmData(position='fixed')").addClass("ui-header-fixed ui-fixed-inline fade");b.find(".ui-footer:jqmData(position='fixed')").addClass("ui-footer-fixed ui-fixed-inline fade")})})})($);
(function(a){a.mobile.touchOverflowEnabled=false;a.mobile.touchOverflowZoomEnabled=false;a(document).bind("pagecreate",function(e){a.support.touchOverflow&&a.mobile.touchOverflowEnabled&&(e=a(e.target),e.is(":jqmData(role='page')")&&e.each(function(){var b=a(this),d=b.find(":jqmData(role='header'), :jqmData(role='footer')").filter(":jqmData(position='fixed')"),e=b.jqmData("fullscreen"),c=d.length?b.find(".ui-content"):b;b.addClass("ui-mobile-touch-overflow");c.bind("scrollstop",function(){c.scrollTop()>
0&&window.scrollTo(0,a.mobile.defaultHomeScroll)});d.length&&(b.addClass("ui-native-fixed"),e&&(b.addClass("ui-native-fullscreen"),d.addClass("fade in"),a(document).bind("vclick",function(){d.removeClass("ui-native-bars-hidden").toggleClass("in out").animationComplete(function(){a(this).not(".in").addClass("ui-native-bars-hidden")})})))}))})})($);
(function(a,e){function b(){var b=a("meta[name='viewport']");b.length?b.attr("content",b.attr("content")+", user-scalable=no"):a("head").prepend("<meta>",{name:"viewport",content:"user-scalable=no"})}var d=a("html");a("head");var f=a(e);a(e.document).trigger("mobileinit");if(a.mobile.gradeA()){if(a.mobile.ajaxBlacklist)a.mobile.ajaxEnabled=false;d.addClass("ui-mobile ui-mobile-rendering");var c=a("<div class='ui-loader ui-body-a ui-corner-all'><span class='ui-icon ui-icon-loading spin'></span><h1></h1></div>");
a.extend(a.mobile,{showPageLoadingMsg:function(){if(a.mobile.loadingMessage){var b=a("."+a.mobile.activeBtnClass).first();c.find("h1").text(a.mobile.loadingMessage).end().appendTo(a.mobile.pageContainer).css({top:a.support.scrollTop&&f.scrollTop()+f.height()/2||b.length&&b.offset().top||100})}d.addClass("ui-loading")},hidePageLoadingMsg:function(){d.removeClass("ui-loading")},initializePage:function(){var b,c=a(":jqmData(role='page')");c.length||(b=a(":jqmData(role='dialog')"),b.length?(b.first().attr("data-"+
a.mobile.ns+"role","page"),c=c.add(b.get().shift())):c=a("body").wrapInner("<div data-"+a.mobile.ns+"role='page'></div>").children(0));c.add(":jqmData(role='dialog')").each(function(){var b=a(this);b.jqmData("url")||b.attr("data-"+a.mobile.ns+"url",b.attr("id")||location.pathname+location.search)});a.mobile.firstPage=c.first();a.mobile.pageContainer=c.first().parent().addClass("ui-mobile-viewport");f.trigger("pagecontainercreate");a.mobile.showPageLoadingMsg();!a.mobile.hashListeningEnabled||!a.mobile.path.stripHash(location.hash)?
a.mobile.changePage(a.mobile.firstPage,{transition:"none",reverse:true,changeHash:false,fromHashChange:true}):f.trigger("hashchange",[true])}});a.support.touchOverflow&&a.mobile.touchOverflowEnabled&&!a.mobile.touchOverflowZoomEnabled&&b();a.mobile._registerInternalEvents();a(function(){e.scrollTo(0,1);a.mobile.defaultHomeScroll=!a.support.scrollTop||a(e).scrollTop()===1?0:1;a.mobile.autoInitializePage&&a.mobile.initializePage();f.load(a.mobile.silentScroll)})}})($,this);

