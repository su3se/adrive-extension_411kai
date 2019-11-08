Rename.rename = function () {
	var $renameInputBox = $('#inputRename');
	var newName = $renameInputBox.val();

	if (!newName) {
		alert('ERROR：入力した文字が空白です');
		return;
	}

	$renameInputBox.attr('disabled', true);

	MyList.changeListName(activeListNum, newName);

	$('ul#tabList').empty();
	$('tbody#userList').empty();
	Layout.initLayout();

	$renameInputBox.attr('disabled', false);
	$renameInputBox.val('');
	Popup.closePopup();
}