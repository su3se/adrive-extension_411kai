Refresh.refreshUser = function () {
    $('input#refresh_submit').attr('disabled', true);
    $('input#refresh_cancel').attr('disabled', true);

    $('div#refreshPopup .load').toggle(true);


    setTimeout(function () {
        Refresh.doneRefresh();
    }, 1000);
}

Refresh.doneRefresh = function () {
    MyList.refreshData(activeListNum);

    $('div#refreshPopup .load').toggle(false);
    Layout.createUserHTML(activeListNum);
    $('input#refresh_submit').attr('disabled', false);
    $('input#refresh_cancel').attr('disabled', false);
    Popup.closePopup();
}