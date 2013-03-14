//编辑器容器
var editor = {};
//编辑器配置
var eoption = {
		allowFileManager : true,
		uploadJson : '/project/ajax/upload',
		fileManagerJson : '/project/ajax/filemanager',
		resizeType : 0,
		items : [
			'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
			'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
			'insertunorderedlist', '|', 'emoticons', 'image', 'link'
		]
	};

//时间 配置
var coption = {
		weekNumbers: true,	    
	    minuteStep: 1,
	    onSelect   : function() {this.hide();}
	};

/**
 * 格式化表单
 * @param format
 */
function formatform(format){
	
	for(type in format){
		//console.log(type);
		if(type == 'date' || type == 'datetime'){		
			//console.log(type,format[type],coption);	
			fdatetime(format[type],type,coption)
		}
		
		if(type == 'editor'){
			//console.log(type);	
			feditor(format[type],eoption);
		}
		
		if(type == 'select'){
			fselect(format[type]);
		}

		if(type == 'img'){			
	    	fimg(format[type],eoption);	    	
		}
	}
	
}

function fselect($rows){
	for(i=0;i<$rows.length;i++){
		row = $rows[i];
		id = row.id;
		options = row.options;
		if(options){
			$("#"+id).load(options,function(data){
				//console.log(data);
			});
		}
	}
}
function fimg($rows,o){	
	for(i=0;i<$rows.length;i++){
		id = $rows[i];
		//console.log(id);
		editor[id] = KindEditor.editor(o);
		$('.img-btn').click(function() {			
			  var $id = $(this).prev().attr('id');
			  editor[$id].loadPlugin('image', function() {
		            editor[$id].plugin.imageDialog({
		                showRemote : false,
		                imageUrl : $("#"+$id).val(),
		                clickFn : function(url, title, width, height, border, align) {
		                    //console.log(url, title, width, height, border, align);
		                    $("#"+$id).val(url);
		                    $("#"+$id).siblings('.img-preview').show().attr('src',url);
		                    editor[$id].hideDialog();
		                }
		            });
		        });    
	    });
	}
	return;	
}

function fdatetime($rows,type,$option){	 
	option = $option;
	if(type == 'date'){		
		width = 100;
		option.dateFormat = "%Y-%m-%d";
	}else{		
		width = 160;
		option.dateFormat = "%Y-%m-%d %H:%M:%S";
	}
	var id;
	//console.log($rows);
	for(i=0;i<$rows.length;i++){
		//console.log(i,$rows[i],type,option)
		id = $rows[i];
		option.inputField = id;
		option.trigger = id;
	    Calendar.setup(option);
	    $("#"+id).parent().css("position","relative");
	    $("#"+id).width(width).attr('readonly','true').addClass('date');
	}
}

function feditor($rows,o){
	//console.log($rows);
	for(i=0;i<$rows.length;i++){
		id = $rows[i];
		editor[id] = KindEditor.create('#'+id,o);
	}	 
}
