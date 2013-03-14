/*
 * Copyright (C) 2010 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Ideally, we would rely on platform support for parsing a cookie, since
// this would save us from any potential inconsistency. However, exposing
// platform cookie parsing logic would require quite a bit of additional
// plumbing, and at least some platforms lack support for parsing Cookie,
// which is in a format slightly different from Set-Cookie and is normally
// only required on the server side.

/**
 * @constructor
 */
WebInspector.CookieParser = function()
{
}

/**
 * @constructor
 * @param {string} key
 * @param {string|undefined} value
 * @param {number} position
 */
WebInspector.CookieParser.KeyValue = function(key, value, position)
{
    this.key = key;
    this.value = value;
    this.position = position;
}

WebInspector.CookieParser.prototype = {
    /**
     * @return {Array.<WebInspector.Cookie>}
     */
    get cookies()
    {
        return this._cookies;
    },

    /**
     * @param {string|undefined} cookieHeader
     * @return {?Array.<WebInspector.Cookie>}
     */
    parseCookie: function(cookieHeader)
    {
        if (!this._initialize(cookieHeader))
            return null;

        for (var kv = this._extractKeyValue(); kv; kv = this._extractKeyValue()) {
            if (kv.key.charAt(0) === "$" && this._lastCookie)
                this._lastCookie.addAttribute(kv.key.slice(1), kv.value);
            else if (kv.key.toLowerCase() !== "$version" && typeof kv.value === "string")
                this._addCookie(kv, WebInspector.Cookie.Type.Request);
            this._advanceAndCheckCookieDelimiter();
        }
        this._flushCookie();
        return this._cookies;
    },

    /**
     * @param {string|undefined} setCookieHeader
     * @return {?Array.<WebInspector.Cookie>}
     */
    parseSetCookie: function(setCookieHeader)
    {
        if (!this._initialize(setCookieHeader))
            return null;
        for (var kv = this._extractKeyValue(); kv; kv = this._extractKeyValue()) {
            if (this._lastCookie)
                this._lastCookie.addAttribute(kv.key, kv.value);
            else
                this._addCookie(kv, WebInspector.Cookie.Type.Response);
            if (this._advanceAndCheckCookieDelimiter())
                this._flushCookie();
        }
        this._flushCookie();
        return this._cookies;
    },

    /**
     * @param {string|undefined} headerValue
     * @return {boolean}
     */
    _initialize: function(headerValue)
    {
        this._input = headerValue;
        if (typeof headerValue !== "string")
            return false;
        this._cookies = [];
        this._lastCookie = null;
        this._originalInputLength = this._input.length;
        return true;
    },

    _flushCookie: function()
    {
        if (this._lastCookie)
            this._lastCookie.size = this._originalInputLength - this._input.length - this._lastCookiePosition;
        this._lastCookie = null;
    },

    /**
     * @return {WebInspector.CookieParser.KeyValue}
     */
    _extractKeyValue: function()
    {
        if (!this._input || !this._input.length)
            return null;
        // Note: RFCs offer an option for quoted values that may contain commas and semicolons.
        // Many browsers/platforms do not support this, however (see http://webkit.org/b/16699
        // and http://crbug.com/12361). The logic below matches latest versions of IE, Firefox,
        // Chrome and Safari on some old platforms. The latest version of Safari supports quoted
        // cookie values, though.
        var keyValueMatch = /^[ \t]*([^\s=;]+)[ \t]*(?:=[ \t]*([^;\n]*))?/.exec(this._input);
        if (!keyValueMatch) {
            console.log("Failed parsing cookie header before: " + this._input);
            return null;
        }

        var result = new WebInspector.CookieParser.KeyValue(keyValueMatch[1], keyValueMatch[2] && keyValueMatch[2].trim(), this._originalInputLength - this._input.length);
        this._input = this._input.slice(keyValueMatch[0].length);
        return result;
    },

    /**
     * @return {boolean}
     */
    _advanceAndCheckCookieDelimiter: function()
    {
        var match = /^\s*[\n;]\s*/.exec(this._input);
        if (!match)
            return false;
        this._input = this._input.slice(match[0].length);
        return match[0].match("\n") !== null;
    },

    /**
     * @param {WebInspector.CookieParser.KeyValue} keyValue
     * @param {number} type
     */
    _addCookie: function(keyValue, type)
    {
        if (this._lastCookie)
            this._lastCookie.size = keyValue.position - this._lastCookiePosition;
        // Mozilla bug 169091: Mozilla, IE and Chrome treat single token (w/o "=") as
        // specifying a value for a cookie with empty name.
        this._lastCookie = keyValue.value ? new WebInspector.Cookie(keyValue.key, keyValue.value, type) :
            new WebInspector.Cookie("", keyValue.key, type);
        this._lastCookiePosition = keyValue.position;
        this._cookies.push(this._lastCookie);
    }
};

/**
 * @param {string|undefined} header
 * @return {?Array.<WebInspector.Cookie>}
 */
WebInspector.CookieParser.parseCookie = function(header)
{
    return (new WebInspector.CookieParser()).parseCookie(header);
}

/**
 * @param {string|undefined} header
 * @return {?Array.<WebInspector.Cookie>}
 */
WebInspector.CookieParser.parseSetCookie = function(header)
{
    return (new WebInspector.CookieParser()).parseSetCookie(header);
}

/**
 * @constructor
 */
WebInspector.Cookie = function(name, value, type)
{
    this.name = name;
    this.value = value;
    this.type = type;
    this._attributes = {};
}

WebInspector.Cookie.prototype = {
    /**
     * @return {boolean}
     */ 
    get httpOnly()
    {
        return "httponly" in this._attributes;
    },

    /**
     * @return {boolean}
     */ 
    get secure()
    {
        return "secure" in this._attributes;
    },

    /**
     * @return {boolean}
     */ 
    get session()
    {
        // RFC 2965 suggests using Discard attribute to mark session cookies, but this does not seem to be widely used.
        // Check for absence of explicity max-age or expiry date instead.
        return  !("expires" in this._attributes || "max-age" in this._attributes);
    },

    /**
     * @return {string}
     */ 
    get path()
    {
        return this._attributes["path"];
    },

    /**
     * @return {string}
     */ 
    get domain()
    {
        return this._attributes["domain"];
    },

    /**
     * @return {Date}
     */ 
    expires: function(requestDate)
    {
        return this._attributes["expires"] ? new Date(this._attributes["expires"]) :
            (this._attributes["max-age"] ? new Date(requestDate.getTime() + 1000 * this._attributes["max-age"]) : null);
    },

    /**
     * @return {Object}
     */ 
    get attributes()
    {
        return this._attributes;
    },

    /**
     * @param {string} key 
     * @param {string} value 
     */ 
    addAttribute: function(key, value)
    {
        this._attributes[key.toLowerCase()] = value;
    }
}

WebInspector.Cookie.Type = {
    Request: 0,
    Response: 1
};

WebInspector.Cookies = {}

WebInspector.Cookies.getCookiesAsync = function(callback)
{
    function mycallback(error, cookies, cookiesString)
    {
        if (error)
            return;
        if (cookiesString)
            callback(WebInspector.Cookies.buildCookiesFromString(cookiesString), false);
        else
            callback(cookies, true);
    }

    PageAgent.getCookies(mycallback);
}

WebInspector.Cookies.buildCookiesFromString = function(rawCookieString)
{
    var rawCookies = rawCookieString.split(/;\s*/);
    var cookies = [];

    if (!(/^\s*$/.test(rawCookieString))) {
        for (var i = 0; i < rawCookies.length; ++i) {
            var cookie = rawCookies[i];
            var delimIndex = cookie.indexOf("=");
            var name = cookie.substring(0, delimIndex);
            var value = cookie.substring(delimIndex + 1);
            var size = name.length + value.length;
            cookies.push({ name: name, value: value, size: size });
        }
    }

    return cookies;
}

WebInspector.Cookies.cookieMatchesResourceURL = function(cookie, resourceURL)
{
    var url = resourceURL.asParsedURL();
    if (!url || !WebInspector.Cookies.cookieDomainMatchesResourceDomain(cookie.domain, url.host))
        return false;
    return (url.path.startsWith(cookie.path)
        && (!cookie.port || url.port == cookie.port)
        && (!cookie.secure || url.scheme === "https"));
}

WebInspector.Cookies.cookieDomainMatchesResourceDomain = function(cookieDomain, resourceDomain)
{
    if (cookieDomain.charAt(0) !== '.')
        return resourceDomain === cookieDomain;
    return !!resourceDomain.match(new RegExp("^([^\\.]+\\.)?" + cookieDomain.substring(1).escapeForRegExp() + "$"), "i");
}