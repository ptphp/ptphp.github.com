//temple
;(function(){	
	$.fn.extend({
		test1:function(option){
			var setting = $.extend({
				
			},option);
		}
	});
	
})(jQuery);


/**
 * PTEDITOR
 */
;(function(){
	var listener = false;
	var editors = {};
	var url = {
		'editorSave':'/ptwebos/ide/save',
	};
	
	function getMode(ext){		
		switch(ext){
			case "py":
				$ext = "python";
				break;
			case "md":
				$ext = "markdown";
				break;
			case "php":
				$ext = "php";
				break;
			case "js":
				$ext = "javascript";
				break;
			case "css":
				$ext = "css";
				break;
			case "html":
				$ext = "html";
				break;
			case "htm":
				$ext = "html";
				break;
			case "sql":
				$ext = "sql";
				break;
			case "db":
				$ext = "sql";
			default:
				$ext = 'html';
				break;
		}
		
		return "ace/mode/"+$ext;
	}
	function goLine(line){
		var id = $(this).attr('id');
		e =  editors[id];
		if(e){
			e.gotoLine(parseInt(line));
			e.navigateTo(parseInt(line));
		}
	}
	
	function debugPython(path){		
		ptService.debug({python:1,path:path});
		return;
		
	}
	
	function debugUrl(path,content,$parent){
		console.log(path,content)
		var key = $parent.data('key');
		if(!key){
			key = 1;
		}
		var url = ptIde.getUrl(key);		
		var ppath = $parent.data("path");		
		var rpath = $("#s_path"+key).val();
		purl = path.replace(rpath,url);
		//console.log(url,path,ppath,rpath);
		//console.log(purl);		
		re = RegExp("class Module_([a-zA-z0-9]+)_Control_([a-zA-z0-9]+) extends PtControl");
		res = re.exec(content);
		
		if(res){
			control = (res[1]+'/'+res[2] ).toLocaleLowerCase();
			purl = url+'/'+control;			
		}			
		console.log(purl);
		ptService.debug({url:purl});
		
	}
	function getFileExt(str) 
	{ 
		var d=/\.[^\.]+$/.exec(str); 
		return d; 
	}
	function setEditor(option,save){
		var id = $(this).attr('id');
		var setting = $.extend({
			ext:'',
			data:'',
			line:0,
			theme:'ace/theme/twilight',
		},option);
		var e = ace.edit(id);
		var mode = getMode(setting.ext);		
	    e.setTheme(setting.theme);  
	    e.getSession().setMode(mode);
	    
	    if(setting.data){
	    	e.setValue(setting.data);
	    }
	    e.gotoLine(setting.line);	    
	    e.navigateTo(parseInt(setting.line));
	    //e.setUseSoftTabs(true);
	    editors[id] = e; 
	    if(save){
	    	onSave(id,save);
	    }
	    
	    var commands = e.commands;
	    commands.addCommand({
	        name: "fresh",
	        bindKey: {win: "F5"},
	        exec: function(data) {
	            var id = data.container.id;	
	            $parent = $("#"+id).parents('.pt_ide');
	            var path = $("#"+id).data("path");
	            var content = $.trim(editors[id].getValue()); 
	            ext = getFileExt(path)
	            console.log(ext)
	            if(ext == '.py'){
	            	debugPython(path)
	            }
	            if(ext == '.html' || ext == "htm" || ext ==".php"){
	            	debugUrl(path,content,$parent)
	            }
	        }
	    });	
	    
	    
	    return this;
	}
	
	function onSave(id,save){
		var commands = editors[id].commands;
	    commands.addCommand({
	        name: "save",
	        bindKey: {win: "Ctrl-S", mac: "Command-S"},
	        exec: function(data) {
	            var id = data.container.id;	
	            $parent = $("#"+id).parents('.pt_ide');
	            
	            var path = $("#"+id).data("path");
	            if(!path){
	            	return;
	            }
	            var content = $.trim(editors[id].getValue()); 
	            
	            //$("#"+id).refreshWin(content,$parent);
	           
	            $.post(url.editorSave,{path:path,content:content},function(d){
	            	save(d)
	            })
	        }
	    });	
	}
	
	
	
	$.fn.extend({
		fIframe:function(){
			console.log("src",$(this).attr('src'));
			$(this).attr('src',$(this).attr('src'));
		},
		
		refreshWin:function(content,$parent){		
						
		},
		pteditor:setEditor,
		goLine:goLine,
		setLis:function(){
			$parent = $(this).parents('.pt_ide');
			var val  = $('.isLis',$parent)[0].checked ? 1 :0;			
			$parent.data('lis',val)
		},
		openBrow:function(){
			var $parent = $(this).parents('.pt_ide');
			var url = $(".browUrl",$parent).val();
			if(url){
				$(".popBrowser iframe",$parent).attr('src',url);
			}else{
				$(".browUrl",$parent).focus();
			}
			
		}
	});	
	$.pteditors = editors;
})(jQuery);


/**
 * common function
 */
;(function(){
	$.fn.extend({		
		removeMask:function(){
			var id = $(this).attr("id");
			$(this).remove();
			$("#"+id.replace("mask_","prev_")).remove();
		},
		mask:function(id,index){
			$("body").append('<div onclick="$(this).removeMask()" id="mask_'+id+'" class="mask"></div>');			
			var index = 9999;
			if(!index){
				index = 9999999;
			}
			$('#mask_'+id).width("100%").height("100%").css({"z-index":index,'position':'fixed','background':'black','opacity':'0.5','filter':'alpha(opacity=50)','top':"0"})
			return this;
		},
		previewImg11:function(){
			var id = $(this).attr("id");
			//console.log(id);			
			$('body').append('<div style="box-shadow: 0 4px 5px rgba(0,0,0,0.35)" id="prev_'+id+'"><div style="box-shadow: 0 4px 5px rgba(0,0,0,0.35);background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX///8AAABVwtN+AAAAAnRSTlMzMz0oyR4AAAARSURBVAgdY/jPwIAVYRf9DwB+vw/xbMOy9QAAAABJRU5ErkJggg==);padding:10px"><img src="'+$(this).attr('src')+'" alt="" /></div></div>');
			var index = 80000; 
			$('#prev_'+id).animate({"z-index":(index+2),"background-color":"white","border-radius":"10px","padding":"10px"},300).center();
			this.mask(id,index+1);
			return this;
		},
		//调整图片宽高 适应用父节点
		adjustImg:function(){
			var width = $(this).width();
			var height =$(this).height();
			var _width = $(this).parent().width();
			var _height = $(this).parent().height();
			if(width>_width && height>_height){
				if((width/_width)>(height/_height)){
					$(this).width(_width);
					$(this).height(height*(_width/width));
					
				}else{
					$(this).height(_height);
					$(this).width(width*(_height/height));
				}
			}else if(width<_width && height>_height){
				$(this).height(_height);
			}else if(width>_width && height<_height){
				$(this).width(_width);
			}
			return this;
		}
		
	});
	
	$.extend({		
		ltrim:function(str,word){			
			if(word){
				var re = new RegExp("^"+word);
			}else{
				var re = new RegExp("^\s+");
				
			}
			return (str || "").replace( re ,"");
		},
		rtrim:function(str,word){			
			if(word){
				var re = new RegExp(word+"$");
			}else{
				var re = new RegExp("\s+$");
				
			}
			return (str || "").replace( re ,"");
		},
		htmlEncode:function(str)   
		{   
			var s = "";   
			if (str.length == 0) return "";   
			s = str.replace(/&/g, "&gt;");   
			s = s.replace(/</g, "&lt;");   
			s = s.replace(/>/g, "&gt;");   
			s = s.replace(/ /g, "&nbsp;");   
			s = s.replace(/\'/g, "&#39;");   
			s = s.replace(/\"/g, "&quot;");   
			s = s.replace(/\n/g, "<br>");   
			return s;   
		},
		htmlDecode:function(str)   
		{   
			var s = "";   
			if (str.length == 0) return "";   
			s = str.replace(/&gt;/g, "&");   
			s = s.replace(/&lt;/g, "<");   
			s = s.replace(/&gt;/g, ">");   
			s = s.replace(/&nbsp;/g, " ");   
			s = s.replace(/&#39;/g, "\'");   
			s = s.replace(/&quot;/g, "\"");   
			s = s.replace(/<br>/g, "\n");   
			return s;   
		},  
		in_array : function ($string,$array) {	
			for (var i = 0; i < $array.length; i++) {		
				if ($array[i] == $string) {			
					return i;			
				}
			}	
			return -1;
		},
		//format url
		fUrl:function(url,param){			
			var uri = $.getUri(url);
			p = $.extend(uri.param,param);	
			
			if(p == {}){
				uri.path;
			}else{				
				url = uri.path+"?"+$.param(p);
			}
			
			return url;	
		},
		// get url schema uri
		getUri:function(url){
			var qt = url.split('?');
			if(qt.length == 1){
				return {'path':qt[0]};
			}			
			var queryT = qt[1].split('&');		
			var a = {};
			for(i in queryT){		
				if(!isNaN(i)){
					t = queryT[i].split("=");
					a[t[0]] = decodeURIComponent(t[1]);
				}
			}
			return {path:qt[0],param:a};
		}
		
	});	
	
})(jQuery);

/**
 * FILE MANAGER
 * =====================================================================
 * 
 * 
 */
var ptIde = {};
;(function(){
	
	var isCtrl = false;
	document.onkeyup=function(e){
		if(e.which == 17) isCtrl=false;
	}
	document.onkeydown=function(e){
		if(e.which == 17) isCtrl=true;
		if(e.which == 83 && isCtrl == true) {
			//run code for CTRL+S -- ie, save!
			
			return false;
		}
	}
	
	var _url = {
		ide:'/ptwebos/ide/',
		content:'/ptwebos/ide/content',
		detail:"/project/detail/"
	};
	/**
	 * 搜集项目信息
	 * @param mode
	 * @param obj
	 */

	
	function startServer(key){
		var port = $("#s_port"+key).val();
		var path = $("#s_path"+key).val();
		var host = $("#s_host").val();
		console.log(host,port,path)
		ptService.startServer(path,host,port);
	}
	
	function getUrl(key){
		var port = $("#s_port"+key).val();
		var host = $("#s_host").val();
		var url = "http://"+host+":"+port;
		return url;
	}
	
	function openUrl(key){
		var url = getUrl(key);
		ptService.debug({url:url});	
		console.log(url);
	}
	
	/**
	 * 格式化图片文件相关信息
	 */
	function fImgInfo(width,height,top,left,$parent,path){		
		html = ''
			  +'<div><pre>'
			  +$.htmlEncode("<img src=\""+path+"\" width=\""+width+"px\" height=\""+height+"px\">\n")
			  +$.htmlEncode("{\n\twidth:"+width+"px;\n\theight:"+height+"px;\n\tbackground-position:"+top+"px "+left+"px;\n\tbarckground-repeat:no-repeat;\n\tbackground-image:url("+path+")\n}\n")
			  +'</pre></div>'
			  +'';
		$parent.find(".pt_img_info").html(html);
	}	
	
	/**
	 * 插入子文件夹
	 */
	function insertSubDir($obj,dirs){
		var ul = "<ul></ul>";
		$obj.after(ul);			
		$subDirs = $obj.siblings("ul");		
		
		$.each(dirs,function(i,row){
			var id = 'dir_'+hex_md5(row.path);
			$subDirs.append('<li><div onclick="$(this).dirClk()" data-path="'+row.path+'" id="'+id+'"><em>'+row.basename+'</em></div></li>');			
		});		
	}
	
	/**
	 * 获取相对路径
	 */
	function getRelPath(path,$parent){
		var rel = $parent.data("path");
		if(rel == path){
			return "./";
		}else{
			return path.replace($.rtrim(rel,"/"),".");
		}		
	}
	
	function getCurDirPath($parent){
		return $('.pt_dir_path_con',$parent).children().eq(0).data('path');
	}
	$.fn.extend({		
		copystatic:function(){	
			var path = $(this).parents(".pt_ide").data('path');
			console.log(path);
			$.get(_url.detail,{method:'copystatic',path:path},function(data){
				console.log(data)
			});
		},
		genPtPHP:function(){
			var path = $(this).parents('.pt_ide').data('path');
			$.post('/ptwebos/ide/newptphppro',{path:path},function(data){
				console.log(data);
			})
			console.log(path);
		},
		initIde:function(){
			$parent = $(this);
			
			$('.ide_left_btn li',this).click(function(){
				var key = $(this).data('key');
				$(".pt_"+key+"_wrap",$parent).fadeIn(200).siblings().hide();
			});
			
			var path = $(this).data('path');
			var id = hex_md5(path);
			
			$('.pt_dir_path_con',$parent).sortable({
				//placeholder: "ui-state-highlight",
				stop:function(event,ui){					
					var path = $(this).parents('.pt_ide').data("path");
					$.cookie("dir_"+hex_md5(path),$(this).html());
				}
			});
			$('.pt_file_path_con',$parent).sortable({
				stop:function(event,ui){					
					var path = $(this).parents('.pt_ide').data("path");
					$.cookie("file_"+hex_md5(path),$(this).html());
				}
			});
			$(".pt_dir_path,.pt_file_path").live("click",function(){
				if($(this).index() == 0){					
					$(this).toggleDirs(25);
				}else{
					$(this).loadFiles();
				}
			})
			
			$(".pt_dir_path,.pt_file_path").live("contextmenu1",function(){
				var path = $(this).data("path");
				var id = hex_md5(path);					
				var conObj = $(this).parents(".pt_ide").find(".pt_dir_path_con");
				var conObj1 = $(this).parents(".pt_ide").find(".pt_file_path_con");
				var p_path = $(this).parents('.pt_ide').data('path');
				
				if($(this).hasClass('pt_dir_path')){
					$("#d_p_"+id).remove();
					conObj.showDirs();
					$.cookie("dir_"+hex_md5(p_path),conObj.html());
				}
				
				if($(this).hasClass('pt_file_path')){
					$("#f_p_"+id).remove();
					$("#f_box_"+id).remove();
					conObj1.showDirs();
					$.cookie("file_"+hex_md5(p_path),conObj1.html());
				}		
				return false;
			});
			
			$('.pt_dir_path_con',$parent).disableSelection();
			$('.pt_file_path_con',$parent).disableSelection();
			
			if($.cookie("dir_"+id)){
				var conObj = $(this).find(".pt_dir_path_con");
				conObj.html($.cookie("dir_"+id));
				conObj.children().eq(0).loadFiles(2)
			}else{
				$(".baseDir>li>div",$p).click();
			}
			if($.cookie("file_"+id)){
				var conObj = $(this).find(".pt_file_path_con");
				conObj.html($.cookie("file_"+id));		
				conObj.children().eq(0).addEditor(2);
			}
			$('#s_srv0,#s_srv1,#s_srv2').click(function(){
				var id = $(this).attr('id');
				var key = id.replace('s_srv','');				
				console.log(key);
				startServer(key);
			});
			$('#s_url0,#s_url1,#s_url2').click(function(){
				var id = $(this).attr('id');
				var key = id.replace('s_url','');				
				openUrl(key);
			});
			
		},
		goQuery:function(){
			var $parent = $(this).parents('.pt_ide');	
			var dir = getCurDirPath($parent);
			var ext = $('.pop_ext',$parent).val();
			//var filename = $('.pop_filename',$parent)[0].checked ? 1 : 0;
			var search = $('.pop_search',$parent).val();
			if(!search){
				alert("内容不能为空");
				$('.pop_search',$parent).focus();
				return;
			}
			$.post('/ptwebos/ide/search',{ext:ext,dir:dir,filename:'',search:search},function(data){
				$('.pop_res',$parent).slideDown(100);
				$('.pop_res',$parent).html("");
				if(data.res.length != 0){
					$.each(data.res,function(i,row){		
						var p = getRelPath(row.path,$parent)
						rHtml = '<div class="search_item" onclick="$(this).addEditor();" data-line="'+row.line+'" data-path="'+row.path+'">'
						+'line: <span class="red">'+row.line+'</span> <span>'+p+'</span><br>'
						+'<pre class="res_text">'+row.text+'</pre></div>';
						$('.pop_res',$parent).append(rHtml);
					})
					$('.search_item .res_text',$parent).each(function(i,row){
						
					});
				}else{
					$('.pop_res',$parent).html("无结果");
				}				
			},"json")
			//console.log(path,ext,search);
		},
		closePop:function(){
			$popup = $(this).parents('.popup');
			$('.pop_res',$popup).html('');
			$popup.hide();
		},	
		upDir:function(){
			$parent = $(this).parents('.pt_ide');
			path = getCurDirPath($parent);	
 		},	
		refreshDir:function(){
			$parent = $(this).parents('.pt_ide');
			path = getCurDirPath($parent);			
			var id = hex_md5(path);
			$(".pt_dir_path_con",$parent).children().eq(0).loadFiles(2);
 		},
 		newOpt:function(){
 			$(".query_pan",$parent).slideUp(200);
 			$parent = $(this).parents('.pt_ide');
			if($(".new_pan",$parent).is(":visible")){
				$(".new_pan",$parent).slideUp(200);
			}else{
				$(".new_pan",$parent).slideDown(200);
			}
		},
		goNew:function(){			
 			$parent = $(this).parents('.pt_ide');
			path = getCurDirPath($parent);	
		
			var name = $.trim($("#new_name").val());
			if(!name){
				$("#new_name").focus();
				return false;
			}
			if(!$(".new_type:checked")[0]){
				$(".new_type").focus();
				return false;
			}
			var type = $(".new_type:checked").val();
			console.log(path,type,name);
			if(type == 'dir'){
				url = '/ptwebos/ide/newfolder';
			}else{
				url = '/ptwebos/ide/newfile';
			}
			$obj = $(this);
			
			$.get(url,{path:path,name:name},function(data){
				console.log(data)
				$obj.refreshDir();
				$("#new_name").val('');
				$(".new_type").removeAttr("checked");
				$(".new_pan",$parent).slideUp(200);
			});
		},
		newModule:function(){			
 			$parent = $(this).parents('.pt_ide');
 			var name = $("#new_module",$parent).val();
 			if(!name){
 				$("#new_module",$parent).focus();
 				return false;
 			}
			path = getCurDirPath($parent);	
			//console.log(path);
			module_path = path+"/Application/Module"
			$.post('/project/module/add',{path:module_path,name:name},function(data){
				console.log(data);
			},"json");
			
		},
		newModel:function(){			
 			$parent = $(this).parents('.pt_ide');
			path = getCurDirPath($parent);	
			console.log(path);
			
		},
		newControl:function(){			
 			$parent = $(this).parents('.pt_ide');
			path = getCurDirPath($parent);	
			console.log(path);
			
		},
		openDir:function(){
			$parent = $(this).parents('.pt_ide');
			path = getCurDirPath($parent);
			ptService.openPathDir(path);
		},	
		fileQuery:function(){
			$(".new_pan",$parent).slideUp(200);
			$parent = $(this).parents('.pt_ide');
			path = getCurDirPath($parent);
			
			if($(".query_pan",$parent).is(":visible")){
				$(".query_pan",$parent).slideUp(200);
			}else{
				console.log($(".query_pan",$parent)[0])
				$(".query_pan",$parent).slideDown(200);
			}
		},
	
		/**
		 * 订文件夹
		 */
		pinDir:function(){
			$parent = $(this).parents('.pt_ide');			
			var conObj = $parent.find(".pt_dir_path_con");
			var dirObj = conObj.children().eq(0);
			var id = dirObj.data("id");			
			if(dirObj.hasClass('d_prev')){
				conObj.prepend(dirObj.clone(true).attr("id","d_p_"+id).removeClass("d_prev"));
				dirObj.hide().attr('id',"").attr('data-path','').html("");
				var p_path = $(this).parents('.pt_ide').data('path');
				$.cookie("dir_"+hex_md5(p_path),conObj.html());
			}
			return false;			
		},
		/**
		 * 订文件
		 */
		pinFile:function(){
			$parent = $(this).parents('.pt_ide');
			var conObj = $parent.find(".pt_file_path_con");
			
			var fileObj = conObj.children().eq(0);
			var id = fileObj.data("id");
			if(!$("#f_p_"+id,conObj)[0]){
				conObj.prepend(fileObj.clone(true).attr("id","f_p_"+id).removeClass("f_prev"));
				fileObj.hide().html("");
				$pt_file_prev = $(".pt_file_prev",$parent);	
				
				$pt_file_main_box = $(".pt_file_main_box",$parent);
				$pt_file_main_box.append($pt_file_prev.clone().html('').hide());
				
				$pt_file_prev.data("id",id).attr('id','f_box_'+id).data('id',id).removeClass('pt_file_prev').addClass('funit');				
				
				var p_path = $(this).parents('.pt_ide').data('path');
				$.cookie("file_"+hex_md5(p_path),conObj.html());
			}	
			return false;			
		},
		/**
		 * 点击文件跳至顶端
		 */
		fileGoTop:function(){		
			$parent = $(this).parents('.pt_ide');
			$con = $(this).parent();
			if($(this).parent().children().length >1){
				var t = false;
				if($(this).hasClass('f_prev')){
					$(".pt_file_prev",$(this).parents(".pt_ide")).show().siblings().hide();
				}else{
					var id = $(this).attr("id").replace('f_p_','')
					if($("#f_box_"+id,$(this).parents(".pt_ide"))[0]){
						$("#f_box_"+id,$(this).parents(".pt_ide")).show().siblings().hide();		
					}else{
						t = true;
					}
				}			
				$(this).parent().prepend($(this).clone(true));
				$(this).parent().hideFiles(25);		
				$(this).remove();		
				if(t){
					$con.children().eq(0).addEditor();
				}
			}
			
		},
		/**
		 * 点击文件夹跳至顶端
		 */
		dirGoTop:function(){
			var conObj = $(this).parent();		
			var p_path = $(this).parents('.pt_ide').data('path');
			if(conObj.children().length >1){
				var $parents = $(this).parents('.pt_ide');
				$(this).parent().prepend($(this).clone(true));
				$(this).hideDirs(25);
				$(this).remove();
			}
			$.cookie("dir_"+hex_md5(p_path),conObj.html());
		},
		
		/**
		 * 隐藏已订文件列表
		 */
		hideFiles:function(height,e){
			//console.log($(this).height(),e);
			$(this).height(height);
			return this;
		},
		
		/**
		 * 显示已订文件夹列表
		 */
		showFiles:function(){			
			if($(this).children().length > 1){
				var h = $(this).children(":visible").length*25;
				$(this).height(h);
			}			
			return this;
		},
		
		/**
		 * 隐藏已订文件夹列表
		 */
		hideDirs:function(height,e){
			$(this).parent().animate({height:height+"px"},150);
			return this;
		},
		/**
		 * 显示已订文件夹列表
		 */
		showDirs:function(){
			if($(this).parent().children().length > 1){
				var h = $(this).parent().children(":visible").length*25;
				$(this).parent().animate({height:h+"px"},150);
			}			
			return this;
		},
		
		/**
		 * 交替显示已订文件列表
		 */
		
		toggleFiles:function(h){			
			var height = $(this).height();
			//console.log(height);			
			if(height == h){				
				$(this).showFiles();
			}else{
				$(this).hideFiles(h);
			}			
			return this;			
		},
		
		/**
		 * 交替显示已订文件夹列表
		 */
		
		toggleDirs:function(h){			
			if($(this).index() == 0){				
				var height = $(this).parent().height();				
				if(height == h){							
					$(this).showDirs();
				}else{		
					
					$(this).hideDirs(h);
				}			
				return this;
			}
		},
		/**
		 * 文件夹树节点点击
		 * 
		 */
		dirClk:function(){
			$(this).loadDirs().loadFiles();
			$(this).parents(".baseDir").find("em").removeClass("on");
			$("em", this).addClass("on");			
			return this;
		},
		
		/**
		 * 文件夹树节点点击
		 * 
		 */
		dirClk1:function(){
			//dir_pre_
			var path = $(this).data('path');
			var id = hex_md5(path);
			
			if($("#dir_"+id)[0]){
				$("#dir_"+id).click();
			}else{
				$(this).loadFiles();
			}
			
			return this;
		},
		/**
		 * 加载文件夹下的文件
		 */
		loadFiles:function(prev){
			if(prev !=2){
				prev = 1;
			}
			var id = $(this).attr('id');
			var $obj = $(this);			
			var path = $(this).data('path');
			var $parent = $(this).parents('.pt_ide'); 
			
			setDirPath(path,$parent,prev);
			
			url = $.fUrl(_url.ide,{method:"getfiles",path:path});
			$.get(url,function(data){
				var files = data.res;
				addIdeDirPrev($obj,path,files,$parent);
			},"json");
			
			return this;
		},
		/**
		 * 加载文件夹下的文件夹
		 */
		loadDirs:function(){
			var id = $(this).attr('id');
			var $obj = $(this);
			var path = $(this).data('path');
			url = $.fUrl(_url.ide,{method:"getdirs",path:path});
			//console.log(id,url,path);
			$.get(url,function(data){				
				var dirs = data.res;
				var $subDirs = $obj.siblings("ul");
				if(!$subDirs[0]){
					$obj.addClass("openDir");
					insertSubDir($obj,dirs);
				}else{
					var lis = $subDirs.children("li");
					
					if($subDirs.is(":visible")){
						$obj.removeClass("openDir");
						$subDirs.hide();
					}else{
						$obj.addClass("openDir");
						$subDirs.show();
					}
					if(lis.length != dirs.length){
						$subDirs.remove();
						insertSubDir($obj,dirs);
					}
				}
			},"json")
			
			return this;
		},
		
		/**
		 * 图片文件预览
		 */
		previewImg:function(){
			var path = $(this).parent().data("path");
			$obj = $(this);
			var id = hex_md5(path);			
			var src =$('img',this).attr("src");
			
			var $parent = $obj.parents(".pt_ide");
			if($("#f_box_"+id)[0]){
				$prevbox = $("#f_box_"+id,$parent);
			}else{
				$prevbox = $(".pt_file_prev",$parent);
			}					
			
			setFilePath(path,$parent,($("#f_box_"+id,$parent).length == 0));
			
			$prevbox = $(".pt_file_prev",$parent)
			
			imgHtml = '<div class="a00_0 transBg pt_img_prev" style="bottom:185px">'
				+'<img style="z-index:1" class="absolute" src="'+src+'" title="'+path+'" /><div  style="z-index:2" class="highlight"></div></div><div class="a_000 pt_img_info" style="height:180px">'
				+'</div>';
			$prevbox.html(imgHtml).show().siblings().hide();
			
			$prevbox.find("img").load(function(){
				var width = $(this).width();
				var height = $(this).height();			
				var top = 0;
				var left = 0;			
				fImgInfo(width,height,top,left,$prevbox,path);
				$prevbox.find(".highlight").width(width).height(height)
					.draggable({
						containment: "parent",
						stop:function(){
							var $parent = $(this).parent();							
							var top = $parent.scrollTop()+$(this).position().top;
							var left = $parent.scrollLeft()+$(this).position().left;
							var width = $(this).width();
							var height = $(this).height();
							var path = $("img",$parent).attr("title");
							fImgInfo(width,height,top,left,$parent.parent(),path);
						}
					})
					.resizable({
						stop:function(){
							var $parent = $(this).parent();
							var top = $parent.scrollTop()+$(this).position().top;
							var left = $parent.scrollLeft()+$(this).position().left;
							var width = $(this).width();
							var height = $(this).height();
							var path = $("img",$parent).attr("title");
							fImgInfo(width,height,top,left,$parent.parent(),path);
						}
					});
			});
			
			
		},
	
		/**
		 * 添加编辑器
		 * 
		 */
		addEditor:function(tt){
			var path = $(this).data("path");
			$obj = $(this);
			var id = hex_md5(path);
			var line = $(this).data('line');
			if(!line){
				line = 1;
			}else{
				line = parseInt(line);
			}
			$.get(_url.content,{path:path,ext:""},function(data){
				if(data.code){
					alert("文件太大");					
				}else{
					var uri = $.getUri(this.url);
					var path = uri.param.path;
					var content = data.data.data;
					var ext = data.data.extension;
					//console.log(path,content,ext);
					var id = hex_md5(path);
					var $parent = $obj.parents(".pt_ide");
					
					if($("#f_box_"+id)[0]){
						$prevbox = $("#f_box_"+id,$parent);
					}else{
						$prevbox = $(".pt_file_prev",$parent);
					}	
					
					setFilePath(path,$parent,($("#f_box_"+id,$parent).length == 0));
					if(path.indexOf(".table.php") > 0){
						$prevbox.load('/project/module/model/detail?path='+path);
					}else{
						$prevbox.html('<pre class="epre" data-path="'+path+'" id="pre_'+id+'"></pre>').show().siblings().hide();						
						$("#pre_"+id).pteditor({ext:ext,data:content,line:line},function(data){
						});	
					}			
				}				
			},"json")
		}
	});
	
	/**
	 * 设置文件夹路径
	 */
	function setDirPath(path,$parent,prev){
		var p = getRelPath(path,$parent)
		var id = hex_md5(path);		
		if($("#d_p_"+id)[0]){
			$("#d_p_"+id,$parent).dirGoTop();
		}else{
			$(".d_prev",$parent).html(p).attr('data-path',path).data('id',id).show().dirGoTop();			
		}
		
	}
	
	/**
	 * 设置文件路径
	 * 
	 */
	function setFilePath(path,$parent,prev){
		var p = getRelPath(path,$parent)
		var id = hex_md5(path);
		
		if(prev){			
			if($(".f_prev",$parent)[0]){
				$(".f_prev",$parent).html(p).attr('data-path',path).data('id',id).show().fileGoTop();
			}
		}else{
			if($("#f_p_"+id,$parent)[0]){
				$("#f_p_"+id,$parent).fileGoTop();
			}else{
				phtml = '<div onclick="" id="f_p_'+id+'" data-type="'+prev+'" class="pt_file_path f_prev">'+p+'</div>';
				$(".pt_file_paths .pt_file_path_con",$parent).prepend(phtml);
			}			
		}
	}
	
	
	/**
	 * 添加文件夹预览	
	 */
	function addIdeDirPrev($obj,path,files,$parent){		
		//console.log($obj,$parent);
		var id = hex_md5(path);		
		$mainbox = $(".pt_dir_prev",$parent);		
		$(".code_list,.dir_list, .img_list").html('').hide();		
		$.each(files,function(i,row){
			//console.log(i,row);
			var html = "";
			var classN = "code_list";
			if(row.extension == 'gif' || row.extension == 'png' || row.extension == 'jpg'){
				img = '<img id="img_'+hex_md5(row.path)+'" src="/static/library/common/images/loading/loading.gif" alt="" />';
				html = '<div class="file_item file_img relative" title="'+row.path+'" data-path="'+row.path+'">'
					+'<div class="file_prev transBg ">'+img+'</div><p class="file_name">'+row.basename+'</p></div>';
				var classN = "img_list";
			}else if(row.extension == 'dir'){				
				html = '<div onclick="$(this).dirClk1()" id="dir_pre_'+hex_md5(row.path)+'" class="file_item relative file_code ext_dir" title="'+row.path+'" data-path="'+row.path+'">'
				+'<div class="file_name absolute">'+row.basename+'</div></div>';
				var classN = "dir_list";
			}else{
				html = '<div onclick="$(this).addEditor()" class="file_item relative file_code ext_'+row.extension+'" id="file_'+id+'" title="'+row.path+'" data-path="'+row.path+'">'
				+'<div class="file_name absolute">'+row.basename+'</div></div>';				
			}			
			$("."+classN,$mainbox).append(html);
		});
		
		if($(".code_list",$mainbox).children()[0]){
			$(".code_list",$mainbox).fadeIn(300);
		}
		if($(".dir_list",$mainbox).children()[0]){
			$(".dir_list",$mainbox).fadeIn(300);
		}
		if($(".img_list",$mainbox).children()[0]){			
			$(".file_item img",$mainbox).each(function(){			
				var path = $(this).parents(".file_item").data("path");
				//console.log(path);
				var ext = 'img';			
				$.get(_url.content,{path:path,ext:ext,id:hex_md5(path)},function(data){
					var id = "#img_"+$.getUri(this.url).param.id;
					var width = data.img[0];
					var height = data.img[1];				
					$(id).attr("src",'data:'+data.img.mime+';base64,'+data.img.data).load(function(){
						$(this).adjustImg().parent().attr("onclick","$(this).previewImg();return false;");
					});				
				},"json");
			});	
			$(".img_list",$mainbox).fadeIn(300);
		}
			
	}
	
	/**
	 * FILE MANAGER
	 * =====================================================================
	 * 
	 * 文件夹预览结构
	 * ——————————————————————————————————————
	 * 
	 * pt_dir_top_box
	 *	 pt_dir_paths
	 * 			div.pt_dir_path_con_pan
	 * 			div.pt_dir_path_con
	 * 				d_prev
	 * 				div.pt_dir_path  #d_p_******
	 *	pt_dir_ctl
	 *			button.fav_dir
	 * 
	 * pt_dir_main_box
	 * 		div.pt_dir_prev
	 * 		div.eunit  #d_box_******
	 * 		
	 * 
	 * 文件预览结构
	 * ———————————————————————————————————————
	 * 
	 * 
	 * pt_file_top_box
	 *	 pt_file_paths
	 * 			div.pt_file_path_con_pan
	 * 			div.pt_file_path_con
	 * 				f_prev
	 * 				div.pt_file_path #f_p_******
	 *	pt_file_ctl
	 *			button.fav_file
	 * 
	 * pt_file_main_box
	 * 		div.pt_file_prev
	 * 			.epre #pre_
	 * 
	 * 		div.funit #f_box_******
	 * 
	 * 
	 * 
	 * 
	 */
	ptIde.getUrl = getUrl;
})(jQuery);


