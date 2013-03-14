;(function($){
	$.fn.extend({			
		yz:function(rules,callback,id){
			//console.log(rules);
			this.rules(rules,id);
			this.submit(function(){
				console.log(this);
				
				$('input:text',this).each(function(){
					//console.log(this);
					$(this).triggerHandler('blur');
				});

				if($('span.error',this).length > 0){
					return false;
				}
				var url = this.action;
				var data = $(this).serialize();
				console.log(url,data);
				$.post(url,data,callback,"json");				
				return false;
			});				
			return this;
		},
		rules:function(rules,$id){
			//console.log(rules);			
			for(key in rules){		
				//console.log(key,rules[key],$("#"+key));
				$("#"+key).blur(function(){
					var key = this.id;
					var rule = rules[key];
					
					if(rule['max']){
						length = parseInt(rule['max']);
						value_lenght = parseInt(this.value.length);						
						if(value_lenght > length){			
							$(this).parent().next().find('span').html(rule['title']+"字符长度不能超过"+length+"个字符").removeClass('success').addClass('error')
						    $(this).focus();
							return;
						}
					}
						
					if(rule['min']){
						value_lenght1 = parseInt(this.value.length);							
						if(value_lenght1 < parseInt(rule['min'])){
							$(this).parent().next().find('span').html(rule['title']+"字符长度不少于"+rule['min']+"个字符").removeClass('success').addClass('error');
							$(this).focus();
							return;
						}
					}
					
					if(rule['regx']){	
						var reg= new RegExp(rule['regx']['regx']);		
				        if(!reg.test(this.value)){
				        	$(this).parent().next().find('span').html("输入的"+rule['regx']['title']+"不合法").removeClass('success').addClass('error');
				        	return ;
					    } 
					}
					
					if(rule['unique']){	
						$(this).parent().next().find('span').html('&nbsp;').addClass('yz_loading');							
						var url = $(this).parents('form').attr('action');
						var row = {};
						var vv = this.value;
						var name = $(this).attr("name");
						var $obj = $(this); 
						row[name] = vv;
						//console.log(row,url);
						if($id){
							param = {method:"exists",id:$id};
						}else{
							param = {method:"exists"};
						}
						
						//console.log(param)
						$.post(parseRequestUrl(url,param),row,function(data){
							//console.log(data,$obj);
							if(parseInt(data) == 0){
								$obj.parent().next().find('span').html('&nbsp;').removeClass('yz_loading').removeClass('error').addClass('success');
							}else{
								$obj.parent().next().find('span').html('已存在').removeClass('yz_loading').removeClass('success').addClass('error');
							}
						},"json")
					}else{
						$(this).parent().next().find('span').html('&nbsp;').removeClass('error').addClass('success');
					}
								
								
				}).keyup(function(){
					//$(this).triggerHandler('blur');
				});
			}
		},
	});
})(jQuery);
;(function($){
	$.fn.extend({
		'tab_table':function(){
			$('li',this).click(function(){
				var index = $(this).index();
				$(this).addClass('on').siblings().removeClass("on");
				$(this).parent().siblings(".tab_pannel").addClass('hidden').eq(index).removeClass('hidden');
			});
		}
	});
})(jQuery);
//拖动
(function($){
	$.fn.extend({
		"ptdrag1": function (option) {			
			var setting = jQuery.extend( {
				sub : "",
				index : 100000
			}, option);	
			var $mobj;
			var $obj = $(this);
			if(setting.sub){
				$mobj = $(setting.sub,this);
			}else{
				$mobj = $obj;
			}	
			
			
			function endFun(){
				$(this).unbind("mousemove",moveFun);
			}
			function moveFun(e){				
				var _x = e.data.x;
				var _y = e.data.y;
				//console.log($obj.offset().left,$obj.offset().top)
				y = $obj.offset().top + (e.pageY-_y);
				x = $obj.offset().left + (e.pageX-_x);
				//console.log(x,y,$obj[0]);
				$obj.css({top:y+"px",left:x+"px"});
			}
			function startFun(e){	
				var x = e.pageX;
				var y = e.pageY;
				$(this).bind("mousemove",{x:x,y:y},moveFun);
				
			}
			$mobj.bind("mousedown",startFun);
			$mobj.bind("mouseup",endFun);
			$mobj.bind("mouseover",endFun);
			
		},
		"ptdrag": function (option) {
			
			var setting = jQuery.extend( {
				sub : "",
				index : 100000
			}, option);	
			var $mobj;
			var $obj = $(this);
			if(setting.sub){
				$mobj = $(setting.sub,this);
			}else{
				$mobj = $obj;
			}
			
			//console.log(this);
			var dY, dX;
			var t, r, l, b;
			
			var StartEvent = "mousedown";
			var MoveEvent =  "mousemove";
			var EndEvent =  "mouseup";
			
			var MoveEventFn = function (e) {	
				var mY, mX;
				mY = e.pageY - dY;
				mX = e.pageX - dX;
				mY < t ? mY = t : null;
				mX < l ? mX = l : null;
				mY > b ? mY = b : null;
				mX > r ? mX = r : null;
				$obj.css({
					top: mY + 'px',
					left: mX + 'px',
				});			
			}

			var EndEventFn = function () {
				$obj.css( 'cursor', 'auto' );
				$(document).unbind('mouseup', EndEventFn);
				$(document).unbind('mousemove', MoveEventFn);
			}
			
			var StartEventFn = function (e) {		
				
				dY = e.pageY - $mobj.offset().top;
				dX = e.pageX - $mobj.offset().left;				

				$(document).bind(MoveEvent, MoveEventFn);
				$(document).bind(EndEvent, EndEventFn);
			}
			$mobj.bind(StartEvent, StartEventFn);
		}
	
	})
})(jQuery);

(function($){
	$.fn.extend({
		"pttab": function (option) {	
			var setting = $.extend( {
				onClass : "on",
				change:"",
			}, option);	
			var $tab = this;
			$tab.children().css("cursor","pointer")
			var $tab_area = $tab.next();
			$tab.children().click(function(){
				var index = $(this).index();
				//console.log(index);
				$(this).addClass(setting.onClass).siblings().removeClass(setting.onClass);
				var $pannel = $(this).parent().next().children().eq(index);
				$pannel.show().siblings().hide()
				if(setting.change){
					setting.change($pannel);
				}

			});
			//console.log($tab,$tab_area);
		}
	})
})(jQuery);

(function($){
	$.fn.extend({
		"tabbable": function (option) {	
			var setting = $.extend( {
				onClass : "active",
				change:"",
			}, option);	
			var $tab = $(this).find("ul");
			$tab.children().css("cursor","pointer")
			var $tab_area = $(this).find("div.tab-content");
			$tab.children().click(function(){
				var index = $(this).index();
				//console.log(index);
				$(this).addClass(setting.onClass).siblings().removeClass(setting.onClass);
				var $pannel = $(this).parents("ul").next().children().eq(index);
				$pannel.show().siblings().hide()
				if(setting.change){
					setting.change($pannel);
				}

			});
			//console.log($tab,$tab_area);
		}
	})
})(jQuery);

(function($){
	$.fn.center = function (par) {		
	    this.css("position","absolute");  
	    if(!par){
	    	par = $(window);
		}  
	    this.css("left", ( par.width() - this.width() ) / 2+ par.scrollLeft() + "px");   
	    this.css("top", ( par.height() - this.height() ) / 2+ par.scrollTop() + "px");     
	    
	    return this;   
	}
	$.fn.scenter = function (par) {   
		 if(!par){
	    	par = $(window);
		}  
	    this.css("left", ( par.width() - this.width() ) / 2+ par.scrollLeft() + "px");   
	    return this;   
	}
	$.fn.ccenter = function (par) {   
		 if(!par){
	    	par = $(window);
		}  
	    this.css("top", ( par.height() - this.height() ) / 2+ par.scrollTop() + "px");       
	    return this;   
	}
})(jQuery);

(function($){
	$.extend({
		"replaceAll":function(search, replace,object){
			var regex = new RegExp(search, "g");  
			return object.replace(regex, replace);
		},
		"max":function(object){
			return Math.max.apply({},object) 
		}
	});

})(jQuery);



