document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('#begin').addEventListener('click', function () {
		chrome.tabs.create({
			url: "index.html"
		})
	});
	document.querySelector('#begin').click();
});