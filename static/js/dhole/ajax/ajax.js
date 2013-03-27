function ajax_get(){
	var xhr;        
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');        
	}
	xhr.open('GET', 'test.js', true);
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');        
	xhr.onreadystatechange = function(state) {
		if (4 === xhr.readyState && 200 === xhr.status && -1 !== xhr.responseText.indexOf('sf-toolbarreset')) {
			alert(xhr.responseText)  
		}
	};        
	xhr.send('');  
}