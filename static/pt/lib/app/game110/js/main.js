;(function($){

})(jQuery);

$(function(){
	$("#login_a").click(function(){
		$("#sigin_modal").fadeIn(300);
	});	
	
	$("#forget_pass").click(function(){
		$("#forget_pass_modal").fadeIn(300);
	});
	
	$("#btn_forget").click(function(){
		var idcard = $("#f_idcard").val();
		if(idcard == '' || idcard.length >19){
			alert("身份证不合法");
			 $("#f_idcard").focus();
			return false;
		}
		$.post('/api.php?model=user&method=forgetpass',{username:idcard},function(data){
			if(data.indexOf("error")== 0){
				alert(data.replace("error|",""));
			}else{
				alert(data);
				location.reload();
			}
		});
	});
	$("#logout_a").click(function(){		
		$.get("/api.php?model=user&method=logout",function(){
			location.reload();
		})
	});
	
	$("#btn_sigin").click(function(){
		var username = $("#l_idcard").val();
		var password = $("#l_pwd").val();
		if(username == ''){
			alert("身份证号不能为空！");
			$("#l_idcard").focus();
			return false;
		}
		if(password == ''){
			alert("密码不能为空！");
			$("#l_pwd").focus();
			return false;
		}
		$.post('/api.php?model=user&method=login',{usr:username,pwd:password},function(data){
			if(data == 0){
				alert("登陆成功");
				location.href="/index.php?c=user";
			}else{
				alert(data.replace("error|",""));
			}
		});
		return false;
	});
	
	$("#nav-bar li").click(function(){
		//$(this).addClass("selected").siblings().removeClass("selected");
		//var key = $(this).data("key");
		//$("#content ."+key).fadeIn(300).siblings().fadeOut(300);
	});
});