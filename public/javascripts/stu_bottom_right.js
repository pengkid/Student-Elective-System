
window.onload = function() {
		var input    = document.getElementsByTagName("input"),
			textarea = document.getElementsByTagName("textarea")[0];
		
		input[6].onclick = function() {
				input[7].removeAttribute("disabled");
				textarea.removeAttribute("readonly");
				input[7].removeAttribute("style");
				for(let i=0; i<input.length; i++){
						input[i].removeAttribute("readonly");
					}
			}
	}