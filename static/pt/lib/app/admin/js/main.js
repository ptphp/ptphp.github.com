$(function(){
	//$.ptAdmin.init();
	
	$('.editor').each(function(){
		var id = $(this).attr("id");
		KindEditor.create('#'+id,$.ptAdmin.eoption);
	});
	
	$('.datetime').each(function(){
		var id = $(this).attr("id");
		option = $.ptAdmin.coption;
		//option.dateFormat = "%Y-%m-%d"; //width = 100;
		option.dateFormat = "%Y-%m-%d %H:%M:%S"; //width = 160;
		option.inputField = id;
		option.trigger = id;
	    Calendar.setup(option);

	   // $("#"+id).parent().css("position","relative");
	   // $("#"+id).width(width).attr('readonly','true').addClass('date');
	});
	$(".echeckbox").click(function(){
		alert(this.value);
		this.value = (this.value == '0') ? '1':'0';
	});
	
});

;(function(){
	$(document).ajaxStart(onStart)
			   .ajaxComplete(onComplete)
			   .ajaxSuccess(onSuccess);

	function onStart(event) {
		//console.log("start")
		$(".loading").fadeIn(200);
	}
	function onComplete(event, xhr, settings) {
		//console.log("complete")
		$(".loading").fadeOut(200);
	}
	function onSuccess(event, xhr, settings) {
		//console.log("success",settings)
		$(".loading").fadeOut(200);
	}
})(jQuery);
;(function(){	

	//时间 配置
	var coption = {
			weekNumbers: true,	    
		    minuteStep: 1,
		    onSelect   : function() {this.hide();}
		};

	var eoption = {
		allowFileManager : true,
		uploadJson : '/upload.php?method=upimg',
		resizeType : 0,
		items : [
			'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
			'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
			'insertunorderedlist', '|', 'emoticons', 'image', 'link'
		]
	};
	editor = KindEditor.editor(eoption);
	//KindEditor.create('#text',eoption);
	$('.img-btn').live('click',function() {			
		var $image_id = $(this).prev().attr('id');
		  editor.loadPlugin('image', function() {
	            editor.plugin.imageDialog({
	                showRemote : false,
	                imageUrl : $("#"+$image_id).val(),
	                clickFn : function(url, title, width, height, border, align) {
	                    //console.log(url, title, width, height, border, align);
	                    $("#"+$image_id).val(url);
	                    $("#"+$image_id).siblings('.img-preview').show().attr('src',url);
	                    editor.hideDialog();
	                }
	            });
	        });  
	        return false; 
    });


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

	var ptAdmin = {
			version:0.1,
			api:{
				login:"/admin.php?c=login&ajax=1",
				logout:"/admin.php?c=logout&ajax=1"
			}
	};
	
	ptAdmin.init = function(){	

		if($.cookie("model_url")){
			getModel($.cookie("model_url"));
		}else{
			getModel('/admin.php?model=database&flag=1&func=tables');
		}		
		$('.eitem span').live('dblclick',function(){
			var v = $(this).text();
			var key = $(this).attr('data-key');
			var width = $(".eitem").width();
			$(this).parent('.eitem').html('<input data-key="'+key+'" style="" value="'+v+'">');
		});
		$('.eitem :checkbox').live('change',function(){
			var v = this.checked?'1':0;
			var kk = $(this).attr("data-key");
			var table = $(this).parents("table.etable").attr('data-table');
			var id = $(this).parents(".epk").attr("data-id");

			var param = {};
			param[kk] = v;
			dbtype = 1;
			$.post('/admin.php?model=database&flag=1&table='+table+'&dbtype'+dbtype+'&func=updateField&id='+id,param,function(data){
				//console.log(data);
			})

		});
		$('.eitem :input').live('blur',function(){
			var v = this.value;
			var kk = $(this).attr("data-key");
			var table = $(this).parents("table.etable").attr('data-table');
			//var dbtype = $(this).parents("#model_area").attr('data-dbtype');
			var id = $(this).parents(".epk").attr("data-id");
			//console.log(table,id,v,kk);
			var param = {};
			param[kk] = v;
			dbtype = 1;
			$.post('/admin.php?model=database&flag=1&table='+table+'&dbtype'+dbtype+'&func=updateField&id='+id,param,function(data){
				//console.log(data);
			})
			$(this).parent('.eitem').html('<span data-key="'+kk+'">'+v+'</span>');
		});
	}	

	$.fn.extend({
		toggleCheckbox:function(){
			if($(this)[0].checked){
				$(".checkbox_item").attr("checked","true");
			}else{
				$(".checkbox_item").removeAttr("checked");
			}
		},
		checkAll:function(){
			if($(this)[0].checked){
				$(".checkbox_item").attr("checked","true");
			}else{
				$(".checkbox_item").removeAttr("checked");
			}
		},
		
		checkReverse:function(){
			$(".checkbox_item").each(function(){
				obj = $(this)[0];
				if(obj.checked){
					$(this).removeAttr("checked");
				}else{
					$(this).attr("checked","true");
				}
			})
		},
		deleteChecked:function(){				
			ids = [];
			$(".checkbox_item:checked").each(function(){				
				if($(this).val()){
					ids.push($(this).val());
				}
			})
			if(ids.length == 0){
				return false;
			}
			if(!confirm("确认要删除么？")){
				return false;
			}
			//console.log(ids,location.href);	
			var table = $(".table_list").attr("data-table");
			//url = '/admin.php?model=database&flag=1&func=remove_row&table='+table;
			url = $(this).data('url');
			//console.log(ids,table,ids.join());
			//return ;
			$.ajax({
				url:url,
				type:"POST",
				data:{ids:ids.join()},
				success:function(data){
					//console.log(data)
					location.reload()
				}
			})
		},
		goLogout:function(){
			$.get(ptAdmin.api.logout,function(){
				location.reload();
			})
		},
		goLogin:function(){
			var username = $("#username").val();
			var password = $("#password").val();
			if(!username){
				alert("用户名不能为空");				
				$("#username").focus();
				return false;
			}			
			if(!password){
				alert("密码不能为空");
				$("#password").focus();
				return false;
			}
			
			$(this).attr("disabled","true").text("正在登陆...");
			obj = this;
			$.post(ptAdmin.api.login,{username:username,password:password},function(reply){
				if(!reply.error){
					$(obj).text("登陆成功");
					location.href="/admin.php"
				}else{
					alert("用户名和密码不正确");
					$(obj).removeAttr("disabled").text("登陆");
				}
			},"json");
		},

		modelClick:function(){
			var url = $(this).attr('href');
			getModel(url);
			return false;
		},

		modelPrev:function(){
			$("#model_detail #myModalTitle").html('预览');
			$("#model_detail #model_save").hide();
			
			var model = $(this).parents('table.etable').attr('data-table');
			var id = $(this).parents('tr').data('id');
			$("#model_detail .modal-body table").attr('data-table',model);
			$("#model_detail .modal-body table tbody").html('')			
			$.get('/admin.php',{model:model,id:id},function(data){
				var row = data.result.row;				
				for(i in row){
					$("#model_detail .modal-body table tbody").append('<tr class="epk" data-id="'+id+'"><th style="width:100px;">'+i+'</th><td class="eitem"><span data-key="'+i+'">'+row[i]+'</span></td></tr>')
				}				

			},'json')
		},

		modelAdd:function(){
			$("#model_detail #myModalTitle").html('新加');	
			$("#model_detail #model_save").show();		
			var model = $("#model_area").find('table.etable').attr('data-table');
			$("#model_detail .modal-body table tbody").html('')	
			$("#model_detail .modal-body table").attr('data-table',model);
			$.get('/admin.php',{model:model,flag:1,func:'getsche'},function(data){

				var schema = data.result.rows;
				var $obj = $("#model_detail .modal-body table tbody");
				for(i in schema){
					var row = schema[i];
					//console.log(row);
					//KindEditor.create('#text',eoption);
					var id = model+'_'+row.name;
					switch(row.element){
						case 'hidden':
							$obj.append('<input type="hidden" id="'+id+'" name="'+row.name+'">');
							break;
						case 'editor':
							$obj.append('<tr><th style="width:100px;">'+row.title+'</th><td><textarea style="width:530px;height:200px" id="'+id+'" name="'+row.name+'"></textarea></td></tr>');
							KindEditor.create('#'+model+"_"+row.name,eoption);
							break;
						case 'image':
							$obj.append('<tr><th style="width:100px;">'+row.title+'</th><td><input id="'+id+'" name="'+row.name+'"> <button class="btn btn-mini btn-primary img-btn">上传</button><br><img src="" class="img-preview" alt="" style="width:160px;height:160px;border:1px #ccc solid" /></td></tr>');
							break;
						default:
							$obj.append('<tr><th style="width:100px;">'+row.title+'</th><td><input id="'+id+'" name="'+row.name+'"></td></tr>');
							break;
					}					
				}
			},'json');

		},

		schemaClick:function(){	
			var table = $("#con_record").find('table.etable').attr('data-table');	
			//console.log(table);
			$.get('/admin.php?model=database&flag=1&func=schema&table='+table,function(data){
				$("#model_area").attr('data-table','schema');

				var html = '<table data-table="schema" class="etable table table-hover table-striped table-bordered table-condensed">'
					+'<thead>'
					+'	<tr>'
					+'		<th width="100px">Name</th>'
					+'		<th width="100px">Title</th>'
					+'		<th>PK</th>'
					+'		<th width="60px">表单</th>'
					+'		<th width="28px">List</th>'					
					+'		<th width="80px">列表编辑</th>'
					+'	</tr>'
					+'</thead>'
					+'<tbody>';
					var rows = data.result.rows;
					for(i in rows){
						var lchecked = (rows[i].list != 0)?"checked":"";
						var lechecked = (rows[i].listedit != 0)?"checked":"";
						
						html+='	<tr class="epk" data-id="'+rows[i].id+'">'
						html+='		<td>'+rows[i].name+'</td>'
						html+='		<td class="eitem"><span data-key="title">'+rows[i].title+'</span></td>'
						html+='		<td>'+rows[i].pk+'</td>'
						html+='		<td class="eitem"><span data-key="element">'+rows[i].element+'</span></td>'
						html+='		<td class="eitem"><input data-key="list" '+lchecked+' type="checkbox"></td>'
						html+='		<td class="eitem"><input data-key="listedit" '+lechecked+' type="checkbox"></td>'
						html+='	</tr>'
					}
					
					html+='</tbody>'
				+'</table>';
				$("#con_schema").html(html);

			},'json')
			//$("#con_schema").show(200).siblings().hide()
		}
	})
	function getModel(url){
		$.cookie("model_url",url);
		$.get(url,function(data){		
				fTable(data.result);
				fBreadcrumb(data.result.nav);
			},'json')
	}

	function fBreadcrumb(bs){		
		var url_index = $(".brand").attr("href");		
		var html = '<li><a href="'+url_index+'">首页</a><span class="divider">/</span></li>';
		for(i in bs){			
			if(bs[i].active){
				html +=' <li class="active">'+bs[i].name+'</li>';
			}else{
				var onclick = bs[i].click?' onclick="'+bs[i].click+'"':'';	
				var href = bs[i].href?bs[i].href:'javascript:void(0)';	 
				html +=' <li><a href="'+href+'" '+onclick+' >'+bs[i].name+'</a><span class="divider"> /</span></li>';
			}
		}

        $(".breadcrumb").html(html);
	}
	function fTable(result){
		var res = result.rows;
		var model = result.model;
		var schema = result.schema;
		var tab = result.tab;
		
		var add_btn = result.add_btn?'<div><a role="button" onclick="$(this).modelAdd()" data-toggle="modal" href="#model_detail" class="btn btn-info btn-mini">新建</a></div><hr>':'';
		
		var html = add_btn+'<table data-table="'+result.table+'" class="etable table_list table table-hover table-striped table-bordered table-condensed"><thead><tr><th style="width:13px">'
					+'<input type="checkbox" name="some_name" value="" onclick="$(this).toggleCheckbox()" /></th>';


		if(schema == false){
			for (i in res){
				for(k in res[i]){
					if(k !="ctl"){
						html += '<th>'+k+'</th>';
					}
				}
				break;
			}

			html += '<th style="text-align:center">操作</th></tr></thead><tbody>';
			for (i in res){
				html +='<tr data-id="'+res[i]['id']+'" data-model="'+model+'" ><td><input type="checkbox" name="checkbox_item" class="checkbox_item" value="'+res[i]['id']+'" onclick="" /></td>';
				
				for(k in res[i]){
					if(k !="ctl"){
						html += '<td>'+res[i][k]+'</td>';
					}
				}

				html += '<td>'
						+(res[i]['ctl']?res[i]['ctl']:'')
						+'<a class="btn btn-mini btn-info" href="#model_detail"  role="button" onclick="$(this).modelPrev()" class="btn" data-toggle="modal">阅</a> '
						+'</td></tr>';
			}

			html += '</tbody>';

			
			
		}else{

			for(j in schema){
				if(schema[j].list != 0){
					//html += '<th>'+schema[i].name+'</th>';
					if(schema[j].name !="ctl"){
						html += '<th>'+((schema[j].title == 'null' || !schema[j].title)?schema[j].name:schema[j].title)+'</th>';
					}						
				}
			}
		

			html += '<th style="text-align:center">操作</th></tr></thead><tbody>';
			for (i in res){
				html +='<tr class="epk" data-id="'+res[i]['id']+'" data-model="'+model+'" ><td><input type="checkbox" name="checkbox_item" class="checkbox_item" value="'+res[i]['id']+'" onclick="" /></td>';
				
				for(j in schema){
					//console.log(schema[j].list);
					if(schema[j].list != 0){
						//html += '<th>'+schema[i].name+'</th>';
						if(schema[j].name !="ctl"){
							//console.log(schema[j].listedit);
							if(schema[j].listedit != 0){
								html += '<td class="eitem"><span data-key="'+schema[j].name+'">'+res[i][schema[j].name]+'</span></td>';
							}else{
								html += '<td>'+res[i][schema[j].name]+'</td>';
							}							
						}						
					}
				}

				html += '<td>'
						+(res[i]['ctl']?res[i]['ctl']:'')
						+'<a class="btn btn-mini btn-info" href="#model_detail"  role="button" onclick="$(this).modelPrev()" class="btn" data-toggle="modal">阅</a> '
						+'</td></tr>';
			}
			html += '</tbody>';   
		}
		
		if(res.length == 0){

			html +='<tfoot><tr><td colspan="'+(schema.length+2)+'">没有找到记录</td></tr></tfoot>';
		}
		html +='</table><hr /><div><label class="checkbox inline"> <input type="checkbox" onclick="$(this).checkAll()" class="input-checkbox"> 全</label>'
			+'<label class="checkbox inline"><input type="checkbox" onclick="$(this).checkReverse()" class="input-checkbox"> 反</label>	  '
		    +'<button class="btn btn-danger btn-mini" onclick="$(this).deleteChecked()">删除</button></div>'; 

		if(tab){ 
			html = stringFormat(html_tab_record,{record:html})	
		}

		//console.log(result.table);

		$("#model_area").html(html);
		if($.cookie("recode_tab")){			
			$('#recode_tab a[href="#'+$.cookie("recode_tab")+'"]').click();
		}
}

	ptAdmin.getModel = getModel;
	ptAdmin.eoption = eoption;
	ptAdmin.coption = coption;
	
	$.ptAdmin = ptAdmin;
	
	
	//console.log(ptAdmin)

	var html_tab_record = '<ul id="recode_tab" class="nav nav-tabs">'
                         +' <li class="active"><a href="#con_record" data-toggle="tab" onclick="$.cookie(\'recode_tab\',\'con_record\');">记录</a></li>'
                          +'<li class=""><a href="#con_schema" data-toggle="tab" onclick="$.cookie(\'recode_tab\',\'con_schema\');$(this).schemaClick();">数据结构</a></li>  '                       
                        +'</ul><div id="" class="tab-content">'
                        +'  <div class="tab-pane fade active in" id="con_record">{record}</div>'
                        +'  <div class="tab-pane fade" id="con_schema"></div>'
                       +'</div>';
})(jQuery);
