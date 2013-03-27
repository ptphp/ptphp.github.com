var ptApi = {}

//判断是否处于PtGUI
function getClientApi(){
	return clientApi;
}
(function(){
	/**cookie
	*/
	var cookie_pre = '';
	var cookie_domain = '';
	var cookie_path = '/';
	//String 转 Object
	function stringToObject(str){
		return (new Function("","return " + str))();
	}
	//Object 转 String
	function objectToString(obj){
		return JSON.stringify(obj);
	}
	function getcookie(name) {
	    name = cookie_pre+name;
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		while(i < clen) {
			var j = i + alen;
			if(document.cookie.substring(i, j) == arg) return getcookieval(j);
			i = document.cookie.indexOf(" ", i) + 1;
			if(i == 0) break;
		}
		return null;
	}

	function setcookie(name, value, days) {
	    name = cookie_pre+name;
		var argc = setcookie.arguments.length;
		var argv = setcookie.arguments;
		var secure = (argc > 5) ? argv[5] : false;
		var expire = new Date();
		if(days==null || days==0) days=1;
		expire.setTime(expire.getTime() + 3600000*24*days);
		document.cookie = name + "=" + escape(value) + ("; path=" + cookie_path) + ((cookie_domain == '') ? "" : ("; domain=" + cookie_domain)) + ((secure == true) ? "; secure" : "") + ";expires="+expire.toGMTString();
	}

	function delcookie(name) {
	    var exp = new Date();
		exp.setTime (exp.getTime() - 1);
		var cval = getcookie(name);
	    name = cookie_pre+name;
		document.cookie = name+"="+cval+";expires="+exp.toGMTString();
	}

	function getcookieval(offset) {
		var endstr = document.cookie.indexOf (";", offset);
		if(endstr == -1)
		endstr = document.cookie.length;
		return unescape(document.cookie.substring(offset, endstr));
	}
	
	function init(){
		ptApi = {
				version:"0.0.1",
				call:null,
				status:false,
				callbackParam:null,
				config:null
		}
		ptApi.config = stringToObject(getcookie("PTCONFIG"));
		ptApi.setCallbackParam = function(msg){
			ptApi.callbackParam =stringToObject(msg);
		}
		
		try{
			parent.getClientApi();
			ptApi.status = true;
		}catch(e){
			
		}
		
		if(ptApi.status){
			ptApi.call = function (pack,cls,fun,args,callbackFun) {
				if(!ptApi.status){
					return ;
				}
				var param = {
					    "_package":pack,
					    "_class":cls,
					    "_function":fun,
					    "_args":args,
					};
				console.log(param);
				ptApi.callbackParam = null;
				try{
					//parent.clientApi.call(JSON.stringify(param));
					parent.clientApi.call(objectToString(param));
					if(callbackFun){
						if(ptApi.callbackParam.error){
							console.log(ptApi.callbackParam.message)
						}else{
							callbackFun(ptApi.callbackParam['data']);
						}				
					}			
				}catch(e){			
					
				}
			};
		}
		
		ptApi.dragWin = function(x,y){
			ptApi.call(
					"app.mainwindow",
					"MainWindow",
					"test",
					{x:x,y:y}
			);
		},
		
		ptApi.openUrl = function(url,inner){	
			if(inner){
				location.href = url;
				return;
			}			
			if(ptApi.status){
				ptApi.tools('Chrome',url);	
			}else{
				window.open(url);
			}
		}

		ptApi.tools = function(app,param){
			//如果IFRAME 中调用 需要 parent
			if(!ptApi.status){
				return;
			}
			var apiData = {};
			if(!param){
				param = '';
			}
			
			ptApi.call(
					"app.utils.tools",
					"Tools",
					"run",
					{app:app,param:param}
			);
		}

		//检查端口是否启动
		ptApi.checkRun = function(port){
			ptApi.call("app.utils.phpserver","PHPServer","checkRun",{port:port},function(data){
				console.log(data);
			});
		}

		/**
		 * phpserver 服务器操作
		 * 
		 * @param obj
		 * @param fun
		 * @param dir
		 * @param host
		 * @param type
		 * @param port
		 */
		ptApi.ctlServer = function(fun,dir,host,port){				
			var args = {port:port,dir:dir,host:host};			
			//console.log(fun,args);	
			ptApi.call(
					"app.utils.phpserver",
					"PHPServer",
					fun,
					args,	
					function(data){
						console.log(data);
					}
			);
		}
	}
	
	
	init();
	console.log(ptApi);
})(ptApi);




