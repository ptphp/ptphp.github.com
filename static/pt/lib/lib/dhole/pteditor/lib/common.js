$(function(){
	$(".toolbar-item").click(function(){
		$(this).addClass("toggled-on").siblings().removeClass("toggled-on");
        //key = $(this).data('key');
        //console.log($("#main-panels ."+key),key)
		$("#main-panels ."+key).addClass('visible').siblings().removeClass("visible");		
	});
	
	$("#srcTree").listTree();
	
	$(".split-view-resizer").draggable({
		axis: "x",
		cursor: "ew-resize",
		drag:function(){
			left = $(this).position().left+3;
			$(this).siblings('.split-view-sidebar-left').width(left);
			$(this).siblings('.diff-container').css({left:left+"px"});			
		}
	});
	
	$("#scripts-files").change(function(){
		var v= $(this).val();
		$.addEditor(v);
	});
	$("#btn_dir").click(function(){
		var v = $("#input_dir").val();		
		$("#srcTree").attr('title',v);
		$("#srcTree").listTree();
	});
});
(function($){
	
	function addFileAndDir(file,obj){
		$.each(file,function(i,row){					
			if(row.extension == 'dir'){
				$(obj).next("ol").append('<li onclick="$(this).toggleFolder()" title="'+row.path+'" class="frame-storage-tree-item parent"><div class="selection"></div>'
						+'<img class="icon"><div class="base-storage-tree-element-title"><span class="base-storage-tree-element-subtitle">'+row.basename+'</span>'
                    	+'</div></li>');
			}
		})
		$.each(file,function(i,row){					
			if(row.extension != 'dir'){
				$(obj).next("ol").append('<li onclick="$(this).selectFile()" title="'+row.path+'" class="resource-sidebar-tree-item resources-category-documents" draggable="true">'
	                    +'<div class="selection"></div>'
	                    +'<img class="icon ext_'+row.extension+'">'
	                    +'<div class="status"></div>'
	                    +'<div class="base-storage-tree-element-title">'
	                    +'   '+row.basename
	                    +'</div>'
	                    +'</li>');
			}
		})
	}
	function getContent(path){
		content = editor.getContent(path);
		//console.log(content)
		$.pteditors["e_"+hex_md5(path)].setValue(content);
		$.pteditors["e_"+hex_md5(path)].gotoLine(1);
		
		/**
		 * $.get('/ptwebos/ide/content?ext=&path='+path,function(data){
			//console.log(data.data.data);
			$.pteditors["e_"+hex_md5(path)].setValue(data.data.data);
			$.pteditors["e_"+hex_md5(path)].gotoLine(1);
		},'json');
		 */
	}
	function addEditor(path){
		if(!$("#e_"+hex_md5(path))[0]){
			$("#editor_wrap").append('<pre data-path="'+path+'" id="e_'+hex_md5(path)+'"></pre>');
			$("#e_"+hex_md5(path)).pteditor({},function(id){
				var path = $("#"+id).data('path');
				var v = $("#scripts-files").getOption(path).text();
				$("#scripts-files").getOption(path).text(v.replace("*",""))
			},function(id){
				var path = $("#"+id).data('path');
				var v = $("#scripts-files").getOption(path).text();
				$("#scripts-files").getOption(path).text(v.replace("*","")+"*")
			});			
			if(!$("#scripts-files").hasOption(path)){
				$("#scripts-files").append('<option value="'+path+'">'+path+'</option>');
			}
			
			getContent(path);
		}
		$("#scripts-files").val(path);
		$("#e_"+hex_md5(path)).show().siblings().hide();			
		$.pteditors["e_"+hex_md5(path)].resize();
	}
	//String 转 Object
	function stringToObject(str){
		return (new Function("","return " + str))();
	}
	//Object 转 String
	function objectToString(obj){
		return JSON.stringify(obj);
	}
	
	$.fn.extend({
		hasOption:function(v){
			res = false;
			$('option',this).each(function(){
				if($(this).attr("value") == v){
					res = true;
				}
			})
			return res;
		},
		getOption:function(v){
			res = false;
			obj = this;
			$("option",this).each(function(){
				if($(this).attr("value") == v){
					res = $(this);
				}
			})
			return res;
		},
		closeEditor:function(){
			v = $("#scripts-files").val();
			if(v){
				$("#e_"+hex_md5(v)).remove();
				$.pteditors["e_"+hex_md5(v)].destroy();		
				delete $.pteditors["e_"+hex_md5(v)];
				console.log($.pteditors["e_"+hex_md5(v)]);
				$("#scripts-files option").each(function(){
					if($(this).attr("value") == v){						
						$(this).remove();						
					}
				});
				if($("#scripts-files option")[0]){
					$("#scripts-files").change()
				}
				
			}
		},
		listTree:function(){
			path = $(this).attr("title");
			url = "/ptwebos/ide/?method=getfiles&path="+path;
			obj = this;
			//console.log(editor.getFiles(path));
			if($(obj).next('ol.children')[0]){
				$(obj).next('ol.children').empty();
			}else{
				$(obj).after('<ol class="children expanded"></ol>');
			}
			file = [];
			try{
				file = stringToObject(editor.getFiles(path));
			}catch(e){
				
			}
			
			addFileAndDir(file,obj)			
			return false;
			$.get(url,function(data){
				file = data.res;
				if($(obj).next('ol.children')[0]){
					$(obj).next('ol.children').empty();
				}else{
					$(obj).after('<ol class="children expanded"></ol>');
				}
				addFileAndDir(file,obj)
			},'json')
		},
		toggleFolder:function(){
			$parent = $("#srcTree").parent("ol");
			$('li',$parent).removeClass('selected');
			$(this).toggleClass("expanded");
			$(this).next("ol").toggleClass("expanded");			
			$(this).addClass("selected");
			$(this).listTree();
		},
		selectFile:function(){
			$parent = $("#srcTree").parent("ol");
			$('li',$parent).removeClass('selected');
			$(this).addClass("selected");
			path = $(this).attr("title");
			//console.log(hex_md5(path));
			addEditor(path);
		}
	});
	$.addEditor = addEditor;
})(jQuery)


function reply(url){			
	$parent = $("#main-panels .network .data-container tbody");
	$('div[title="'+url+'"]',$parent).find('img').removeClass('network-loading');
}
function request(url){
	console.log(url)
	html = '';
	html += '<tr class="revealed network-item network-category-scripts"><td class="name-column">'
			+'<div title="'+url+'"><img class="icon network-loading">'+url+'<div class="network-cell-subtitle">'+url+'</div></div></td><td class="method-column"><div title="GET">GET</div></td><td class="status-column"><div title="304 Not Modified">304<div class="network-cell-subtitle">Not Modified</div></div></td><td class="type-column"><div title="text/plain">text/plain</div></td><td class="size-column"></td><td class="time-column"></td></tr>';

	$("#main-panels .network .data-container tbody").prepend(html);
}
function clearRequest(){			
	$("#main-panels .network .data-container tbody").html('<tr class="filler"><td class="name-column"></td><td class="method-column"></td><td class="status-column"></td><td class="type-column"></td><td class="size-column"></td><td class="time-column"></td><td class="timeline-column"></td></tr>')
}
function do_js_beautify(js_source) {
    js_source = js_source.replace(/^\s+/, '');
    tabsize = 4;
    tabchar = ' ';
    if (tabsize == 1) {
        tabchar = '\t';
    }
    if (js_source && js_source.charAt(0) === '<') {
        content = style_html(js_source, tabsize, tabchar, 80);
    } else {
        content = js_beautify(js_source, tabsize, tabchar);
    }
    return content;
}


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
	function setEditor(option,save,onchange){
		var id = $(this).attr('id');
		var path = $(this).data('path');
		var setting = $.extend({
			ext:'',
			data:'',
			line:0,
			theme:'ace/theme/twilight',
		},option);
		var ext = getFileExt(path)
		var e = ace.edit(id);
		
		var mode = getMode(ext[0].replace('.',''));		
	    e.setTheme(setting.theme);  
	    e.getSession().setMode(mode);
	    e.getSession().on('change', function(data) {
	        if(onchange){
	        	onchange(e.container.id)
	        }
	    });
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
	    e.getSession().on('change',function(ee){
	    	
	    });
	    var commands = e.commands;
	    commands.addCommand({
	        name: "F4KEY",
	        bindKey: {win: "F4"},
	        exec: function(data) {
	        	var id = data.container.id;
	        	console.log(id)
	        	console.log(editors[id].selection.getCursor());
	        	editors[id].insert("test");
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
	            
	            var path = $("#"+id).data("path");
	            if(!path){
	            	return;
	            }
	            var content = editors[id].getValue(); 
	            
	            //$("#"+id).refreshWin(content,$parent);
	            editor.saveContent(path,content)
	            save(id)
	            //$.post(url.editorSave,{path:path,content:content},function(d){
	            	//save(id)
	            //})
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

