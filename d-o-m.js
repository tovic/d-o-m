/*! <https://github.com/tovic/d-o-m> */

(function(win, doc, DOM_NS) {

    var replace = 'replace',
        create = 'createElement',
        first_child = 'firstChild',
        ge = 'getElement',
        gebi = ge + 'ById',
        gebc = ge + 'sByClassName',
        gebt = ge + 'sByTagName',
        qsa = 'querySelectorAll',
        attributes = 'attributes',
        DOM,
        DOM_NS_0 = DOM_NS[0],
        DOM_NS_1 = DOM_NS[1] || DOM_NS_0,

        a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;

    function to_lower_case(s) {
        return s.toLowerCase();
    }

    function to_upper_case(s) {
        return s.toUpperCase();
    }

    function to_array(x) {
        return Array.prototype.slice.call(x);
    }

    function object_keys(x) {
        return Object.keys(x);
    }

    function count(x) {
        return x.length;
    }

    function count_object(x) {
        return count(object_keys(x));
    }

    function type(node, s) {
        return to_lower_case(str(node)) === '[object ' + s + ']';
    }

    function is_set(x) {
        return typeof x !== "undefined";
    }

    function is_string(x) {
        return typeof x === "string";
    }

    function is_number(x) {
        return typeof x === "number";
    }

    function is_function(x) {
        return typeof x === "function";
    }

    function is_object(x) {
        return typeof x === "object";
    }

    function is_plain_object(x) {
        return is_object(x) && !is_dom(x) && type(x, 'object');
    }

    function is_array(x) {
        return x instanceof Array;
    }

    function is_boolean(x) {
        return typeof x === "boolean";
    }

    function is_pattern(x) {
        return x instanceof RegExp ? (x.source || true) : false;
    }

    function is_dom(x) {
        return x instanceof HTMLElement;
    }

    function has(a, s) {
        if (is_object(a) && !is_array(a)) {
            x = '\0';
            for (i in a) {
                if (str_join(a[i], x) === str_join(s, x)) {
                    return i;
                }
            }
            return -1;
        }
        return a.indexOf(s);
    }

    function edge(a, b, c) {
        if (is_set(b) && a < b) return b;
        if (is_set(c) && a > c) return c;
        return a;
    }

    function trim(s, x) {
        if (x === 0) {
            return s[replace](/^[\s\uFEFF\xA0]+/, ""); // trim left
        } else if (x === 1) {
            return s[replace](/[\s\uFEFF\xA0]+$/, ""); // trim right
        }
        return s[replace](/^[\s\uFEFF\xA0]*|[\s\uFEFF\xA0]*$/g, "") // trim left and right
    }

    function uid(s) {
        return (s || "") + Math.floor(Date.now() * Math.random());
    }

    function str_split(s, f) {
        return is_string(s) ? trim(s).split(is_set(f) ? f : /\s+/) : s;
    }

    function str_join(s, f) {
        return is_array(s) ? s.join(is_set(f) ? f : ' ') : s;
    }

    function arr(x) {
        var o = [];
        return each(x, function(v) {
            v && o.push(is_plain_object(v) ? arr(v) : v);
        }), o;
    }

    function arr_unique(a) {
        var o = [];
        for (i = 0, j = count(a); i < j; ++i) {
            has(o, a[i]) === -1 && o.push(a[i]);
        }
        return o;
    }

    function obj(x) {
        var o = {};
        return each(x, function(v, i) {
            if (is_array(v)) {
                o[i] = obj(v);
            } else {
                o[i] = v;
            }
        }), o;
    }

    function int(x) {
        return parseFloat(x);
    }

    function str(x, i) {
        return x.toString(is_set(i) ? i : null);
    }

    function pattern(a, b) {
        return new RegExp(a, b);
    }

    function camelize(s) {
        return s[replace](/\-([a-z])/g, function(a, b) {
            return to_upper_case(b);
        });
    }

    function pascalize(s) {
        return camelize('-' + s);
    }

    function dasherize(s) {
        return s[replace](/([A-Z])/g, function(a, b) {
            return '-' + to_lower_case(b);
        });
    }

    function css(a, b, c) {
        if (!a) return;
        var o = win.getComputedStyle(a, (c = c || null)),
            h = {}, i, j, k, l;
        if (is_object(b)) {
            if (is_array(b)) {
                o = [];
                for (i in b) {
                    if (j = b[i]) {
                        l = css(a, j, c);
                        o[i] = l;
                    }
                }
                return o;
            }
            for (i in b) {
                j = b[i];
                a.style[camelize(i[replace](/^\0/, ""))] = j === 0 ? 0 : (j ? (is_string(j) ? j : j + 'px') : "");
            }
            return a;
        } else if (b) {
            if (b[0] === '\0') {
                b = b.slice(1);
                k = 1;
            }
            i = o[camelize(b)];
            j = k ? i : int(i);
            return j === 0 ? 0 : (j || i);
        }
        return (function() {
            for (i in o) {
                j = o.getPropertyValue(i);
                if (!j) continue;
                k = int(j);
                h[dasherize(i)] = k === 0 ? 0 : (k || j || "");
            }
            return h;
        })();
    }

    function extend(a, b) {
        b = b || {};
        for (i in b) {
            if (is_plain_object(a[i]) && is_plain_object(b[i])) {
                a[i] = extend(a[i], b[i]);
            } else {
                a[i] = b[i];
            }
        }
        return a;
    }

    function each(a, fn) {
        var i, j, k;
        if (is_array(a)) {
            for (i = 0, j = count(a); i < j; ++i) {
                k = fn(a[i], i, a);
                if (k === true) {
                    continue;
                } else if (k === false) {
                    break;
                }
            }
        } else {
            for (i in a) {
                k = fn(a[i], i, a);
                if (k === true) {
                    continue;
                } else if (k === false) {
                    break;
                }
            }
        }
        return a;
    }

    function timer_set(fn, i) {
        return setTimeout(fn, i || 0);
    }

    function timer_reset(timer_set_fn) {
        return clearTimeout(timer_set_fn);
    }

    function closest(a, b) {
        while ((a = dom_parent(a)) && a !== b);
        return a;
    }

    function el(em, node, attr) {
        em = em || 'div';
        em = is_string(em) ? ((em = trim(em)), em[0] === '<' && em.slice(-1) === '>' ? (f = doc[create]('div'), f.innerHTML = em, f[first_child]) : doc[create](em)) : em;
        if (is_plain_object(attr)) {
            for (i in attr) {
                v = attr[i];
                if (i === 'classes') {
                    class_set(em, v);
                } else if (i === 'data') {
                    for (j in v) {
                        v = v[j];
                        if (v === null) {
                            data_reset(em, j);
                        } else {
                            data_set(em, j, v);
                        }
                    }
                } else if (i === 'css') {
                    if (is_string(v)) {
                        attr_set(em, 'style', v);
                    } else if (v === null) {
                        attr_reset(em, 'style');
                    } else {
                        css(em, v);
                    }
                } else {
                    if (is_function(v)) {
                        em[i] = v;
                    } else {
                        if (v === null) {
                            attr_reset(em, i);
                        } else {
                            attr_set(em, i, is_array(v) ? v.join(' ') : "" + v);
                        }
                    }
                }
            }
        }
        if (is_dom(node)) {
            dom_set(em, node);
        } else if (is_object(node)) {
            for (i in node) {
                v = node[i];
                if (is_dom(v)) {
                    dom_set(em, v);
                } else {
                    if (v !== false) content_set(em, v);
                }
            }
        } else {
            if (is_set(node) && node !== false) content_set(em, node);
        }
        return em;
    }

    function attr_set(node, a, b) {
        if (is_object(a)) {
            for (i in a) {
                attr_set(node, i, a[i]);
            }
        } else {
            node[(b === null ? 'remove' : 'set') + 'Attribute'](a, b);
        }
    }

    function attr_get(node, a, b) {
        var o = {};
        if (!a) {
            for (i = 0, j = node[attributes], k = count(j); i < k; ++i) {
                l = j[i];
                o[l.name] = l.value;
            }
            return count_object(o) ? (is_plain_object(b) ? extend(b, o) : o) : (is_set(b) ? b : {});
        }
        if (is_string(a)) {
            return attr_get(node, [a], [is_set(b) ? b : ""])[0];
        }
        o = [];
        for (i in a) {
            i = a[i];
            if (i = node.getAttribute(i)) {
                o.push(i);
            }
        }
        return count(o) ? o : (is_set(b) ? b : []);
    }

    function attr_reset(node, a) {
        if (is_object(a)) {
            for (i in a) {
                attr_reset(node, a[i]);
            }
        } else {
            if (!is_set(a)) {
                attr_reset(node, 'class'); // :(
                for (i = 0, j = node[attributes], k = count(j); i < k; ++i) {
                    if (j[i]) attr_reset(node, j[i].name);
                }
            } else {
                node.removeAttribute(a);
            }
        }
    }

    function data_set(node, a, b) {
        if (is_object(a)) {
            for (i in a) {
                data_set(node, i, a[i]);
            }
        } else {
            attr_set(node, 'data-' + a, b);
        }
    }

    function data_get(node, a, b) {
        var o = {};
        if (!a) {
            for (i = 0, j = node[attributes], k = count(j); i < k; ++i) {
                l = j[i];
                m = l.name;
                if (m.slice(0, 5) === 'data-') {
                    o[m.slice(5)] = l.value;
                }
            }
            return count_object(o) ? (is_plain_object(b) ? extend(b, o) : o) : (is_set(b) ? b : {});
        }
        if (is_string(a)) {
            return data_get(node, [a], [is_set(b) ? b : ""])[0];
        }
        o = [];
        for (i in a) {
            i = a[i];
            if (i = attr_get(node, 'data-' + i)) {
                o.push(i);
            }
        }
        return count(o) ? o : (is_set(b) ? b : []);
    }

    function data_reset(node, a) {
        if (is_object(a)) {
            for (i in a) {
                attr_reset(node, 'data-' + a[i]);
            }
        } else {
            if (!is_set(a)) {
                for (i = 0, j = node[attributes], k = count(j); i < k; ++i) {
                    if ((l = j[i]) && l.name.slice(0, 5) === 'data-') {
                        attr_reset(node, l.name);
                    }
                }
            } else {
                attr_reset(node, 'data-' + a);
            }
        }
    }

    function class_set(node, s) {
        s = str_split(s);
        for (i in s) {
            node.classList.add(s[i]);
        }
    }

    function class_get(node, s, b) {
        var o = [];
        if (!s) {
            o = str_split(node.className);
            return count(o) ? o : (is_set(b) ? b : []);
        }
        if (is_string(s)) {
            return class_get(node, [s], [is_set(b) ? b : ""])[0];
        }
        for (i in s) {
            i = s[i];
            if (node.classList.contains(i)) {
                o.push(i);
            }
        }
        return count(o) ? o : (is_set(b) ? b : []);
    }

    function class_reset(node, s) {
        if (!is_set(s)) {
            attr_reset(node, 'class');
        } else {
            s = str_split(s);
            for (i in s) {
                node.classList.remove(s[i]);
            }
        }
    }

    function class_toggle(node, s) {
        s = str_split(s);
        for (i in s) {
            node.classList.toggle(s[i]);
        }
    }

    function event_exit(e) {
        if (e) e.preventDefault();
        return false;
    }

    function event_set(id, node, fn) {
        if (!node) return;
        id = str_split(id);
        for (i = 0, j = count(id); i < j; ++i) {
            node.addEventListener(id[i], fn, false);
        }
    }

    function event_reset(id, node, fn) {
        if (!node) return;
        id = str_split(id);
        for (i = 0, j = count(id); i < j; ++i) {
            node.removeEventListener(id[i], fn, false);
        }
    }

    function event_fire(id, node, data) {
        id = str_split(id);
        var has_event = 'createEvent' in doc, e;
        for (i = 0, j = count(id); i < j; ++i) {
            if (has_event) {
                e = doc.createEvent('HTMLEvents');
                e.data = data;
                e.initEvent(id[i], true, false);
                node.dispatchEvent(e);
            }
        }
    }

    function content_set(node, s) {
        node.innerHTML = s;
    }

    function content_get(node, s) {
        return node.innerHTML || (is_set(s) ? s : "");
    }

    function content_reset(node, deep) {
        if ((!is_set(deep) || deep) && (c = dom_children(node))) {
            for (i = 0, j = count(c); i < j; ++i) {
                content_reset(c[i]);
            }
        }
        content_set(node, "");
    }

    function dom_parent(node) {
        return node && node.parentNode;
    }

    function dom_children(node) {
        return node && to_array(node.children || []);
    }

    function dom_closest(node, s) {
        if (!is_set(s)) {
            return dom_parent(node);
        }
        return is_string(s) ? node.closest(s) : closest(node, s);
    }

    function dom_next(node) {
        return node && (node.nextElementSibling || node.nextSibling);
    }

    function dom_previous(node) {
        return node && (node.previousElementSibling || node.previousSibling);
    }

    function dom_index(node) {
        i = 0;
        while (node = dom_previous(node)) ++i;
        return i;
    }

    function dom_before(node, dom) {
        p = dom_parent(node);
        if (!p) return;
        p.insertBefore(dom, node);
    }

    function dom_after(node, dom) {
        p = dom_parent(node);
        if (!p) return;
        p.insertBefore(dom, dom_next(node));
    }

    function dom_begin(node, dom) {
        c = node[first_child];
        if (c) {
            dom_before(c, dom);
        } else {
            dom_set(node, dom);
        }
    }

    function dom_end(node, dom) {
        dom_set(node, dom);
    }

    function dom_set(node, dom) {
        node.appendChild(dom);
    }

    function dom_reset(node, deep) {
        var parent = dom_parent(node);
        if (parent) {
            if (!is_set(deep) || deep) {
                c = node[first_child];
                while (c) dom_reset(c);
            }
            parent.removeChild(node);
        }
    }

    function dom_copy(node, deep) {
        return node.cloneNode(!is_set(deep) ? true : !!deep);
    }

    function dom_replace(node, s) {
        dom_parent(node).replaceChild(s, node);
        return s;
    }

    function do_instance(a, b) {
        return new DOM(a, b);
    }

    (function($, $$) {

        $.version = '1.0.0';
        $.DOM = true; // just for test: `if (typeof $ === "function" && $.DOM) { … }`
        $.id = {
            e: {}, // node(s)
            f: {}, // function(s)
            h: {}  // hook(s)
        };

        $.edge = edge;
        $.el = el;
        $.extend = extend;
        $.has = has;
        $.plug = {};

        function hook_set(event, fn, id) {
            o = $.id.h;
            if (!is_set(event)) return o;
            if (!is_set(fn)) return o[event];
            if (!is_set(o[event])) o[event] = {};
            if (!is_set(id)) id = count_object(o[event]);
            return o[event][id] = fn, $;
        }

        function hook_reset(event, id) {
            o = $.id.h;
            if (!is_set(event)) return $.id.h = {}, $;
            if (!is_set(id) || !is_set(o[event])) return o[event] = {}, $;
            return delete o[event][id], $;
        }

        function hook_fire(event, a, id) {
            o = $.id.h;
            if (!is_set(o[event])) {
                return o[event] = {}, $;
            }
            if (!is_set(id)) {
                for (i in o[event]) {
                    o[event][i].apply($, a);
                }
            } else {
                if (is_set(o[event][id])) {
                    o[event][id].apply($, a);
                }
            }
            return $;
        }

        extend($.hooks = function(f) {
            o = $.id.h;
            return count_object(o) ? (is_plain_object(f) ? extend(f, o) : o) : (is_set(f) ? f : {});
        }, {
            set: hook_set,
            reset: hook_reset,
            fire: hook_fire
        });

        extend($.trim = trim, {
            begin: function(s) {
                return trim(s, 0);
            },
            end: function(s) {
                return trim(s, 1);
            }
        });

        $.is = {
            a: is_array,
            b: is_boolean,
            e: is_dom,
            f: is_function,
            i: is_number,
            n: function(x) {
                return x === null;
            },
            o: is_object,
            r: is_pattern,
            s: is_string,
            x: function(x) {
                return !is_set(x);
            }
        };

        extend($.is.o, {
            o: is_plain_object
        });

        $.to = {
            a: arr,
            i: int,
            o: obj,
            r: pattern,
            s: str
        };

        extend($.to.a, {
            u: arr_unique
        });

        extend($.to.s, {
            c: camelize,
            d: dasherize,
            p: pascalize
        });

        extend($.ajax = function() {}, {
            get: function() {},
            post: function() {}
        });

        // current script path
        s = doc.currentScript;
        $.path = ((s && s.src) || win.location.href).split('/').slice(0, -1).join('/');

        $.ready = function(fn) {
            return event_set.call(doc, "DOMContentLoaded", doc, fn), $;
        };

        $.load = function(fn) {
            return event_set.call(doc, "load", win, fn), $;
        };

        // key maps for the deprecated `KeyboardEvent.keyCode`
        var keys = {
            // control
            3: 'cancel',
            6: 'help',
            8: 'backspace',
            9: 'tab',
            12: 'clear',
            13: 'enter',
            16: 'shift',
            17: 'control',
            18: 'alt',
            19: 'pause',
            20: 'capslock', // not working on `keypress`
            27: 'escape',
            28: 'convert',
            29: 'nonconvert',
            30: 'accept',
            31: 'modechange',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'arrowleft',
            38: 'arrowup',
            39: 'arrowright',
            40: 'arrowdown',
            41: 'select',
            42: 'print',
            43: 'execute',
            44: 'printscreen', // works only on `keyup` :(
            45: 'insert',
            46: 'delete',
            91: 'meta', // <https://bugzilla.mozilla.org/show_bug.cgi?id=1232918>
            93: 'contextmenu',
            144: 'numlock',
            145: 'scrolllock',
            181: 'volumemute',
            182: 'volumedown',
            183: 'volumeup',
            224: 'meta',
            225: 'altgraph',
            246: 'attn',
            247: 'crsel',
            248: 'exsel',
            249: 'eraseeof',
            250: 'play',
            251: 'zoomout',
            // num
            48: ['0', ')'],
            49: ['1', '!'],
            50: ['2', '@'],
            51: ['3', '#'],
            52: ['4', '$'],
            53: ['5', '%'],
            54: ['6', '^'],
            55: ['7', '&'],
            56: ['8', '*'],
            57: ['9', '('],
            // symbol
            32: ' ',
            59: [';', ':'],
            61: ['=', '+'],
            173: ['-', '_'],
            188: [',', '<'],
            190: ['.', '>'],
            191: ['/', '?'],
            192: ['`', '~'],
            219: ['[', '{'],
            220: ['\\', '|'],
            221: [']', '}'],
            222: ['\'', '"']
        },

        // key alias(es)
        keys_alias = {
            'alternate': 'alt',
            'option': 'alt',
            'ctrl': 'control',
            'cmd': 'control',
            'command': 'control',
            'os': 'meta', // <https://bugzilla.mozilla.org/show_bug.cgi?id=1232918>
            'context': 'contextmenu',
            'menu': 'contextmenu',
            'return': 'enter',
            'ins': 'insert',
            'del': 'delete',
            'esc': 'escape',
            'left': 'arrowleft',
            'right': 'arrowright',
            'up': 'arrowup',
            'down': 'arrowdown',
            'back': 'backspace',
            'space': ' ',
            'plus': '+',
            'minus': '-'
        }, i, j;

        // function
        for (i = 1; i < 25; ++i) {
            keys[111 + i] = 'f' + i;
        }

        // alphabet
        for (i = 65; i < 91; ++i) {
            keys[i] = to_lower_case(String.fromCharCode(i));
        }

        // register key(s)
        $.keys = keys;
        $.keys_alias = keys_alias;

        // add `KeyboardEvent.DOM` property
        Object.defineProperty(KeyboardEvent.prototype, DOM_NS_1, {
            configurable: true,
            get: function() {
                // custom `KeyboardEvent.key` for internal use
                var t = this,
                    keys = $.keys, // refresh ...
                    keys_alias = $.keys_alias, // refresh ...
                    k = t.key ? to_lower_case(t.key) : keys[t.which || t.keyCode];
                if (is_object(k)) {
                    k = t.shiftKey ? (k[1] || k[0]) : k[0];
                }
                k = to_lower_case(k);
                function ret(x, y) {
                    if (is_string(y)) {
                        y = t[y + 'Key'];
                    }
                    if (!x || x === true) {
                        if (is_boolean(y)) {
                            return y;
                        }
                        return k;
                    }
                    if (is_pattern(x)) return y && x.test(k);
                    return x = to_lower_case(x), y && (keys_alias[x] || x) === k;
                }
                return {
                    key: function(x) {
                        return ret(x, 1);
                    },
                    control: function(x) {
                        return ret(x, 'ctrl');
                    },
                    shift: function(x) {
                        return ret(x, 'shift');
                    },
                    option: function(x) {
                        return ret(x, 'alt');
                    },
                    meta: function(x) {
                        return ret(x, 'meta');
                    }
                };
            }
        });

    })(win[DOM_NS_0] = win[DOM_NS_1] = function(target, scope) {

        return do_instance(target, scope);

    }, DOM = function(target, scope) {

        var $ = this,
            $$ = win[DOM_NS_1];

        function query(target, scope) {
            if (target instanceof $$) return target;
            var html = doc.documentElement,
                head = doc.head,
                body = doc.body,
                target_o = target,
                scope_o = scope;
            scope = scope || doc;
            if (is_string(target) && count(target)) {
                target = trim(target);
                if (target === 'html') {
                    target = [html];
                } else if (target === 'head') {
                    target = [head];
                } else if (target === 'body') {
                    target = [body];
                } else if (target[0] === '<' && target.slice(-1) === '>') {
                    target = [el(target, false, scope_o)];
                } else if (/^[#.]?(?:\\.|[\w-]|[^\x00-\xa0])+$/.test(target)) {
                    if (target[0] === '#' && (e = scope[gebi](target.slice(1)))) {
                        target = [e];
                    } else if ((target[0] === '.' && count(e = scope[gebc](target.slice(1)))) || count(e = scope[gebt](target))) {
                        target = e;
                    } else {
                        target = [];
                    }
                } else {
                    target = scope[qsa](target);
                }
            } else if (is_dom(target)) {
                target = [target];
            } else if (!target) {
                target = [];
            }
            target = to_array(target);
            target.$ = [target_o, scope_o || null];
            return arr_unique(target);
        }

        target = query(target);
        if ((i = has($$.id.e, target.$)) !== -1) {
            target.id = i;
        } else {
            i = uid('dom:');
            target.id = i;
            $$.id.e[i] = target.$;
        }

        var prop_contenteditable = 'contentEditable',
            prop_designmode = 'designMode',
            prop_nodename = 'nodeName',
            prop_readonly = 'readOnly',
            prop_tabindex = 'tabIndex',
            prop_aliases = {
                'check': 'checked',
                'contenteditable': prop_contenteditable,
                'class': 'className',
                'designmode': prop_designmode,
                'disable': 'disabled',
                'hide': 'hidden',
                'nodename': prop_nodename,
                'readonly': prop_readonly,
                'select': 'selected',
                'tabindex': prop_tabindex,
                'content-edit': prop_contenteditable,
                'content-editable': prop_contenteditable,
                'design-mode': prop_designmode,
                'node-name': prop_nodename,
                'read-only': prop_readonly,
                'spell-check': 'spellcheck',
                'tab-index': prop_tabindex
            };

        function prop(s) {
            return prop_aliases[s] || s;
        }

        function is_input(v) {
            return v[prop_nodename] && /^(button|input|select|textarea)$/.test(to_lower_case(v[prop_nodename])) || v[prop_contenteditable];
        }

        function do_fire_input(v) {
            if (is_input(v)) {
                event_fire("change input", v, []);
            }
        }

        extend(target, {
            each: function(fn) {
                return each(target, fn);
            },
            is: function(s, f) {
                if (!is_set(s)) return target;
                f = is_set(f) ? f : [];
                if (is_function(s)) {
                    var o = [];
                    each(target, function(v, i, a) {
                        s.call(v, i, a) && o.push(v);
                    });
                    return do_instance(count(o) ? o : f);
                }
                a = dom_parent(target[0]);
                b = query(s, a)[0];
                return do_instance(b || f);
            },
            not: function() {},
            html: function(s) {
                if (!is_set(s)) {
                    return content_get(target[0]);
                }
                t = is_function(s);
                return each(target, function(v, k, a) {
                    content_set(v, t ? s.call(v, v, k, a) : s);
                });
            },
            text: function(s) {
                if (!is_set(s)) {
                    return target[0].textContent;
                }
                t = is_function(s);
                return each(target, function(v, k, a) {
                    v.textContent = t ? s.call(v, v, k, a) : s;
                });
            },
            set: function(a, b) {
                t = is_function(b);
                return each(target, function(v, k, s) {
                    v[prop(a)] = t ? b.call(v, v, k, s) : b;
                    do_fire_input(v);
                });
            },
            reset: function(a) {
                return each(target, function(v) {
                    delete v[prop(a)];
                    do_fire_input(v);
                });
            },
            get: function(a, b) {
                a = prop(a);
                return is_set(target[0][a]) ? target[0][a] : (is_set(b) ? b : false);
            },
            attributes: function(f) {
                return attr_get(target[0], 0, f);
            },
            classes: function(f) {
                return class_get(target[0], 0, f);
            },
            data: function(f) {
                return data_get(target[0], 0, f);
            },
            events: function() {},
            index: function(i) {
                if (is_set(i)) {
                    return do_instance(target[i]);
                }
                return dom_index(target[0]);
            },
            first: function() {
                return do_instance(target[0]);
            },
            last: function() {
                return do_instance(target.pop());
            },
            parent: function() {
                return do_instance(dom_parent(target[0]));
            },
            children: function(s) {
                var o = [];
                each(target, function(v) {
                    o = o.concat(dom_children(v));
                });
                return do_instance(o).is(s);
            },
            kin: function() {},
            closest: function(s) {
                var o = [];
                each(target, function(v) {
                    (t = dom_closest(v, s)) && o.push(t);
                });
                return do_instance(o);
            },
            find: function(s) {
                var o = [];
                each(target, function(v) {
                    o = o.concat(query(is_set(s) ? s : '*', v))
                });
                return do_instance(o);
            },
            next: function(s) {
                return do_instance(dom_next(target[0])).is(s);
            },
            previous: function(s) {
                return do_instance(dom_previous(target[0])).is(s);
            },
            prepend: function(s) {
                return each(target, function(v) {
                    dom_begin(v, el(s));
                });
            },
            append: function(s) {
                return each(target, function(v) {
                    dom_end(v, el(s));
                });
            },
            before: function(s) {
                return each(target, function(v) {
                    dom_before(v, el(s));
                });
            },
            after: function(s) {
                return each(target, function(v) {
                    dom_after(v, el(s));
                });
            },
            remove: function() {},
            wrap: function() {},
            unwrap: function() {},
            css: function(a, b) {
                if (!is_set(a)) {
                    return css(target[0]);
                } else if (a === false) {
                    return each(target, function(v) {
                        attr_reset(v, 'style');
                    });
                }
                if (is_set(b)) {
                    o = {};
                    o[a] = b;
                } else {
                    o = a;
                }
                if (is_string(o)) {
                    return css(target[0], o);
                }
                return each(target, function(v) {
                    css(v, o);
                });
            },
            show: function() {},
            hide: function() {},
            offset: function() {},
            width: function() {},
            height: function() {},
            value: function() {},
            focus: function() {
                t = target[0];
                return ('focus' in t && t.focus()), target;
            },
            select: function() {
                t = target[0];
                t.focus();
                return ('select' in t && t.select()), target;
            }
        });

        extend(target.attributes, {
            set: function(a, b) {
                t = is_function(b);
                return each(target, function(v, k, s) {
                    attr_set(v, a, t ? b.call(v, v, k, s) : b);
                });
            },
            reset: function(a) {
                return each(target, function(v) {
                    attr_reset(v, a);
                });
            },
            get: function(a, b) {
                return attr_get(target[0], a, b);
            }
        });

        extend(target.data, {
            set: function(a, b) {
                t = is_function(b);
                return each(target, function(v, k, s) {
                    data_set(v, a, t ? b.call(v, v, k, s) : b);
                });
            },
            reset: function(a) {
                return each(target, function(v) {
                    data_reset(v, a);
                });
            },
            get: function(a, b) {
                return data_get(target[0], a, b);
            }
        });

        extend(target.classes, {
            set: function(a) {
                t = is_function(a);
                return each(target, function(v, k, s) {
                    class_set(v, t ? a.call(v, v, k, s) : a);
                });
            },
            reset: function(a) {
                return each(target, function(v) {
                    class_reset(v, a);
                });
            },
            toggle: function(a) {
                t = is_function(a);
                return each(target, function(v, k, s) {
                    class_toggle(v, t ? a.call(v, v, k, s) : a);
                });
            },
            get: function(a, b) {
                return class_get(target[0], a, b);
            }
        });

        extend(target.events, {
            set: function(event, fn) {
                var a = $$.id.f,
                    b = target.id,
                    c = a[b], d;
                if (!is_set(c)) {
                    a[b] = [];
                }
                return each(target, function(v) {
                    d = function(e) {
                        x = is_function(fn) ? fn.call(v, e) : fn;
                        if (x === false) return event_exit(e);
                    }
                    a[b].push(d);
                    event_set(event, v, d);
                });
            },
            reset: function(event, fn) {
                var a = $$.id.f,
                    b = target.id,
                    c = a[b], d;
                return each(target, function(v) {
                    if (!fn) {
                        each(c, function(f) {
                            event_reset(event, v, f);
                        });
                    } else {
                        d = function(e) {
                            x = is_function(fn) ? fn.call(v, e) : fn;
                            if (x === false) return event_exit(e);
                        }
                        event_reset(event, v, d);
                    }
                }), delete (fn ? a[b][d] : a[b]), target;
            },
            fire: function(event, data) {
                return each(target, function(v) {
                    event_fire.call(v, event, v, data);
                });
            },
            x: event_exit,
            capture: function(event, get, fn) {
                return target.events.set(event, function(e) {
                    t = query(get, this);
                    if (has(t, e.target) !== -1 || (u = do_instance(e.target)) && has(t, u.closest(get)[0]) !== -1) {
                        return fn.call(t, e);
                    }
                });
            }
        });

        for (i in $$.plug) {
            target[i] = $$.plug[i];
        }

        return target;

    });

})(window, document, ['$', 'DOM']);