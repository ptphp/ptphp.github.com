$(function(){
	$('.l_btn').live('click',function(){
		var index = $(this).index();
		if($(this).hasClass('l_module')){
			$(this).parents('.pt_sidebar').find("button.newmodule").show();
		}else{
			$(this).parents('.pt_sidebar').find("button.newmodule").hide();
		}
		$(this).addClass('btn-success').siblings().removeClass('btn-success');
		$(this).parents('.pt_sidebar').find('.sidebar_wrap').children().eq(index).show().siblings().hide();
	});
	$(".pt_pde_search").live('click',function(){
		return false;
		$p = $(this).parents('.ptlayer');
		$debug = $('.pt_ide_debug',$p);
		if($debug.height() < 90){
			$debug.height(90);
		}
		var ide_height = $(".pt_ide",$p).height();
		var top = (ide_height - 90);
		$('.splite_debug',$p).css('top',top+"px")
		
		ajustIdeMain(top,$p);
	})
	
	$(".pt_pde_upload").live('click',function(){	
		return false;
		$p = $(this).parents('.ptlayer');
		$debug = $('.pt_ide_debug',$p);
		if($debug.height() < 90){
			$debug.height(90);
		}
		var ide_height = $(".pt_ide",$p).height();
		var top = (ide_height - 90);
		$('.splite_debug',$p).css('top',top+"px")
		
		ajustIdeMain(top,$p);
	})
	$('.liOpen>span,.liClose>span').live('click',function(){
		if($(this).parent().hasClass("liClose")){
			$(this).parent().addClass("liOpen").removeClass('liClose');
		}else{
   			$(this).parent().addClass("liClose").removeClass('liOpen');
   		}
   		$(this).next('ul').toggle();	
	});
	$(".fileTree span").live('click',function(){
   		$p = $(this).parents('.ptlayer');
   		loadFiles($(this).data('path'),this,$p);
	});
	$(".m_tree li span").live('click',function(){
   		var $p = $(this).parents('.ptlayer');
   		var path = $(this).data('path');    		
   		if($(this).find('input')[0]){
   			return false;
   		}
   		loadModuleDetail(path,this,$p);
   		return false;
	});
	
	$('button.newmodule').live('click',function(){
		$p = $(this).parent();
		$(".m_tree>ul",$p).prepend('<li class="module"><span><input class="item_name" type="text"></span></li>');
	});
	
	$(".m_tree .item_name").live('change',function(){
		var name = this.value;	
		if(name){
			var obj = this;
			var proUrls = getProUrls();				
			$.post(proUrls['module_add'],{name:name,path:path_module},function(data){
				var ppp = $(obj).parent();
				ppp.html(data.module.name);
				ppp.data('path',data.module.path);
			},'json');
		}
	});
	
	
	$(".fileTree span").live("contextmenu",function(e){
		return false;
		   $p = $(this).parents('.ptlayer');
	   	   fileObj = this;
	       var path = $(this).data('path');
	       var ext = $(this).data('ext');
	       var id = hex_md5(path);
	       //console.log(this,path,ext);
	       if(!$("#rightKey")[0]){
	           $("body").append('<div id="rightKey"></div>');           
	       }
	       var left = e.pageX+10;
	       var top = e.pageY+10;
	       $("#rightKey").css({top:top+"px",left:left+"px",});
	       $("#rightKey").data("path",path).data("ext",ext).html("")
	           .append('<div data-key="r_rename" class="rightKeyItem">rename</div>')
	           .append('<div data-key="r_delete" class="rightKeyItem">delete</div>');
	       if(!ext){
	           $("#rightKey")
	               .append('<div data-key="r_newfile" class="rightKeyItem">newfile</div>')
	               .append('<div data-key="r_newfolder" class="rightKeyItem">newfolder</div>')
	               .append('<div data-key="r_search" class="rightKeyItem">search in the folder</div>')            
	               .append('<div data-key="r_upload" class="rightKeyItem">upload</div>')
	               .append('<div data-key="r_opendir" class="rightKeyItem">open Dir</div>');
	       }
	           
	       $("#rightKey").show();            
	       return false;
	   });  
})