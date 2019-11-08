RdRefresh.start = function () {
    $('div#rdRefreshPopup .load').toggle(true);
    $('input#rdRefresh_submit').attr('disabled', true);
    $('input#rdRefresh_cancel').attr('disabled', true);

    var readers = [];
    pageNum = 1;

    RdRefresh.done(readers, 'refresh');
}

RdRefresh.done = function (readers, finish) {
    $.ajax({
        type: 'GET',
        url: 'https://blog.ameba.jp/ucs/blgfavorite/favoritelist.do?pageID=' + pageNum,
        dataType: 'html',
        success: function (data) {
            var $readerForm = $(data).find('form[name="favoriteListForm"]');
            var $readerList = $readerForm.find('table.tableList tbody tr');

            $readerList.each(function () {
                var idLink = $(this).find('td.title a').attr('href')
                var id = idLink.match(/https:\/\/ameblo.jp\/(.*?)\//)[1];

                var status = $(this).find('td.status span').attr('class');

                readers.push({
                    id: id,
                    status: status
                });
            });

            if ($readerForm.find('a.next').length != 0) {
                pageNum++;
                RdRefresh.done(readers, finish);
                return;
            }

            MyReader.saveReaders(readers);

            var yourReaders = [];
            pageNum = 1;
            RdRefresh.yourReaderDone(yourReaders, finish);

        }, error: function (data) {
            alert('読者管理ページへの接続に失敗しました。\nネットワーク接続をご確認ください。');
            RdRefresh.end();
        }
    });
}

RdRefresh.yourReaderDone = function (yourReaders, finish) {
    $.ajax({
        type: 'GET',
        url: 'https://blog.ameba.jp/ucs/reader/readerlist.do?pageID=' + pageNum,
        dataType: 'html',
        success: function (data) {
            var $readerForm = $(data).find('form[name="readerListForm"]');
            var $readerList = $readerForm.find('table.tableList p.name a');

            $readerList.each(function () {
                yourReaders.push($(this).text());
            });

            if ($readerForm.find('a.next').length != 0) {
                pageNum++;
                RdRefresh.yourReaderDone(yourReaders, finish);
                return
            }

            MyReader.saveYourReaders(yourReaders);
            MyReader.setMaintenanceReaders();

            if (finish == 'refresh') {
                RdRefresh.end();
            } else if (finish == 'maintenance') {
                Maintenance.end();
            }

        }, error: function (data) {
            alert('読者管理ページへの接続に失敗しました。\nネットワーク接続をご確認ください。');
            RdRefresh.end();
        }
    });
}

RdRefresh.end = function () {
    Layout.createReaderHTML();

    $('input#rdRefresh_submit').attr('disabled', false);
    $('input#rdRefresh_cancel').attr('disabled', false);
    $('div#rdRefreshPopup .load').toggle(false);

    Popup.closePopup();
}