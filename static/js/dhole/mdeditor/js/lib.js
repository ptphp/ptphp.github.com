var converter = null;
converter = new Markdown.Converter();

var editor = ace.edit("editor");
//monokai
editor.setTheme("ace/theme/twilight");
editor.onPaste = function(t){		
	console.log(event.clipboardData);
	str = event.clipboardData.getData("text/html");
	editor.insert(htmlToText(str));
};

editor.getSession().setMode("ace/mode/markdown");


editor.getSession().on('change', function(e) {    	
	if($("#preview").hasClass("preview_on")){
		//updateMd("#preview",editor.getValue());
		var html = converter.makeHtml(editor.getValue());		
		$("#preview").html(html);	
	}
});
function preview(){		
	if($("#preview").hasClass("preview_on")){
		$("#editor").css('right',"0px");
	}else{
		$("#editor").css('right',"50%");
		var html = converter.makeHtml(editor.getValue());			
		$("#preview").html(html);	
	}
	$("#preview").toggleClass("preview_on");
	
	editor.resize();
}
function fullscreen(){
	$("#editor_area").toggleClass("fullscreen");
	if($(".editor_wrap").hasClass('editor_height')){
		$(".editor_wrap").removeClass('editor_height').addClass('editor_full');
		
	}else{
		$(".editor_wrap").addClass('editor_height').removeClass("editor_full");
	}
	editor.resize();
}
function htmlToText(str){
	str=str.replace(/<\s*br\/*>/gi, "\n");
	str=str.replace( /<img.*?src="(.*?)".*?(?:>|\/>)/ig, "![]($1)\n");		
	str=str.replace( /<h1.*?(?:>|\/>)/ig, "#");
	str=str.replace( /<h2.*?(?:>|\/>)/ig, "##");
	str=str.replace( /<h3.*?(?:>|\/>)/ig, "###");
	str=str.replace( /<h4.*?(?:>|\/>)/ig, "####");
	str=str.replace( /<h5.*?(?:>|\/>)/ig, "#####");
	str=str.replace( /<h6.*?(?:>|\/>)/ig, "######");
	str=str.replace(/<\/div>/ig, "\n");
	str=str.replace(/<\/p>/ig, "\n");
	str=str.replace(/<\/h[0-9]>/ig, "\n");
	str=str.replace(/<\s*\/*.+?>/ig, "");
	str=str.replace(/ {2,}/gi, " ");
	str=str.replace(/\n+\s*/gi, "\n\n");
	return str;
}
