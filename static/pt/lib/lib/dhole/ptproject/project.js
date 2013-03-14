//$(obj).parents(".ide").prev().find("iframe")[0].contentWindow.curObj
var ptModel = {};
;(function($){
	var ptproject = {};
	
	$.fn.extend({
		openProIde:function(){
			var path = $(this).parent().data('path');
			var url = ptApi.config['PTURL']+'/ptwebos/ide/?path='+path;
			$(this).data('url',url);
			//$(this).addLayer();
			ptApi.openUrl(url);
			
		},
		delPro:function(name){
			if(!confirm("确定要删除么？"))
				return false;
			//console.log(name);
			var path = $(this).parent().data('path');
			$.post('/project/?method=delete',{path:path},function(data){
				if(data.error){
					alert(data.message);
				}else{
					location.reload();
				}
			},"json")
			return false;
		},

		newPro:function(){
		
			$name = prompt("请输入项目名(只能为英文)：");	
			if(!$name ){
				return;
			}
			if(isEnNum($name)){
				console.log($name);
				$.post('/project/',{name:$name},function(data){
					if(data.error){
						alert(data.message);
					}else{
						location.reload();
					}
				},"json")
			}else{
				alert("项目名不合法！");
			}
			return false;
		
	}
	});
	
	
	
	$.ptproject = ptproject;
})(jQuery);

;(function($){
	var urls = {};
	urls['detail'] = '/project/detail/';
	urls['detail_edite'] = '/project/detail/edite';
	urls['module'] = '/project/module/';
	urls['module_list'] = '/project/module/list';
	urls['module_add'] = '/project/module/add';
	urls['control'] = '/project/module/controller/';	
	urls['control_add'] = '/project/module/controller/add';	
	urls['model_add'] = '/project/module/model/add';
	urls['model_field'] = '/project/module/model/field/';
	urls['model_former'] = '/project/module/model/former/';
	urls['model_sql'] = '/project/module/model/sql/';
	urls['model_createtable'] = '/project/module/model/sql/createtable';
	urls['model_manlist'] = '/project/module/model/manlist/';
	urls['model_file'] = '/project/module/model/file/';
	urls['model_schema'] = '/project/module/model/schema/';
	urls['module_detail'] = '/project/module/detail';
	var proUrls = urls;
	
	
	function getModelMain (){
		return $obj.parents('.module_module_detail');
	}
	
	function getFormer($obj){
		var $model_main = getModelMain($obj[0]);
		var key = "former";		
		var path = $model_main.data("path");
		getModeDetail(path,key,$model_main);
	}

	/**
	 * 获取模型信息
	 * @param name
	 * @param path
	 * @param key
	 * @param $m_tab_pannel
	 */
	
	function getModeDetail(path,key,obj){
		$.get(proUrls['model_'+key],{path:path},function(data){
			//console.log($(".model_pro_main",obj)[0],data);
			$(".model_pro_main",obj).html(data);
		});
	}
	
	
	$.fn.extend({
		field_up:function(){
			var obj = $(this).parent().parent();
			if(obj.prev()[0]){
				t = obj.prev()
				obj.clone(true).insertBefore(t);
				//console.log(obj);
				obj.remove();
				forder(t);
			}
		},
		field_del:function(){
			var obj = this;
			if(!confirm("确定？")){
				return;			}
			var key = $(this).parent().parent().find(".field_cell").attr("data-key");
			var path = $(this).parents('.module_module_detail').attr('data-path');
		
			$.post(proUrls['model_schema']+"?method=delete&path="+path,{key:key},function(data){				
				console.log(data);
				forder(obj);
			})
		},
		field_down:function(){
			var obj = $(this).parent().parent();
			if(obj.next()[0]){
				var t = obj.next();
				obj.clone(true).insertAfter(t);
				obj.remove();
				forder(t);
			}
		},
		onModelChange: function (){	
			$obj = $(this);
			$obj.addClass("on").siblings().removeClass("on");
			$obj.parents(".ide_menu").next().find(".model_pro_main").show().siblings().hide();
			var $model_main = getModelMain($obj[0]);
			var key = $obj.data("key");		
			var path = $model_main.data("path");
			getModeDetail(path,key,$model_main);
			return false;
		},
		openTableFile:function(){	
			var path = $(this).parents(".module_module_detail").data("path");
			var url = "/project/module/model/field/tablefile?path="+path;
			openPreview(url);
		},
		openFormSchema:function(){
			var path = $(this).parents(".module_module_detail").data("path");
			var url = "/project/module/model/Former/schema?path="+path;
			openPreview(url);
		},
		openFormSrc:function(){
			var path = $(this).parents(".module_module_detail").data("path");
			var url = "/project/module/model/Former/src?path="+path;
			openPreview(url);
		},
		openTableSql:function(){
			var path = $(this).parents(".module_module_detail").data("path");
			var url = "/project/module/model/sql/?path="+path;
			openPreview(url);
		},
		/**
		 * 生成数据表
		 * @param obj
		 */
		createTable:function(){	
			if(!confirm("生成表将会删除原来的表，再重新建表，确定？")){
				return;
			}
			obj = this;
		    var path = $(obj).parents('.module_module_detail').attr('data-path');
		    var module = $(obj).parents('.module_module_detail').attr('data-module');
		    var url = proUrls['model_createtable']+'?path='+path+"&module="+module;
		    //console.log(obj,url,path);
		    
		    $.get(url,function(data){
		    	console.log(data);
		    	if(data.error){
		    		alert(data['message']);
		    	}else{
		    		
		    	}
		    },"json")
		}
	});
	
	/**
	 * 改变字段长度
	 * @param obj
	 * @param value
	 * @param param
	 * @returns
	 */
	function clength(obj,value,param){
		if(value == 'id'){
	        $(obj).nextAll(':checkbox').attr('checked','true');
	        param['ac'] =1;
	        param['pk'] =1;
	    }
	        
		if(value=="int"){
	        $(obj).prev().val('11');
	        param['max'] =11;
	    }
	    if(value=="varchar"){
	        $(obj).prev().val('50');
	        param['max'] =50;
	    }
	    if(value=="tinyint"){
	        $(obj).prev().val('4');
	        param['max'] =4;
	    }
	    if(value=="smallint"){
	        $(obj).prev().val('6');
	        param['max'] =6;
	    }
	    if(value=="mediumint"){
	        $(obj).prev().val('9');
	        param['max'] =9;
	    }
	    if(value=="bigint"){
	        $(obj).prev().val('20');
	        param['max'] =20;
	    }
	    if(value=="bool"){
	        $(obj).prev().val('1');
	        param['max'] =1;
	    }
	    if(value=="char"){
	        $(this).prev().val('2');
	        param['max'] =2;
	    }
	    if(value=="float"){
	        $(obj).prev().val('11');
	        param['max'] =11;
	    }
	    if(value=="date" || value=="datetime" || value=="text" || value=="enum" || value=="set"){
	        $(obj).prev().val('0');
	        param['max'] =0;
	    }
	    
		return param;
	}

	/**
	 * 修改元素类型
	 * @param obj
	 * @param value
	 * @param param
	 * @returns
	 */
	function celement(obj,value,param){
		$element = $(obj).parent().find('[name=element]');	
		$pt_form = $(obj).siblings('.pt_form');
		pmfrow($element.val(),$pt_form,obj);
		//console.log(obj,value,param,$pt_form,$element.val());
		return param;
	}


	/**
	 * 修改字段信息
	 * @param obj
	 */
	function changeField(obj){		
		var key = $(obj).parents('.field_cell').attr('data-key');
		console.log(key);
		if(!key){
			alert("无效参数");
			return;
		}
		
	    var value = obj.value;
	    var param ={};
	    
	    var name = obj.name;
	    
	    if(name=='type'){
	    	param = clength(obj,value,param);
	    }
	    if(name=='element'){
	    	//param = celement(obj,value,param);  
	    }
	    
	    if(name == 'min' && parseInt(value) >0){
	        param['rq'] = 1;
	    }
	    if(name == 'yz'){
	    	var regx = $(obj).find(":selected").data("regx");
	    	//console.log(regx);
	    	if(value == 'own'){        	
	    		$(obj).next().show().find('input').val("").removeAttr("readonly").focus();
	        }else{
	        	$(obj).next().show().find('input').val(regx).attr("readonly","true").attr('size',(regx.length+8));
	        }
	    }
	    if(name == 'pk' && !obj.checked){
	        param[name] = 0;
	    }else if(name == 'ac' && !obj.checked){
	        param[name] = 0;
	    }else if(name == 'uq' && !obj.checked){
	        param[name] = 0;
	    }else if(name == 'list' && !obj.checked){
	        param[name] = 0;
	    }else{
	        param[name] = value;
	    }
	    
	    var path = $(obj).parents('.module_module_detail').attr('data-path');
	    var module = $(obj).parents('.module_module_detail').attr('data-module');
	    var url = proUrls['model_schema']+'?path='+path+'&key='+key+'&module='+module;
	    
	    console.log(key,name,value,param,module,url,path);
		
	    $.post(url,param,function(data){
	    	console.log(data);
	    	if(data && data.error){        		
	    		console.log(data.message);
	    		return;
	    	}
	    	var isFormer = $(obj).attr('data-former');
			if(name=='element'){
	        	if(isFormer){
	        		getFormer($(obj));
	        	}
	        }	
	        if(name=='max'){
	        	if(isFormer){
	        		getFormer($(obj));
	        	}
	        }
	        if(name=='width'){
	        	if(isFormer){
	        		getFormer($(obj));
	        	}
	        }
	        if(name=='height'){
	        	if(isFormer){
	        		getFormer($(obj));
	        	}
	        }
	    },"json");    
	}

	/**
	 * 新加字段
	 * @param obj
	 * @returns {Boolean}
	 */
	function newfield(obj){
		var $doc = $(obj).parents('.module_module_detail');
		var $db = $(".db",$doc);
		//console.log($db);
		
	    var num = parseInt($db.attr('data-num'));
	    if(!num){
	        num = 1;
	    }else{
	        num = num + 1;
	    }
	    $db.attr('data-num',num);
	    //console.log($db.attr('data-num'));
	    var html = $(".table_item table tbody",$doc).html();
	    html = html.replace('data-key="key"','data-key="'+num.toString()+'"');
	    if($("tbody",$db)[0]){
	    	$("tbody",$db).append(html);
	    }else{
	    	$db.append("<tbody>"+html+"</tbody>");
	    }    
	    return false;
	}




	function forder(obj){
		var path = $(obj).parents('.module_module_detail').attr('data-path');
		var module = $(obj).parents('.module_module_detail').attr('data-module');
		var rows = {};
		$(".db tr").each(function(){
			var row = {};
			var key = $(this).find('.field_cell').data('key')
			var order = $(this).index()+1;
			rows[key] = order;
			
		});
		//console.log(rows,proUrls['model_schema']);
		$.post(proUrls['model_schema']+"?method=orders&path="+path+"&module="+module,rows,function(data){
			//console.log(data);
			var $model_main = getModelMain($obj[0]);
			getModeDetail(path,'field',$model_main);
		},"json")
	}

	
	
	function openPreview(url){
		ptService.debug({url:url});
	}
	
	ptModel = {
			newfield:newfield,
			changeField:changeField,
			forder:forder,
			celement:celement,
			clength:clength
	};
	
	
})(jQuery);







