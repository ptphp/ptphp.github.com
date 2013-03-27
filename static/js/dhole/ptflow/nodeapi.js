/* api option 
 ***************************************************************************************/
function NodeApi (project,setting) {
	//console.log(setting);
	this.setting = setting;
	var type = setting['id'];
	this.type = type;
	this.projectid = project.id;
	var url = "/project/node/?pro_id="+this.projectid+"&type="+type;
	this.url = url;
	this.node_type_url = "/project/node/nodetype?pro_id="+this.projectid;
	this.api = this;
	this.option = {
        type: "",
        url: url,
        data: {},
        success: function (data) {
            
        }
    }
}

NodeApi.prototype.updateNodeType = function (setting){
	var id = this.type
	setting['id'] = id;
	
	var option = {};
	option.url =this.node_type_url;
	option.type="put";
	option.data = setting;
	option.success = function(data){
		console.log(data);
	}
	$.ajax(option);
	//console.log(this.node_type_url);
	//console.log(setting);
}

NodeApi.prototype.getSetting = function (){	
	if(this.type == 1){
		newNodeWidth = 180;
		newNodeHeight = 40;
	}
	if(this.type == 2){
		newNodeWidth = 150;
		newNodeHeight = 20;
	}
	if(this.type == 3){
		newNodeWidth = 150;
		newNodeHeight = 20;
	}
	var setting = {
		type:this.type,
		id:"flow_panel",
		width:parseInt(this.setting.width),
		height:parseInt(this.setting.height),
		top:parseInt(this.setting.top),
		left:parseInt(this.setting.left),
		newNode:{
			width:newNodeWidth,
			height:newNodeHeight,
			id:'node_tmp',
			title:'新建节点',
		},
		rightKey:{
			id:"flow_dropdown",
		}
	};
	//console.log(setting);
	return setting;
}

var bodyClick = function (e){
	$obj = e.data.obj;
	xx = x + $obj.width();
	yy = y + $obj.height();	
	if(e.pageX > xx || e.pageX < (x) || e.pageY > yy || e.pageY < (y)){
		$obj.hide().remove();
	}
}

NodeApi.prototype.rightKey = function (id,x,y,node,flow){
	//log(id);
	var api = this.api;
	var setting = this.getSetting();
	var rkSetting = setting['rightKey'];
	var pro_id = this.projectid;
	$dropdown = $('#'+rkSetting.id);
	if($dropdown[0]){
		$dropdown.remove();	
	}				
	controller_name = node.setting.name;
	if(node.setting.rel){
		rel_name = flow.nodePools[node.setting.rel].setting.name;
		controller_name = rel_name+"/"+controller_name;
	}
	
	//生成节点左键 html
	$("body").append(parseRkHtml(rkSetting,flow,id,node,this.type,controller_name));	
	//check rel	
	if(node.setting.rel){
		$('#rk_node_select').val(node.setting.rel);
	}
	
	$('#rk_node_select').click(function(event){
		event.preventDefault;
	});
	
	$('#rk_node_select').change(function(){
		rel = this.value;		
		api.changeConnect(id,rel,flow);
		$(this).parent().parent().hide();
	});
	
	$('#rk_node_name').click(function(event){
		event.preventDefault;
	});
	
	$('#rk_node_name').change(function(){
		var value = this.value
		if(value != this.defaultValue){
			$('#node'+id).find('span.node_name').html(value);
			api.update(id,'name',value,flow);
		}		
	});	
	
	$('#rk_node_remove').click(function(){
		api.remove(id,flow,this);
	});
	
	$('#rk_node_eidtReq').click(function(){		
		//location.href= "index.php?control=project/model/detail&pro_id="+pro_id+"&id="+id;
	});
	
	$('#rk_node_eidtMode').click(function(){		
		location.href= "/project/model/detail?pro_id="+pro_id+"&id="+id;
	});
	$('#rk_node_genModelFile').click(function(){
		api.genModelFile(id);
	});
	
	$('#rk_node_newTableField').click(function(){
		api.changeTable(node.setting.name,id);
	});
	//$('#rk_node_genModelTableCache').click(function(){
		//api.genModelTableCache(id);
	///});
	$('#rk_node_genModelTable').click(function(){
		api.genModelTable(id);
	});
	
	$('#rk_node_eidtController').click(function(){		
		location.href= "/project/controller/detail?pro_id="+pro_id+"&id="+id;
	});
	
	$('#rk_node_genController').click(function(){
		api.genController(id);
	});
	//$('#rk_node_genView').click(function(){
		//api.genView(id);
	//});
	$('#rk_node_openView').click(function(){
		api.openView(id);
	});
	
	$dropdown = $('#'+rkSetting.id);
	$dropdown.show().css({'z-index':'30000','top':y,'left':(x)});
	
	$("body").bind('click',{obj:$dropdown},bodyClick);
}

NodeApi.prototype.all = function(flow){	
	api = this.api;
	$.get(this.url,{},function(data){
		var model = data.rows;
		for (i in model){
			if(model[i].id){
				var setting = model[i];
				new Node(setting,flow,api);
			}			
		}
		for (ii in flow.nodePools){
			nn = flow.nodePools[ii];
			//console.log(nn.setting);
			toNodeId = nn.setting.rel;
			if (toNodeId == 0)
				continue;
			if(toNodeId in flow.nodePools){
				toNode = flow.nodePools[toNodeId];
				nn.connect(flow,toNode);
			}else{
				flow.nodePools[ii].setting.rel = 0;
				var row = {};
				row.rel = 0
				api.update(ii,row);
			}
			
		}		
	},'json');
}

// 新加
NodeApi.prototype.add = function(left,top,width,height,flow){
	var id;
	var api = this.api;
	var type = parseInt(this.type);
	var setting = {};
	if(type == 1){
		setting['name']      = "";
		setting['title']      = "模型名";
	}else if(type == 2){
		setting['name']      = "test";
		setting['title']      = "";
	}else{
		setting['name']      = "";
		setting['title']      = "名称";
	}
	
	setting['order']      = "";
	setting['left']       = left;
	setting['top']        = top;
	setting['width']      = width;
	setting['height']     = height;
	setting['rel']        = 0;	
	setting['type']        = type;	
	
	option = this.option;
	option.type = 'post';
	option.data = setting;
	option.dataType = 'json';
	option.success = function(data){
		if(data.error){
			logError(data);			
		}else{			
			setting.id = data.id;
			console.log(data,setting);
			if(setting.id){
				node = new Node(setting,flow,api);	
			}
		}
	};
	$.ajax(option);	
}

NodeApi.prototype.changeConnect = function(id,rel,flow){	
	from  = flow.nodePools[id];
		
	orgto = flow.nodePools[from.setting.rel]
	//console.log(from,to);
	if(orgto){
		from.disconnect(orgto);					
	}
		
	if(rel != 0){
		to    = flow.nodePools[rel];
		if(!to)
			return;	
		from.connect(flow,to);
		from.setting.rel = rel;
	}	
	var row = {};
	row.rel = rel;
	this.api.update(id,row);	
}


//修改
NodeApi.prototype.save = function(setting){
	//console.log(setting);	
	id = setting.id;
	this.update(id,setting);
}

//测试用
function updateNode(id,setting){
	var $obj = $("#node"+id);
	for(i in setting){
		name = i;
		value = setting[i];
		//console.log('id:',id,name,value)
		$obj.find('.'+name).text(value);
	}
}

NodeApi.prototype.update = function(id,row){
	if(!id){
		return ;
	}
	option = this.option;
	option.type = "post";
	
	//测试用
	//updateNode(id,row);
	
	option.data = row;
	//console.log(option.url,option.data);
	option.url = this.option.url+"&method=put&id="+id;
	option.success = function(data){
		//console.log(data);
	};
	//console.log(option.url,option.data);
	$.ajax(option);
}

//删除
NodeApi.prototype.remove = function(id,flow,obj){	
	ok = confirm('a u sure?');
	if(!ok){
		return;
	}
	if(obj){
		$(obj).parent().parent().hide();	
	}	
	flow.nodePools[id].remove();	
	
	option = this.option;
	option.type = "delete";
	option.url = this.option.url+"&id="+id;
	option.success = function(data){
		console.log(data);
	};
	$.ajax(option);
}

//生成Model File
NodeApi.prototype.genModelFile = function(id){
	genModelFile(id,pro_id);
	
}

//生成Model Table cache
NodeApi.prototype.genModelTableCache = function(id){
	url = "/scaffold/model/tablecache?pro_id="+this.projectid+"&id="+id;	
	$.get(url,'',function(data){
		log(data);
	});
}

NodeApi.prototype.modelTableHandle = function (id){
	var api = this.api;
	url = '/project/model/schema?model_id='+id+"&pro_id="+this.projectid;
	//console.log(url);
	$.get(url,'',function(data){
		//console.log(data);
		var rows = data['rows'];
		//console.log(rows);
		for(i in rows){
			var tableFieldList = parseTableFieldList(i,rows[i],api.projectid);
			//console.log('#node'+id);
			$('#node'+id).find('.node_items').append(tableFieldList);
			
		}
		var addheight = parseInt($('#node'+id).find('.node_items').height());
		var height = parseInt($('#node'+id).height());
		//console.log(addheight,height);
		if((height - 20 ) <= addheight){
			//console.log("---------------");	
			$('#node'+id).height(addheight+28);	
			var row = {};
			row['height'] = addheight+28;
			api.update(id, row);			
		}
		
	},'json');
	
}
//生成Model Table cache
NodeApi.prototype.genModelTable = function(id){
	genModelTable(id,pro_id);	
}

//生成 Controller
NodeApi.prototype.genController = function(id){
	genController(id,this.projectid);
	
}
//生成 View
NodeApi.prototype.genView = function(id){
	genView(id,this.projectid);
}

//打开Controller
NodeApi.prototype.openView = function(id){
	$.get('/scaffold/geturl?pro_id='+this.projectid+'&id='+id,function(data){
  		console.log(data);
  		openUrl(data);
    });	
}

//添加修改Schema
NodeApi.prototype.addSchema = function(title,model_id,key){
	url = "/project/model/schema?pro_id="+this.projectid+"&&model_id="+model_id;	
	if(title == ''){
		alert('title 不能为空！');
		return false;
	}
	var row = {};
	row['title'] = title;
	row['key'] = key;
	row['model_id'] = model_id;
	console.log(row);
	$.post(url,row,function(data){
		console.log(data);		
	},'json');
}
NodeApi.prototype.removeSchema = function(model_id,key) {	
	url = "/project/model/schema?pro_id="+this.projectid+"&model_id="+model_id+"&key="+key;
	//console.log(url,key);
	option = {};
	option.type = "delete";
	option.url = url;	
	option.success = function(data){
		console.log(data);
		location.reload();
	};
	console.log(url,option);
	$.ajax(option);
}

function parseTableFieldList(key,row,pro_id){
	//console.log(key);
	if(!row['title']){
		row['title'] = '';
	}
	var name = '';
	if(row['name']){
		name =  '[ '+row['name']+' ]';
	}
	
	html = ''
	     + '<div class="tableFieldItem" data-id="'+key+'" data-title="'+row['title']+'" title="'+row['desc']+'" data-name="'+row['name']+'">'
	     +'		<b>'+row['title']
	     +'</b>		'+name
	     //+'		['+row['length']+']'
	     //+'		<span onclick="removeField(this,'+row['id']+','+pro_id+')">d</span>'
	     +'</div>'
	     + '';
	return html;
}
/**
 * 根据 id 生成DIV 
 * @param   {String} id
 * @return {String} 
 */
function divWithId(id){
	return '<div id="'+id+'"></div>';
}

/**
 * 根据type 生成 节点右键 HTML 内容
 * type 0:model 
 * type 1:controller 
 * 
 * @param {Object} flow
 * @param {int} id
 * @param {Object} currentNode
 * @param {int} type  
 * @return {string}
 */
function parseRkHtml(rkSetting,flow,id,node,type,controller_name){	
	optionHtml = "<option value=\"0\">根</option>";
	//console.log(flow.nodePools);
	for(key in flow.nodePools){
		node = flow.nodePools[key];
		if(id != key){
			var option_v = node.setting.title;
			if(node.setting.type == 2){
				option_v = node.setting.name;
			}			
			optionHtml += "<option value=\""+node.setting.id+"\">"+option_v+"</option>";
		}
	}
	var name = currentNode.setting.name;	
	$div = $(divWithId(rkSetting.id));	
	var divider = '<li class="divider"></li>';
		
	if(type == 1){
		itemHtml = parseRkModelHtml();
		//itemHtml += divider;
	}else if(type == 2){
		//itemHtml = '<li><input  id="rk_node_controller_name" disabled class="span2" type="text" value="'+ controller_name +'"></li>';
		itemHtml = '';
		itemHtml += parseRkControllerHtml();	
		//itemHtml += divider;	
	}else if(type == 3){
		//itemHtml = '<li><input  id="rk_node_controller_name" disabled class="span2" type="text" value="'+ controller_name +'"></li>';
		itemHtml = '';
		itemHtml += parseRkReqrHtml();	
		//itemHtml += divider;	
	}else{
		itemHtme = '<li><a tabindex="-1" id="" href="javascript:;"></a></li>';
	}
	
	$div.addClass('dropdown-menu')
		.addClass('right-key')
		.append('<li>关联:<select id="rk_node_select" class="span2">'+optionHtml+'</select></li>')
		//.append(divider)
		//.append('<li>名称:<input  id="rk_node_name" class="span2" type="text" value="'+ name +'"></li>')
		//.append(divider)
		.append(itemHtml)
		.append('<li><a tabindex="-1" id="rk_node_remove" href="javascript:;">删除</a></li>')
		.append();
	
	return $div[0];
}
function parseRkReqrHtml(){
	html = ''	 
		+ '<li><a tabindex="-1" id="rk_node_eidtReq" href="javascript:;">需求管理</a></li>'    
	     + '';
	return html;
}
function parseRkModelHtml(){
	html = ''	 
		+ '<li><a tabindex="-1" id="rk_node_eidtMode" href="javascript:;">修改</a></li>'    
	     //+ '<li><a tabindex="-1" id="rk_node_genModelFile" href="#">生成 Model 文件</a></li>'
	     //+ '<li><a tabindex="-1" id="rk_node_newTableField" href="#">新增字段</a></li>'
	     //+ '<li><a tabindex="-1" id="rk_node_genModelTableCache" href="#">生成 Table Cache </a></li>'
	     //+ '<li><a tabindex="-1" id="rk_node_genModelTable" href="#">生成 Table </a></li>'
	     + '';
	return html;
}

function parseRkControllerHtml(){
	html = ''
	     //+ '<li><a tabindex="-1" id="rk_node_genController" href="#">生成 Controller</a></li>'
	     //+ '<li><a tabindex="-1" id="rk_node_genView" href="#">生成 View</a></li>'
	     + '<li><a tabindex="-1" id="rk_node_eidtController" href="javascript:;">修改</a></li>'
	     //+ '<li><a tabindex="-1" id="rk_node_openView" href="#">浏览</a></li>'
	     + '';
	return html;	
}

function parseNodeHtml(setting){
	//log(setting);	
	var node_border_bottom = '';
	if(setting.type == "2"){		
		var title = setting.name;
	}else{
		var title = setting.title;		
	}
	
	if(setting.type == "1"){
		node_border_bottom = " node_border_bottom";	
	}
	
	var res = '<div class="node_name'+node_border_bottom+'" data-id="'+setting.id+'" data-name="'+setting.name+'" data-title="'+setting.title+'" title="'+setting.name+'">'+title+'</div>';
	var res_ = '';
	res_ += '<p><b>width</b>:<span class="width">'+setting.width+'</span>  <b>height</b>:<span class="height">'+setting.height+'</span></p>';
	res_ += '<p><b>left</b>:<span class="left">'+setting.left+'</span>  <b>top</b>:<span class="top">'+setting.top+'</span></p>';	
	res_ += '<p><b>rel</b>:<span class="rel">'+setting.rel+'</span></p>';
	
	//res += res_;
	
	if(setting.type == "1"){
		res += ''		 
		 + '<div class="node_items">'
		 + '</div>';	
	}
		
	return res;
}


