$(function(){
	
});

;(function($){
	function parseURL(url) { 
		var a = document.createElement('a'); 
		a.href = url; 
		return { 
			source: url, 
			protocol: a.protocol.replace(':',''), 
			host: a.hostname, 
			port: a.port, 
			query: a.search, 
			params: (function(){ 
						var ret = {}, 
						seg = a.search.replace(/^\?/,'').split('&'), 
						len = seg.length, i = 0, s; 
						
						for (;i<len;i++) { 
							if (!seg[i]) { continue; } 
							s = seg[i].split('='); 
							ret[s[0]] = s[1]; 
						} 
						return ret; 
					})(), 
			file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1], 
			hash: a.hash.replace('#',''), 
			path: a.pathname.replace(/^([^\/])/,'/$1'), 
			relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1], 
			segments: a.pathname.replace(/^\//,'').split('/') 
			}; 
	};
	String.prototype.format = function(args){			
		var result = this;
		for (var key in args) {
	        if(args[key]!=undefined){
	            var reg = new RegExp("({" + key + "})", "g");
	            result = result.replace(reg, args[key]);
	        }
	    }
		return result;	
	};
	var con = {};
	con.addPanel = function(url){
		//console.log(parseURL(url));
		$("#css_panel").append("<div title='{source}'>{file}</div>".format(parseURL(url)));
	},
	con.addCssPanel = function(){
		
	};
	con.addJsPanel = function(){
		
	};
	con.addXhrPanel = function(){
		
	};
	con.addImgPanel = function(){
		
	};
	con.addConPanel = function(msg,line,url){
		$("#console_panel").append("<div title='{url}:{line}'>{msg}</div>".format({msg:msg,line:line,url:url}));
	};
	$.console = con;
})(jQuery);