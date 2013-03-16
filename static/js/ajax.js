<script type="text/javascript">
 * /*<![CDATA[*/    
	(function () {
		var wdt, xhr;        
		wdt = document.getElementById('sfwdt5042e4ca0cffb');        
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else {
			xhr = new ActiveXObject('Microsoft.XMLHTTP');        
		}
		xhr.open('GET', '/Symfony_Standard_Vendors_2.0.16/Symfony/web/app_dev.php/_wdt/5042e4ca0cffb', true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');        
		xhr.onreadystatechange = function(state) {
			if (4 === xhr.readyState && 200 === xhr.status && -1 !== xhr.responseText.indexOf('sf-toolbarreset')) {
				wdt.innerHTML = xhr.responseText;                
				wdt.style.display = 'block';            
			}        
		};        
		xhr.send('');    
	})();/*]]>*/
 </script>