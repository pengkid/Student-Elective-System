// JavaScript Document

window.onload = function () {
	var id    = document.getElementsByTagName("input")[0],
		pwd   = document.getElementsByTagName("input")[1],
		login = document.getElementsByTagName("input");
	
	for(var i=2; i<4; i++){
		login[i].onclick = function(){
			if(id.value=="" || pwd.value==""){
				alert("啥都没写就想登录？！")
				return false;
			};
		}
	}
	}