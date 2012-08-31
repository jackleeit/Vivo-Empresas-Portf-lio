CSS = new Class({
}, {
    STYLES: ['accelerator', 'azimuth', 'background', 'background-attachment', 'background-color', 'background-image', 'background-position', 'background-position-x', 'background-position-y', 'background-repeat', 'behavior', 'border', 'border-bottom', 'border-bottom-color', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color', 'border-left', 'border-left-color', 'border-left-style', 'border-left-width', 'border-right', 'border-right-color', 'border-right-style', 'border-right-width', 'border-spacing', 'border-style', 'border-top', 'border-top-color', 'border-top-style', 'border-top-width', 'border-width', 'bottom', 'caption-side', 'clear', 'clip', 'color', 'content', 'counter-increment', 'counter-reset', 'cue', 'cue-after', 'cue-before', 'cursor', 'direction', 'display', 'elevation', 'empty-cells', 'filter', 'float', 'font', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'height', 'ime-mode', 'include-source', 'layer-background-color', 'layer-background-image', 'layout-flow', 'layout-grid', 'layout-grid-char', 'layout-grid-char-spacing', 'layout-grid-line', 'layout-grid-mode', 'layout-grid-type', 'left', 'letter-spacing', 'line-break', 'line-height', 'list-style', 'list-style-image', 'list-style-position', 'list-style-type', 'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'marker-offset', 'marks', 'max-height', 'max-width', 'min-height', 'min-width', 'orphans', 'outline', 'outline-color', 'outline-style', 'outline-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'page', 'page-break-after', 'page-break-before', 'page-break-inside', 'pause', 'pause-after', 'pause-before', 'pitch', 'pitch-range', 'play-during', 'position', 'quotes', 'richness', 'right', 'ruby-align', 'ruby-overhang', 'ruby-position', 'size', 'speak', 'speak-header', 'speak-numeral', 'speak-punctuation', 'speech-rate', 'stress', 'scrollbar-arrow-color', 'scrollbar-base-color', 'scrollbar-dark-shadow-color', 'scrollbar-face-color', 'scrollbar-highlight-color', 'scrollbar-shadow-color', 'scrollbar-3d-light-color', 'scrollbar-track-color', 'table-layout', 'text-align', 'text-align-last', 'text-decoration', 'text-indent', 'text-justify', 'text-overflow', 'text-shadow', 'text-transform', 'text-autospace', 'text-kashida-space', 'text-underline-position', 'top', 'unicode-bidi', 'vertical-align', 'visibility', 'voice-family', 'volume', 'white-space', 'widows', 'width', 'word-break', 'word-spacing', 'word-wrap', 'writing-mode', 'z-index', 'zoom'],
    UNITYSTYLES: { left: '@px', top: '@px', bottom: '@px', right: '@px', width: '@px', height: '@px', maxWidth: '@px', maxHeight: '@px', minWidth: '@px', minHeight: '@px', backgroundColor: 'rgb(@, @, @)', backgroundPosition: '@px @px', color: 'rgb(@, @, @)', fontSize: '@px', letterSpacing: '@px', lineHeight: '@px', clip: 'rect(@px @px @px @px)', margin: '@px @px @px @px', padding: '@px @px @px @px', border: '@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)', borderWidth: '@px @px @px @px', borderStyle: '@ @ @ @', borderColor: 'rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)', zIndex: '@', 'zoom': '@', fontWeight: '@', textIndent: '@px', opacity: '@' },
    REALSTYLES: [],

    construct: function () {
        $foreach(such.STYLES, function (stl) {
            such.REALSTYLES.push(stl.replace(/(\-.)/, function (str) {    
                return str.charAt(1).toUpperCase();
            }));
        })
    },

    changeProperty: function (selector, property, value) {
        var change = {};
        change[property] = value;
        such.changePropertys(selector, change);
    },

    changePropertys: function (selector, propertys) {
        var selectors = selector.split(',');
        $foreach(selectors, function (selector) {
            var rules = such.getRule(selector);
            $foreach(rules, function (rule, i) {
                $foreach(propertys, function (value, style) {
                    rule.style[style] = value;
                })
            });
        });
    },
    getProperty: function (selector, property) {
        var ret = such.getPropertys(selector);
        return (ret[property]) ? ret[property] : null
    },
    getPropertys: function (selector) {
        var rules = such.getRule(selector), to = {};
        $foreach(rules, function (rule, i) {
            $foreach(such.REALSTYLES, function (style) {
                if (!rule.style[style])
                    return;
                to[style] = String(rule.style[style]);
            });
        });
        return to;
    },
    getRule: function (selector) {
        var getCSSRule = [];
        var embeds = such.getEmbeds();

        $foreach(embeds.rules, function (rules, x) {
            $foreach(rules, function (rule, i) {
                if (!rule.style)
                    return;
                var selectorText = (rule.selectorText) ? rule.selectorText.replace(/^\w+/, function (m) {
                    return m.toLowerCase();
                }) : null;

                selectorText = String(selectorText).toLowerCase();

                var regTest = new RegExp('^' + selector.toLowerCase() + '$');

                if (!selectorText || !regTest.test(selectorText))
                    return;
                getCSSRule.push(rule);
            });
        });
        return getCSSRule;
    },
    getEmbeds: function () {
        var getCSSEmbeds = [];
        $foreach(document.styleSheets, function (sheet, j) {
            var href = sheet.href;
            if (href && (href.search('://') != -1) && !(href.search(document.domain) != -1)) return;
            getCSSEmbeds.push({
                sheet: sheet,
                rules: sheet.rules || sheet.cssRules
            });
        });
        return getCSSEmbeds;
    }
});