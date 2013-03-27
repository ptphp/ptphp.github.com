function openwinx(url,name,w,h,t,l) {
	if(!w) w=screen.width-4;
	if(!h) h=screen.height-95;
	if(!t) t=100;
	if(!l) l=100;	
    window.open(url,name,"top="+t+",left="+l+",width=" + w + ",height=" + h + ",toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no");
}



String.prototype.replaceAll = function(search, replace){  
	var regex = new RegExp(search, "g");  
	return this.replace(regex, replace);  
} 

//最大值
Array.prototype.max = function(){   
	return Math.max.apply({},this) 
} 

//最小值
Array.prototype.min = function(){   
	return Math.min.apply({},this) 
}



Array.prototype.implode = function (s) {
	var string = '';
	for (var i = 0; i < this.length; i ++) {		
		string += this[i] + s;		
	}	
	var regexp = new RegExp(s + '$', 'ig');	
	return string.replace(regexp, '');
}

Function.prototype.bind = function (obj) {
	var method = this;
	var fn = function () {
		return method.apply(obj, arguments);
	}
	return fn;
}

String.prototype.trim = function() {	
	return this.replace(/(^\s*)|(\s*$)/g, '');	
}

String.prototype.ltrim = function() {	
	return this.replace(/(^\s*)/g, '');	
}

String.prototype.rtrim = function() {	
	return this.replace(/(\s*$)/g, '');	
}

/**
 * 字符串模板解析 
 * @param {String} str
 * @param {Object} args
 * 
 * args = {name:"joseph"}
 * str = "hello {name}"
 * 
 * stringFormat(str,args)
 */
function stringFormat(str,args){	
	var result = str;
	for (var key in args) {
        if(args[key]!=undefined){
            var reg = new RegExp("({" + key + "})", "g");
            result = result.replace(reg, args[key]);
        }
    }
	return result;	
}

//String 转 Object
function stringToObject(str){
	return (new Function("","return " + str))();
}
//Object 转 String
function objectToString(obj){
	return JSON.stringify(obj);
}





