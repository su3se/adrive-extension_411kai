Delete.deleteUser = function () {
	var $deleteBtn = $('input#delete_submit');
	var $cancelBtn = $('input#delete_cancel');
	$deleteBtn.attr('disabled', true);
	$cancelBtn.attr('disabled', true);

	MyList.deleteUserList(activeListNum, utils.getCheckList())

	Layout.createUserHTML(activeListNum);
	$deleteBtn.attr('disabled', false);
	$cancelBtn.attr('disabled', false);
	Popup.closePopup();
}