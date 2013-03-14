(function($){	
	$.fn.ptcenter = function (num,step) {   
		var height = this.height();
		var width = this.width();
		
		var left = ( $(window).width() - width ) / 2+$(window).scrollLeft();
		var top = ( $(window).height() - height ) / 2+$(window).scrollTop();
		if(num && step){		
			var t = num*step
			left += t;
			top  += t;
		}
		//console.log(num,step,width,height);
	    this.css("position","absolute");   
	    this.css("top", top + "px");   
	    this.css("left", left + "px");   
	    return this;   
	}
	$.fn.extend({
		'ptlayer':function(option){			
			var setting = jQuery.extend( {
				width:500,
				height:300,
				top:"",
				left:"",
				lock:false,
				drag:true,
				win:false,
				ajax:false,
				scroll:true,
				iframe:false,
				html:""
			}, option);	
			
			if($(this).data('title')){
				setting.title = $(this).data('title');
			}
			if($(this).data('width')){
				setting.width = $(this).data('width');
			}
			if($(this).data('height')){
				setting.height = $(this).data('height');
			}
			
			var id = "ply_"+$(this).attr("id");
			$lobj = $("#"+id);
			if($lobj[0]){
				$lobj.toggleV();
				return;
			}
			
			if(setting.win){
				var sizeCtl ='<a href="javascript:;" onfocus="this.blur()" title="最大化" class="ptl_max ptl_s_b"></a>'
							+'<a href="javascript:;" onfocus="this.blur()" title="还原" class="ptl_res ptl_s_b"></a>'
							+'<a href="javascript:;" onfocus="this.blur()" title="最小化" class="ptl_min ptl_s_b"></a>';			
			}else{
				var sizeCtl ='';
			}
			var ui = "<div class='ptlayer' style='' id='"+id+"'><div class='ptl_box'>"
						+'<div class="ptl_head">'
						+'	<div class="ptl_cm"></div>'
						+'	<div class="ptl_ti"></div>'
						+'	<div class="ptl_fn">'
						+'		<a href="javascript:;" onfocus="this.blur()" title="关闭" class="ptl_close ptl_s_b"></a>'+sizeCtl
						+'	</div>'
						+'</div><div class="ptlayer-body"><div class="ptl_loading"></div></div></div></div>';
			$("body").append(ui);
			$lobj = $("#"+id);
			var index = $(".ptlayer").maxIndex()+1;
			
			$lobj.width(setting.width).height(setting.height).css({"z-index":index}).show();
			$lobj.center();
			$(".ptl_loading",$lobj).center($(".ptl_loading",$lobj).parent());
			
			if(setting.lock){
				
			}
			
			if(setting.drag){
				//$($id).ptdrag({sub:".ptl_head",index:$index});	
				$lobj.ptdrag({
					sub:'.ptl_head'
				});
				
				
				/**
				 * 
				
				$lobj.draggable({
					iframeFix: true,
					delay:0,
					cursor:'crosshair',
					scroll: false,
					cancel: ".ptlayer-body" ,
					start:function(){
						$(".ptlayer-body",$lobj).append("<div class=\"imask\"></div>");
					},
					stop:function(){
						$(".imask",$lobj).remove();
					}
				});
				 
        		$('.ptl_head',$lobj).disableSelection();
        		
		        */
				$lobj.resizable({
		            // ghost: true
        			resize:function(){
        				if($(".pt_ide",this)[0]){
        					ideOnResize(this);
        				}        				
        			},
        			start:function(){
						$(".ptlayer-body",$lobj).append("<div class=\"imask\"></div>");
					},
					stop:function(){
						$(".imask",$lobj).remove();
					}
		        });
			}
			
			$lobj.mousedown(function(){			
				$(this).toggleV(1);
			});
			if(setting.title){
				$('.ptl_ti',$lobj).text(setting.title);	
			}
						
			if(setting.scroll){
				$(".ptlayer-body",$lobj).css("overflow","auto")
			}else{
				$(".ptlayer-body",$lobj).css("overflow","hidden")
			}
			
			if(setting.iframe){
				//console.log(setting);
				$(".ptlayer-body",$lobj).append('<iframe src="'+setting.ajax+'">');	
				//console.log($(".ptlayer-body",$lobj));
				$(".ptlayer-body iframe",$lobj).load(function(){
					$(".ptl_loading",$lobj).fadeOut(600,function(){
						$(this).remove();
					});
				})
			}else if(setting.ajax){
				if(setting.ajax){
					$.get(setting.ajax,function(data){
						$(".ptlayer-body",$lobj).html(data);
						$(".ptl_loading",$lobj).fadeOut(600,function(){
							$(this).remove();
						});
					})
				}
			}else{
				$(".ptlayer-body",$lobj).html(setting.html);
			}
			
			$('.ptl_close',$lobj).live("click",function(){		
				var id = $(this).parents('.ptlayer').attr("id").replace('ply_','');
				$(this).parents('.ptlayer').remove();
				$(".ptl_lock").remove();
				
				$("#menu_bottom_"+id).remove()
			})
			
			if(setting.win){
				$(".ptl_res",$lobj).hide();
				//最大化PTLAYER
				$(".ptl_max",$lobj).live("click",function(e){
					$id = $(this).parents('.ptlayer').attr('id');
					
					$(this).hide().siblings('.ptl_res',$lobj).show();
					var width = $("#main").width() - $("#menu-left").width()-20;					
					var height = $("#main").height()-$("#menu-bottom").height()-20;					
					var $width = $("#"+$id).width().toString();
					var $height = $("#"+$id).height().toString();
					var $left = $("#"+$id).offset().left.toString();
					var $top = $("#"+$id).offset().top.toString();
					//console.log($width,$height,$top,$left);
					$("#"+$id).data('width',$width);
					$("#"+$id).data('height',$height);
					$("#"+$id).data('top',$top);
					$("#"+$id).data('left',$left);
					
					$("#"+$id).width(width).height(height).css({top:10,left:(($("#menu-left").width()+10)+"px")});
				});
				
				//还原PTLAYER
				$(".ptl_res",$lobj).live("click",function(){
					$id = $(this).parents('.ptlayer').attr('id');
					$(this).hide().siblings('.ptl_max').show();
					var $width = $("#"+$id).data('width');
					var $height = $("#"+$id).data('height');
					var $top = $("#"+$id).data('top');
					var $left = $("#"+$id).data('left');
					$("#"+$id).width($width).height($height).css({top:($top+"px"),left:($left+"px")});
				});
				
				//最小化PTLAYER
				$(".ptl_min",$lobj).live("click",function(){
					$id = $(this).parents('.ptlayer').attr('id');
					$("#"+$id).fadeOut(300);
				});
			}
			return this;
		}
	})
})(jQuery);