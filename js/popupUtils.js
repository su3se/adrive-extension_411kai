Popup.searchPopup = function () {
	$('#searchLink').magnificPopup({
		modal: 'true',
		type: 'inline',
		items: {
			src: '#searchPopup'
		},
		mainClass: 'mfp-fade',
	});
}

Popup.renamePopup = function () {
	$('#renameLink').magnificPopup({
		modal: 'true',
		type: 'inline',
		items: {
			src: '#renamePopup'
		},
		mainClass: 'mfp-fade',
	});
}

Popup.deletePopup = function () {
	$('#deleteLink').magnificPopup({
		modal: 'true',
		type: 'inline',
		items: {
			src: '#deletePopup'
		},
		mainClass: 'mfp-fade',
	});
}

Popup.refreshPopup = function () {
	$('#refreshLink').magnificPopup({
		modal: 'true',
		type: 'inline',
		items: {
			src: '#refreshPopup'
		},
		mainClass: 'mfp-fade',
	});
}

Popup.requestPopup = function () {
	$('#requestLink').magnificPopup({
		modal: 'true',
		type: 'inline',
		items: {
			src: '#requestPopup'
		},
		mainClass: 'mfp-fade',
	});
}

Popup.petaPopup = function () {
	$('#petaLink').magnificPopup({
		modal: 'true',
		type: 'inline',
		items: {
			src: '#petaPopup'
		},
		mainClass: 'mfp-fade',
	});
}

Popup.iinePopup = function () {
	$('#iineLink').magnificPopup({
		modal: 'true',
		type: 'inline',
		items: {
			src: '#iinePopup'
		},
		mainClass: 'mfp-fade',
	});
}

Popup.rdRefreshPopup = function () {
	$('#rdRefreshLink').magnificPopup({
		modal: 'true',
		type: 'inline',
		items: {
			src: '#rdRefreshPopup'
		},
		mainClass: 'mfp-fade',
	});
}

Popup.maintenancePopup = function () {
	$('#maintenanceLink').magnificPopup({
		modal: 'true',
		type: 'inline',
		items: {
			src: '#maintenancePopup'
		},
		mainClass: 'mfp-fade',
	});
}

Popup.closePopup = function () {
	$.magnificPopup.close();
}