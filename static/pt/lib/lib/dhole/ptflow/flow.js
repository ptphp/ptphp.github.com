var clickFun = function (event){	
    var api = event.data.api;
    var flow = event.data.flow;
    
	name = $(this).data('name');
	if($(this).data('title')){
		title = $(this).data('title');
	}else{
		title = '';
	}	
	
	console.log($(this).data('name'));		
	var id = parseInt($(this).data('id'));
	//console.log(api);
	
	var type = parseInt(api.type);
	
	if(type == 2){
		html = '<input type="text" value="'+name+'">';
	}else{
		html = '<input type="text" value="'+title+'">';
	}
	//console.log(html);		
	$(this).html(html);
	
	$(this).find('input')
			.css({padding:"0 6px",width:"80%",'background-color':'transparent',margin:0,"text-align":"center"})
			.blur(function(){			
					var tmp = $(this).val().trim();
					//console.log(tmp);	
					//console.log(type);
					var row = {};
					if(type == 2){
						if(tmp != name){
							if(! /^[a-zA-Z0-9]+$/.test(tmp)){							           
				        		console.log('只能为英文和数字');
				        		alert('只能为英文和数字');
				        		$(this).focus();
				        		return;
				        	}
							//for (i in flow.nodePools){
								//if(parseInt(flow.nodePools[i].setting.id) == id)
									//continue;
								//console.log(tmp,flow.nodePools[i].setting.name);
								//if(tmp == flow.nodePools[i].setting.name){
									//console.log(tmp+'已存在，请重新修改');
									//alert(tmp+'已存在，请重新修改');
									//$(this).focus();
									//return ;
								//}
							//}								
							row.name = tmp;
							flow.nodePools[id].setting.name = tmp;	
							api.update(id,row);
							$(this).parent().data('name',tmp);								
						}
					}else{							
						if(tmp != title){
							//if(! /^[\u4e00-\u9fa50-9]+$/.test(tmp)){					           
				        		//console.log('只能为汉字和数字');
				        		//alert('只能为汉字和数字');
				        		//$(this).focus();
				        		//return;
				        	//}
															
							row.title = tmp;
							flow.nodePools[id].setting.title = tmp;	
							api.update(id,row);
							$(this).parent().data('title',tmp);
						}
					}
					$(this).parent().html(tmp).bind('dblclick',{api:api,flow:flow},clickFun);						
		});			
	$(this).unbind('dblclick');		
}



function Flow(api){
	var setting = api.getSetting();
	this.setting = setting;
	this.domid = setting.id;
	this.obj = $("#"+this.domid);
	
	var top = setting.top;
	var width = setting.width;
	var height = setting.height;
	var newNodeId = setting.newNode.id;
	var newNodeTitle = setting.newNode.title;
	
	css = {'min-height':"500px",position:'relative','-webkit-border-radius':'10px',border:"1px solid #E1E1E8",top:top};
	this.obj.css(css)
			.height(height)
			.width(width)
			//.draggable({
				//delay:100,
				//stop:function(event,ui){
					//console.log($(this).position().top);
					//console.log($(this).position().left);
					//api.updateNodeType({top:$(this).position().top,left:$(this).position().left});
				//}
			//})
			.resizable({
				stop:function(){
					var width = $(this).width();
					var height = $(this).height();
					api.updateNodeType({width:width,height:height});
				}
			})
			.append(divWithId('node_pools'))
		    .append(divWithId('conn_pools')).parent().prepend(divWithId(newNodeId));	

	
	this.nodePools = {};
	this.nodePoolsDom = $("#node_pools");

	this.connPools = {};
	this.connPoolsDom = $("#conn_pools");
	var flow = this;

	//新建节点
	$( "#"+ newNodeId).addClass(newNodeId).html(newNodeTitle).draggable({ 
		cursor: "move",
		containment:"parent",
		helper:"clone",
		stop: function(e, ui) {	    	
			if(setting.newNode){
				width  = setting.newNode.width;
				height = setting.newNode.height;
			}else{
				width = 100;
				height = 20;
			}
		    var left = ui.position.left - flow.obj.position().left;
		    var top  = ui.position.top - flow.obj.position().top; 
		    if(top >= 0 && left < flow.obj.width()){
		    	api.add(left,top,width,height,flow);
		 	}
		 }
	});

	//右键控制
	$(".node").live("contextmenu",function(event){
		x = event.pageX;
		y = event.pageY;		
		//current nodeid
		nodeid = $(this).attr('id');
		//current id
		id = nodeid.replace('node','');		
		//curent Node
		currentNode = flow.nodePools[id];		
		//右键显示
		api.rightKey(id,x,y,currentNode,flow);		
		event.preventDefault();
		return false;	
	});
	
	//console.log(setting);
	if(parseInt(setting.type) ==1){
		$('.node_name ').live('hover',function(){
			$id = $(this).parent().attr('id').replace('node','');
			
			if($('#add_icon')[0]){
				$('#add_icon').remove();
			}else{
				var add_icon = '<div id="add_icon" data-id='+$id+' title="添加列"></div>';				
				 $(this).append(add_icon);
			}
			
			//console.log($id);
		});
		$('#add_icon').live('click',function(){
			var $id = $(this).attr('data-id');
			var lastIndex = $("#node"+$id).find('.node_items').find('.tableFieldItem:last').attr('data-id');
			if(!lastIndex){
				lastIndex = 0;
			}
			
			lastIndex = parseInt(lastIndex) + 1;
			console.log(lastIndex);
			$tableFieldItem = '<div class="tableFieldItem" data-id="'+lastIndex+'" data-title="" data-name="" ><input value="" type="text"></div>';
			height = $("#node"+$id).height();
			
			$("#node"+$id).find('.node_items').append($tableFieldItem);		
			$("#node"+$id).height(height+26);			
		});
		
		$('.tableFieldItem input').live('blur',function(){
			var title = this.value;			
			//if(!checkChinese(title)){
				//alert('必须为汉字和数字');
				//return;
			//}			
			var key = $(this).parent().data('id');
			//$(this).parent()
			var originV = $(this).parent().data('title');
			
			var name = $(this).parent().data('name');
					
			$(this).parent().attr('data-title',title);
			if(name){
				name = '[ '+name+' ]';
			}
			var model_id = $(this).parent().parent().prev().data('id');
			$(this).parent().html('<b>'+title+'</b> '+name);
			
			if(title != originV){
				//console.log(title,model_id,modelname,key);
				api.addSchema(title,model_id,key);
			}
		});
		
		$('.tableFieldItem').live('dblclick',function(){
			if($(this).find('input')[0]){
				return;
			}
			var title = $(this).attr('data-title');
			$tableFieldItem = '<input type="text" value ="'+title+'">';
			$(this).html($tableFieldItem);
			//console.log(1);
		});
		
		$('.tableFieldItem').live('hover',function(){
			$modeObj = $(this).parent().prev();
			//console.log($modeObj.attr('data-id'));
			
			var modelid = $modeObj.attr('data-id');
			var modelname = $modeObj.attr('data-name');
			var id = $(this).attr('data-id');
			//console.log(modelid,modelname,id);			
			if($('#field_remove_icon')[0]){
				$('#field_remove_icon').remove();
			}else{
				var add_icon = '<div id="field_remove_icon" data-id="'+id+'" data-modelname="'+modelname+'" data-modelid="'+modelid+'" title="删除列"></div>';				
				 $(this).append(add_icon);
			}			
		});
		
		$("#field_remove_icon").live('click',function(){
			if(confirm("真的要删除么？")){				
				var key = $(this).attr('data-id');
				var model_id = $(this).attr('data-modelid');				
				//console.log(model_id,modelname,key);
				//console.log($(this).parent());
				//$(this).parent().remove();	
				api.removeSchema(model_id,key);							
			}
		});
		
		
	}
};

	
function Node(setting,flow,api){
	setting['id'] = parseInt(setting['id']);
	setting['left'] = parseInt(setting['left']);
	setting['top'] = parseInt(setting['top']);
	setting['width'] = parseInt(setting['width']);
	setting['height'] = parseInt(setting['height']);
	setting['rel'] = parseInt(setting['rel']);
	setting['name'] = setting['name'];
	setting['title'] = setting['title'];
	setting['order'] = setting['order'];
	setting['type'] = setting['type'];
	//console.log(setting);
	this.setting = setting;
	this.domid = "node"+setting.id;

	flow.nodePools[setting.id] = this;
	flow.nodePoolsDom.append(divWithId(this.domid));
	
	this.flow = flow;
	this.api = api;
	this.obj = $("#"+this.domid);
	//console.log(setting);
	nodeHtml = parseNodeHtml(setting);

	this.obj.addClass('node').html(nodeHtml)
			.css({position:'absolute',top:setting.top,left:setting.left,width:setting.width,height:setting.height})
			.draggable({
				delay:100,
				containment: "#"+flow.domid,
				scroll: false ,
				start:function(){
					$(this).css('cursor','move');
				},
				drag:function(event,ui){
					$(this).css('cursor','pointer');
					tmpNode = flow.nodePools[setting.id];
					tmpNode.setting.left  = ui.position.left;
					tmpNode.setting.top   = ui.position.top;
					
					for ( ii in flow.connPools){
						cc = flow.connPools[ii];
						if(cc)
							cc.repaint();
					}
				},
				stop:function(event,ui){
					tmpNode = flow.nodePools[setting.id];
						
					if(tmpNode.api){
						var row = {};
						row.left = tmpNode.setting.left;
						row.top  = tmpNode.setting.top;		
						//row.left = ui.position.left;
						//row.top  = ui.position.top;					
						tmpNode.api.update(tmpNode.setting.id,row);
					}
				}
			})
			.resizable({
				//containment: "#"+flow.domid				
				stop:function(){
					tmpNode = flow.nodePools[setting.id];
					tmpNode.setting.width  = tmpNode.obj.width();
					tmpNode.setting.height = tmpNode.obj.height();					
					//api save
					if(tmpNode.api){
						var row     = {};
						row.width   = tmpNode.setting.width;
						row.height  = tmpNode.setting.height;						
						tmpNode.api.update(tmpNode.setting.id,row);
					}
						
						
					for ( ii in flow.connPools){
						cc = flow.connPools[ii];
						if(cc)
							cc.repaint();
					}
				}
			});
	$('.node_name').bind('dblclick',{api:api,flow:flow},clickFun);
	
	//处理Model table
	if(api.type == 1){
		api.modelTableHandle(setting.id);		
	}
	return this;
};

Node.prototype.connect = function(flow,toNode, label) {
	if(!toNode)
		return;
	var connId = "conn_"+this.setting.id+"_to_"+toNode.setting.id;
	
	if( flow.connPools[connId] ) {
		throw new Error("节点 "+this.setting.id+" 到 "+toNode.setting.id+" 的连接已存在!");
	} else if(toNode == this) {
		throw new Error("节点不能连接自己");
	}
	label = ! label ? "" :label;

	var conn = new Connector(flow,connId,this,toNode,label);

	flow.connPools[connId] = conn;
	return this;
};

Node.prototype.disconnect = function(toNode) {
	var connId = "conn_"+this.setting.id+"_to_"+toNode.setting.id;
	if( !this.flow.connPools[connId] ) {
		throw new Error("节点 "+this.id+" 到 "+toNode.id+" 的连接不存在!");
	}//if
	this.flow.connPools[connId].clear();
	delete this.flow.connPools[connId];
	delete toNode.flow.connPools[connId];
	return this;
};

Node.prototype.remove = function() {
	for( var conn in this.flow.connPools ) {
		var connector = this.flow.connPools[conn];
		var from = connector.from;
		var to = connector.to;
		if( from == this ) {
			this.disconnect( to );
		} else if( to == this ) {
			from.disconnect(this);
		}
	}
	
	this.obj.remove();
	// api delete
	//if(flow.nodePools[this.setting.id].api)
		//flow.nodePools[this.setting.id].api.remove(this.setting.id);
}



/**
 * 根据矩形任意对角的两点得到矩形的x,y,h,w参数
 * @param {Object} xa
 * @param {Object} ya
 * @param {Object} xb
 * @param {Object} yb
 */
function getRectFromDiagonal(la,ta,lb,tb) {
	return {
		la:la,
		ta:ta,
		lb:lb,
		tb:tb,
		l:Math.min(la,lb),
		t:Math.min(ta,tb),
		w:Math.abs(la-lb),
		h:Math.abs(ta-tb)
	};
}
/**
 * 连接者
 * 连接两个node
 * @param {Object} from
 * @param {Object} to
 * @param {Object} label
 */

function Connector(flow,id,from,to,label) {
	this.id = id;
	this.from = from;
	this.to   = to;
	this.connAID = "conn_"+from.setting.id+"_to_"+to.setting.id+"_a";
	this.connBID = "conn_"+from.setting.id+"_to_"+to.setting.id+"_b";
	this.connCID = "conn_"+from.setting.id+"_to_"+to.setting.id+"_c";
	this.connDID = "conn_"+from.setting.id+"_to_"+to.setting.id+"_d";

	flow.connPoolsDom.append(divWithId(this.id));
	$obj = $("#"+this.id);

	$obj.addClass("conn_wapper").css({"position":"absolute"})
		.append(divWithId(this.connAID))
		.append(divWithId(this.connBID))
		.append(divWithId(this.connCID))
		.append(divWithId(this.connDID));

	$obj.find("div[id^=conn]").addClass('connector');
	this.repaint();
}

//Connector的方法
Connector.prototype.repaint = function() {
	var l1 = this.from.setting.left;		var l2 = this.to.setting.left;
	var t1 = this.from.setting.top;		    var t2 = this.to.setting.top;
	var w1 = this.from.setting.width;	    var w2 = this.to.setting.width;
	var h1 = this.from.setting.height;	    var h2 = this.to.setting.height;
	
	var rect = getRectFromDiagonal( (l1+w1/2), (t1+h1/2), (l2+w2/2), (t2+h2/2) );
	
	var tmph = rect.h/2;//优化效率用的临时变量
	var rectA = {x:rect.l,y:rect.t,h:tmph,w:rect.w};
	var rectB = {x:rect.l,y:rect.t+tmph,h:tmph,w:rect.w};
	$("#"+this.id).css({"left":rect.l,"top":rect.t,"width":rect.w,"height":rect.h});	
	
	//console.log("**********************");
	//console.log("left a:",rect.la," left b:",rect.lb);
	//console.log("top a:",rect.ta,"top b",rect.tb);
	//console.log("width:",rect.w,"height",rect.h);
	
	//$("#"+this.id).find("div").height(rect.h/2 -6);
	//$("#"+this.id).find("div").width(rect.w/2 -6);
	
	$("#"+this.connAID).css({"top":0,"left":0});
	$("#"+this.connBID).css({"top":0,"left":rect.w/2});
	$("#"+this.connCID).css({"top":rect.h/2,"left":0});
	$("#"+this.connDID).css({"top":rect.h/2,"left":rect.w/2});
	
	if( (rect.la < rect.lb &&rect.ta < rect.tb) || rect.la > rect.lb && rect.ta > rect.tb ) {
		$("#"+this.connAID).css("border-width","1px 0px 0px 0px");
		$("#"+this.connBID).css("border-width","0px 0px 0px 1px");
		$("#"+this.connCID).css("border-width","0px 1px 0px 0px");
		$("#"+this.connDID).css("border-width","0px 0px 1px 0px");
	} else {
		$("#"+this.connAID).css("border-width","0px 1px 0px 0px");
		$("#"+this.connBID).css("border-width","1px 0px 0px 0px");
		$("#"+this.connCID).css("border-width","0px 0px 1px 0px");
		$("#"+this.connDID).css("border-width","0px 0px 0px 1px");
		//$("#"+this.connAID).css({"width":rectA.w,"height":rectA.h,"border-width":"0px 1px 1px 0px"});
		//$("#"+this.connBID).css({"width":rectB.w,"height":rectB.h,"border-width":"0px 0px 0px 1px"});
	}

}

Connector.prototype.clear = function() {
	//$("#"+this.connAID).remove();
	//$("#"+this.connBID).remove();
	//$("#"+this.connCID).remove();
	//$("#"+this.connDID).remove();
	$("#"+this.id).remove();
}

