$(function(){
		$("#game").live('change',function(){
			$.get('/api.php?model=product&method=getproductbygid',{id:this.value},function(data){
				//console.log(data);
				//alert(data);
				$("#level_pan").html(data).show();
				$($("input[name='product']")[0]).click();
			});
		})
		
		$("#company").load('/api.php?model=company&method=all&t='+(+new Date),function(){
			$("#company").change(function(){
				//alert(this.value);
				var id = this.value;
				getGameByCid(id);				
			});
			$(this).change();
		})

		
		$("input[name='product']").live('click',function(){
			s = $(this).data("pay");
			$("#pay").text(s);
			$("input[name='pay']").val(s);
		});
		
		$("#login_modal .close").click(function(){
			$("#login_modal").fadeOut(200);
			$(".modal-backdrop").fadeOut(200);
		});
		
		$("#account").blur(function(){
			e = this.value;
			if(e == '' || e.length >100){
				$(this).parents(".control-group").addClass("error");
				$(this).parents(".control-group").find(".msg").removeClass("success").text('游戏帐号不合法');
			}else{
				$(this).parents(".control-group").removeClass("error");
				$(this).parents(".control-group").find(".msg").addClass("success").text('');			
			}
		});
		
		$("#email").blur(function(){
			e = this.value;
			if(e == '' || e.length >100 || !isEmail(e) ){
				$(this).parents(".control-group").addClass("error");
				$(this).parents(".control-group").find(".msg").removeClass("success").text('EMAIL不合法');
			}else{
				$(this).parents(".control-group").removeClass("error");
				$(this).parents(".control-group").find(".msg").addClass("success").text('');			
			}
		});
		
		$("#idcard").blur(function(){
			var obj = this;
			var idno = obj.value;
			var idcard = new clsIDCard(idno);
			var b = idcard.GetBirthDate();
			var s = idcard.GetSex();		
			if(idno == '' || idno.length >20 || !idcard.IsValid()){
				$("#birth").val('');
				$("#sex").val("1");
				$(obj).parents(".control-group").addClass("error");
				$(obj).parents(".control-group").find(".msg").removeClass("success").text('身份证号不合法');			
			}else{			
				$("#birth").val(b);
				$("#sex").val(s);
				$(obj).parents(".control-group").removeClass("error");
				$(obj).parents(".control-group").find(".msg").addClass("success").text('');
			}
		});
		
		$("#name").blur(function(){
			e = this.value;
			if(e == '' || e.length >5){
				$(this).parents(".control-group").addClass("error");
				$(this).parents(".control-group").find(".msg").removeClass("success").text('姓名不合法');
			}else{
				$(this).parents(".control-group").removeClass("error");
				$(this).parents(".control-group").find(".msg").addClass("success").text('');			
			}
		});
		$("#mobile").blur(function(){
			e = this.value;
			if(e == '' || e.length >15){
				$(this).parents(".control-group").addClass("error");
				$(this).parents(".control-group").find(".msg").removeClass("success").text('移动电话不合法');
			}else{
				$(this).parents(".control-group").removeClass("error");
				$(this).parents(".control-group").find(".msg").addClass("success").text('');			
			}
		});
		$("#address").blur(function(){
			e = this.value;
			if(e == '' || e.length >150){
				$(this).parents(".control-group").addClass("error");
				$(this).parents(".control-group").find(".msg").removeClass("success").text('通讯地址不合法');
			}else{
				$(this).parents(".control-group").removeClass("error");
				$(this).parents(".control-group").find(".msg").addClass("success").text('');			
			}
		});
		
		
		showLogin();
	});	
	function getGameByCid(id){		
		$.get('/api.php?model=game&method=getgamebycid&id='+id,function(data){				
			if(data){
				$('#game').html(data);
				$('#game').change();
			}else{
				$('#game').html('<option value="">无</option>');
				$('#level_pan').html('');
			}			
		})
	}
	var get_captcha = function(obj,url) {
	    var uri = url + '?t=' + String(Math.random()).slice(3,8);
	    $(obj).attr('src', uri);
	}
	
	function checkCaptcha(obj,url){
		var v = obj.value;
		if(!v){
			$(obj).parents(".control-group").addClass("error");
			$(obj).parents(".control-group").find(".msg").removeClass("success").text('验证码不正确！请重新再试');	
			return;
		}		
		//var c = $(".captcha");		
		$.get(url,{t:String(Math.random()).slice(3,8),c:v},function(data){
			if(data != 0){
				$(obj).parents(".control-group").addClass("error");
				$(obj).parents(".control-group").find(".msg").removeClass("success").text('验证码不正确！请重新再试');				
			}else{
				$(obj).parents(".control-group").removeClass("error");
				$(obj).parents(".control-group").find(".msg").addClass("success").text('');	
			}
		})
	}
	
	function showLogin(){
		$("#login_modal").fadeIn(200);
		$(".modal-backdrop").fadeIn(200);
	}
	
	
	function checkSub(){	
		
		$("#request_form input").each(function(){
			$(this).blur();			
		});
		if($(".control-group.error").length>0){
			$($(".control-group.error")[0]).find("input").focus();
			return false;
		}
		
		if(!$("#agree")[0].checked){
			//console.log($("#agree")[0].checked);
			alert("您没有选择同意《理赔协议》");
			$("#agree").focus();
			return false;
		}
		//console.log($("#request_form").serialize())
		$("#btnReq").attr("disabled","true").text("正在提交...");
		$("#req_loading").fadeIn(200);
		param = $("#request_form").serialize()
		//param = 'gameid=1&product=1&pay=180&account=wwww&email=liseor%40gmail.com&idcard=1111111111111&name=ssss&sex=1&birth=1983-4-01&mobile=13444444444&address=%E5%BB%B6%E5%AE%89%E8%A5%BF%E8%B7%AF2077%E5%8F%B72807&phone=&zip=&captcha='
		//param += $('#captcha').val();
		
		$.ajax({
			type:"POST",
			url:'/api.php?model=order&method=sigin',
			data:param,
			success:function(data){
				if(data.indexOf("error|") == 0){
					$(".captcha").click();
					alert(data.replace('error|',''));
				}else{
					location.href="/index.php?c=pay&id="+data;
				}
				
				$("#btnReq").removeAttr("disabled").text('提交');
				$("#req_loading").fadeOut(200);
			},
			error:function(data){
				alert('系统错误，请重新再试');
				$("#btnReq").removeAttr("disabled").text('提交');
				$("#req_loading").fadeOut(200);
			}
		});
		return false;
	}
	
	function isEmail($str){
		reg = new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$");
		if(reg.test($str)){
			return true;
		}else{
			return false;
		}
	}
	
	
	// 构造函数，变量为15位或者18位的身份证号码
	function clsIDCard(CardNo) {
	  this.Valid=false;
	  this.ID15='';
	  this.ID18='';
	  this.Local='';
	  if(CardNo!=null)this.SetCardNo(CardNo);
	}
	// 设置身份证号码，15位或者18位
	clsIDCard.prototype.SetCardNo = function(CardNo) {
	  this.ID15='';
	  this.ID18='';
	  this.Local='';
	  CardNo=CardNo.replace(" ","");
	  var strCardNo;
	  if(CardNo.length==18) {
	    pattern= /^\d{17}(\d|x|X)$/;
	    if (pattern.exec(CardNo)==null)return;
	    strCardNo=CardNo.toUpperCase();
	  } else {
	    pattern= /^\d{15}$/;
	    if (pattern.exec(CardNo)==null)return;
	    strCardNo=CardNo.substr(0,6)+'19'+CardNo.substr(6,9)
	    strCardNo+=this.GetVCode(strCardNo);
	  }
	  this.Valid=this.CheckValid(strCardNo);
	}
	// 校验身份证有效性
	clsIDCard.prototype.IsValid = function() {
	  return this.Valid;
	}
	// 返回生日字符串，格式如下，1981-10-10
	clsIDCard.prototype.GetBirthDate = function() {
	  var BirthDate='';
	  if(this.Valid)BirthDate=this.GetBirthYear()+'-'+this.GetBirthMonth()+'-'+this.GetBirthDay();
	  return BirthDate;
	}
	// 返回生日中的年，格式如下，1981
	clsIDCard.prototype.GetBirthYear = function() {
	  var BirthYear='';
	  if(this.Valid)BirthYear=this.ID18.substr(6,4);
	  return BirthYear;
	}
	// 返回生日中的月，格式如下，10
	clsIDCard.prototype.GetBirthMonth = function() {
	  var BirthMonth='';
	  if(this.Valid)BirthMonth=this.ID18.substr(10,2);
	  if(BirthMonth.charAt(0)=='0')BirthMonth=BirthMonth.charAt(1);
	  return BirthMonth;
	}
	// 返回生日中的日，格式如下，10
	clsIDCard.prototype.GetBirthDay = function() {
	  var BirthDay='';
	  if(this.Valid)BirthDay=this.ID18.substr(12,2);
	  return BirthDay;
	}
	// 返回性别，1：男，0：女
	clsIDCard.prototype.GetSex = function() {
	  var Sex='';
	  if(this.Valid)Sex=this.ID18.charAt(16)%2;
	  return Sex;
	}
	// 返回15位身份证号码
	clsIDCard.prototype.Get15 = function() {
	  var ID15='';
	  if(this.Valid)ID15=this.ID15;
	  return ID15;
	}
	// 返回18位身份证号码
	clsIDCard.prototype.Get18 = function() {
	  var ID18='';
	  if(this.Valid)ID18=this.ID18;
	  return ID18;
	}
	// 返回所在省，例如：上海市、浙江省
	clsIDCard.prototype.GetLocal = function() {
	  var Local='';
	  if(this.Valid)Local=this.Local;
	  return Local;
	}
	clsIDCard.prototype.GetVCode = function(CardNo17) {
	  var Wi = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1);
	  var Ai = new Array('1','0','X','9','8','7','6','5','4','3','2');
	  var cardNoSum = 0;
	  for (var i=0; i<CardNo17.length; i++)cardNoSum+=CardNo17.charAt(i)*Wi[i];
	  var seq = cardNoSum%11;
	  return Ai[seq];
	}
	clsIDCard.prototype.CheckValid = function(CardNo18) {
	  if(this.GetVCode(CardNo18.substr(0,17))!=CardNo18.charAt(17))return false;
	  if(!this.IsDate(CardNo18.substr(6,8)))return false;
	  var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
	  if(aCity[parseInt(CardNo18.substr(0,2))]==null)return false;
	  this.ID18=CardNo18;
	  this.ID15=CardNo18.substr(0,6)+CardNo18.substr(8,9);
	  this.Local=aCity[parseInt(CardNo18.substr(0,2))];
	  return true;
	}
	clsIDCard.prototype.IsDate = function(strDate) {
	  var r = strDate.match(/^(\d{1,4})(\d{1,2})(\d{1,2})$/);
	  if(r==null)return false;
	  var d= new Date(r[1], r[2]-1, r[3]);
	  return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[2]&&d.getDate()==r[3]);
	}