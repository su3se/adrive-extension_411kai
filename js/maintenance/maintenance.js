Maintenance.drawList = function () {
    utils.drawCheckList('table#targetWaitUserTable', 'maintenance_table');
}

Maintenance.close = function () {
    $('tbody#maintenance_table').remove();
    Popup.closePopup();
}

Maintenance.start = function () {
    $('div#maintenancePopup .load').toggle(true);

    $('input#maintenance_submit').attr('disabled', true);
    var $cancelBtn = $('input#maintenance_cancel');
    $cancelBtn.off('click');
    $cancelBtn.on('click', utils.processCancel);

    maintenanceTargets = utils.getCheckList();

    onProcess = true;
    currentTab = null;
    isSkip = false;

    Maintenance.execute();
}

Maintenance.execute = function () {
    if (!onProcess) {
        alert('処理が中断されました。\nメンテナンス処理を終了します。');
        Maintenance.finish();
        return;
    }

    currentId = maintenanceTargets[0];

    if (currentId == null || currentId == 'undefined') {
        Maintenance.finish();
        return;
    }

    pageNum = 1;
    Maintenance.searchId();
}

Maintenance.searchId = function () {
    $.ajax({
        type: 'GET',
        url: 'https://blog.ameba.jp/ucs/blgfavorite/favoritelist.do?pageID=' + pageNum,
        dataType: 'html',
        success: function (data) {
            var $readerForm = $(data).find('form[name="favoriteListForm"]');
            var $readerList = $readerForm.find('table.tableList tbody tr');

            var flg = false;

            $readerList.each(function () {
                var idLink = $(this).find('td.title a').attr('href')
                var id = idLink.match(/https:\/\/ameblo.jp\/(.*?)\//)[1];

                if (id == currentId) {
                    flg = true;
                    return false;
                }
            });

            if (flg) {
                Maintenance.deleteReader();
                return;
            }

            if (!$readerForm.find('span.next').hasClass('disabled')) {
                pageNum++;
                Maintenance.searchId();
                return;
            }

            Maintenance.notFindUser();
        }, error: function (data) {
            alert('読者管理ページへの接続に失敗しました。\nネットワーク接続をご確認ください。');
            RdRefresh.end();
        }
    });
}

Maintenance.deleteReader = function () {
    if (!onProcess) {
        alert('処理が中断されました。\nメンテナンス処理を終了します。');
        Maintenance.finish();
        return;
    }

    chrome.tabs.create({
        url: 'https://blog.ameba.jp/ucs/blgfavorite/favoritelist.do?pageID=' + pageNum,
        selected: false
    }, function (tab) {
        currentTab = tab;
        executeOnTab(tab, Maintenance.deleteScript, tab);
    });
}

Maintenance.deleteScript = function (tab) {
    chrome.tabs.executeScript(parseInt(tab.id), {
        code: 'deleteReader("' + currentId + '");'
    });
}

Maintenance.deleteComplete = function () {
    setTimeout(function () {
        chrome.tabs.get(currentTab.id, function (tab) {
            chrome.tabs.remove(tab.id);
            currentTab = null;
        });
    }, TAB_IINE_TIME);

    $('td#status_' + currentId).text('削除完了');

    Maintenance.nextProcess();
}

Maintenance.notFindUser = function () {
    $('td#status_' + currentId).text('削除不可');

    isSkip = true;
    Maintenance.nextProcess();
}

Maintenance.tabError = function () {
    setTimeout(function () {
        chrome.tabs.get(currentTab.id, function (tab) {
            chrome.tabs.remove(tab.id);
            currentTab = null;
        });
    }, TAB_IINE_TIME);

    $('td#status_' + currentId).text('Error');

    isSkip = true;
    Maintenance.nextProcess();
}

Maintenance.nextProcess = function () {
    var nextTargets = maintenanceTargets.filter(function (item, index) {
        if (index != 0)
            return true;
    });

    maintenanceTargets = nextTargets;

    if (!onProcess) {
        alert('処理が中断されました。\nメンテナンス処理を終了します。');
        Maintenance.finish();
        return;
    }

    if (maintenanceTargets.length == 0) {
        setTimeout(Maintenance.finish, TAB_IINE_TIME);
        return;
    }

    if (isSkip) {
        isSkip = false;
        Maintenance.execute();
        return;
    }

    var begin = parseInt(localStorage['begin']);
    var end = parseInt(localStorage['end']);
    var sleepTime = (Math.floor(Math.random() * (end - begin) + begin)) * 1000;
    setTimeout(Maintenance.execute, sleepTime);
}

Maintenance.finish = function () {
    var readers = [];
    pageNum = 1;

    RdRefresh.done(readers, 'maintenance');
}

Maintenance.end = function () {
    Layout.createReaderHTML();

    $('input#maintenance_submit').attr('disabled', false);
    $('input#maintenance_cancel').attr('disabled', false);
    $('div#maintenancePopup .load').toggle(false);
    var $cancelBtn = $('input#maintenance_cancel');
    $cancelBtn.off('click');
    $cancelBtn.on('click', Maintenance.close);

    Maintenance.close();
}