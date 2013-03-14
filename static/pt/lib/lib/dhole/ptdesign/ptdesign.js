var ptelements = new Array();
var curObj = "";
//解析父节点
function parseParents(obj){
	//console.log(obj);
	ptelements.unshift(obj);
	$parent = $(obj).parent();
	//console.log($(obj).parent(),$parent[0].tagName);
	if($parent[0] && $parent[0].tagName != "BODY"){
		parseParents($parent[0]);
	}
}

//格式化父节点
function parseElenav(ar){
	//console.log(ar);
	var html = ' <li><a href="#">html</a><li><li><a href="#">body</a><li> ';
	for(i in ar){
		nName = ar[i].tagName.toLocaleLowerCase()+(ar[i].id?"#"+ar[i].id:(ar[i].className?"."+ar[i].className.replace(" ","."):""));
		//console.log(ar[i].className,ar[i].id);
		html += " <li><a href=\"#\" onclick=\"eleNavClick(this,"+i+")\">"+nName+" </a></li> ";
	}
	//console.log(html);
	return html;
};
$(function(){		
	$.get("/Module/Ptwebos/static/ptdesign/ptdesign.html",function(data){
		$("body").append(data);		
		$(".ptdrag-ui-right").draggable({ 
			axis: "x", 
			drag: resizeObj
		});
		
		$(".ptdrag-ui-bottom").draggable({ 
			axis: "y", 
			drag: resizeObj
		});		
	});
	
	$("body *").live("click",function(e){		
		if($(this).hasClass("ptdrag-ui")){
			return false;
		}
		
		ptelements = new Array();
		parseParents(this);
		//console.log(parseElenav(ptelements));
		$(".breadcrumb",self.parent.document).html(parseElenav(ptelements));
		objClick(this);
		return false;
	});
});

//调整元素宽高
var resizeObj = function (){
	var width = $(".ptdrag-ui-right").offset().left-$(".ptdrag-ui-left").offset().left;
	var height = $(".ptdrag-ui-bottom").offset().top-$(".ptdrag-ui-top").offset().top;
	$(".ptdrag-ui-bottom,.ptdrag-ui-top").width(width);
	$(".ptdrag-ui-right,.ptdrag-ui-left").height(height);
	//console.log(width,height)
	$(curObj).width(width).height(height);
	setStyle(curObj);
}
//添加的拖动调整宽高手柄
function appendDrag(obj){
	var width = $(obj).width();
	var height = $(obj).height();
	var top = $(obj).offset().top;
	var left = $(obj).offset().left;	
	$(".ptdrag-ui-top").width(width).css({"top":top+"px","left":left+"px"});
	$(".ptdrag-ui-bottom").width(width).css({"top":(top+height)+"px","left":left+"px"});
	$(".ptdrag-ui-left").height(height).css({"top":top+"px","left":left+"px"});
	$(".ptdrag-ui-right").height(height).css({"top":top+"px","left":(left+width)+"px"});
	$(".ptdrag-ui:not(.ptdrag-ui-topbar)").show();
	//console.log(width,height);
}
function setNodePro(obj,parent){
	$("[id^=d_s_]",parent).val("");
	$("#d_class",parent).val("");
 	$("#d_id",parent).val("");
 	$("#d_src",parent).val("");
 	
 	var id = $(obj).attr("id");
 	var cls = $(obj).attr("class");
 	var src = $(obj).attr("src");
 		
 	if(!id){
 		id = "";
 	}
 	if(!cls){
 		cls = "";
 	} 
 	if(!src){
 		src = "";
 		$(".imgTag",parent).hide();
 		$(".colorPro",parent).show();
 		
 	}else{
 		$(".imgTag",parent).show();
 		$("#d_src",parent).val(src);
 		$(".colorPro",parent).hide();
 	}
	
 	$("#d_class",parent).val(cls);
 	$("#d_id",parent).val(id);
 	setStyle(curObj);	
}
function objClick(obj){
	curObj = obj;	
	$parent = $(self.parent.document);
	$('.ptdrag-ui-topbar').hide();	
	appendDrag(obj);	
	$("body *").removeClass("onselect");
	$(obj).addClass("onselect");
	//console.log($(obj).offset().top);
	//console.log($("html").scrollTop());
	if($(obj).offset().top > $(window,document).height()){
		$(document).scrollTop($(obj).offset().top-30);
		$(document).scrollLeft($(obj).offset().left-60);
	}
	
	setNodePro(obj,$parent);
}
//格式化元素 style
function setStyle(obj){
	//$("#d_style",$(self.parent.document)).val("");
	self.parent.pteditor['d_style'].setValue("");
	var style = $(obj).attr("style");
	//console.log(style)
	if(style){
		//console.log(style);
		arr = explode(style,";");
		s = "";
		for(i =0;i<arr.length;i++){
			if(arr[i].trim()){
				s += arr[i].trim()+";\n"
			}
		}
		s += "";
 		//$("#d_style",$(self.parent.document)).val(s);
		if(self.parent.pteditor['d_style']){
			self.parent.pteditor['d_style'].setValue(s);
		} 		
 	}
}
function explode(inputstring, separators, includeEmpties) {
  inputstring = new String(inputstring);
  separators = new String(separators);

  if(separators == "undefined") {
    separators = " :;";
  }

  fixedExplode = new Array(1);
  currentElement = "";
  count = 0;

  for(x=0; x < inputstring.length; x++) {
    str = inputstring.charAt(x);
    if(separators.indexOf(str) != -1) {
        if ( ( (includeEmpties <= 0) || (includeEmpties == false)) && (currentElement == "")) {
        }
        else {
            fixedExplode[count] = currentElement;
            count++;
            currentElement = "";
        }
    }
    else {
        currentElement += str;
    }
  }

  if (( ! (includeEmpties <= 0) && (includeEmpties != false)) || (currentElement != "")) {
      fixedExplode[count] = currentElement;
  }
  return fixedExplode;
}

//转到固定长度的十六进制字符串，不够则补0 
function zero_fill_hex(num, digits) { 
	var s = num.toString(16); 
	while (s.length < digits) 
	s = "0" + s; 
	return s; 
} 

//妈的，怎么都没搜到怎么用javascript找出一个背景色的数值，只好自己解析 
function rgb2hex(rgb) { 
	//nnd, Firefox / IE not the same, fxck 
	if (rgb.charAt(0) == '#') 
	return rgb; 
	var n = Number(rgb); 
	var ds = rgb.split(/\D+/); 
	var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]); 
	return "#" + zero_fill_hex(decimal, 6); 
} 
//添加HTML
function appendHtml(type){
	var block = '<div class="block"><div class="head">head</div><div class="body">body</div><div class="foot">foot</div></div>';
	var region = '<div class="region width_16">'+block+'</div>'
	var wrap = '<div class="wrap">'+region+'</div>'
	switch(type){
		case "block":
			html = block;
			break;
		case "region":
			html = region;
			break;
		case "wrap":
			html = wrap;
			break;
		case "ul":
			html = "<ul><li>ul</li></ul>";
			break;
		case "ulleft":
			html = '<ul class="left"><li>ulleft</li><li>ulleft</li></ul>';
			break;
		case "li":
			html = "<li>li</li>";
		case "span":
			html = "<span>span</span>";
			break;
		case "a":
			html = "<a>a</a>";
			break;
		case "p":
			html = "<p>p</p>";
			break;
		case "img":
			html = '<img src="http://www.baidu.com">';
			break;
		
		default:
			html = "<div>div</div>"
			break;
	}
	$(curObj).append(html);	
}

function htmltem(obj){
	var value = obj.value;
	appendHtml(value);
	curObj.click();
}
//添加移动手柄
function getParentRel(obj){
	var $parent = $(obj).parent();
	//console.log(obj,$parent.css('position'));
	if($parent){
		if($parent.css("position") == "relative" || $parent[0].tagName == "BODY"){
			return $parent;
		}
	}
	return getParentRel($parent);
	
}
//修改当前元素 html()
function changeH(obj){
	var value = obj.value;
	if(value && curObj){
		$(curObj).html(value);
	}
}
function openSprite(){
	//$(".sprite-view").show();
	//console.log($(curObj).css("background-image"));
	console.log($(".sprit-view"));
	if($(".sprite-view").is(":visible")){
		$(".sprite-view").hide();
		$(".designbar").height("160px");
		$("boyd").css("margin-bottom","160"+px)
		return;
	}
	var bg_img = $(curObj).css("background-image");
	if( bg_img== "none"){
		$("#d_s_bg_image").focus();
		return;
	};
	var img = bg_img.replace("url(","").replace(")","");
	
	$(".sprit-view-inner img").attr("src",img);
	var height = 250;
	$(".sprite-view").show();
	$(".designbar").height(410);
	$(".sprit-view-inner").animate({height:height+"px"});
	$("boyd").css("margin-bottom","410px")
	console.log(img,height);
}


/*
function htmltem(obj){
	var value = obj.value;
	appendHtml(value);
	curObj.click();
}
 */