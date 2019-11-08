Search.searchById = function () {
	pageNum = 1;

	$('div#searchPopup .load').toggle(true);

	var $inputId = $('input#searchId');
	searchId = $inputId.val();
	$inputId.prop('disabled', true);

	$('#search_submit').prop('disabled', true);

	var $cancelBtn = $('input#search_cancel');
	$cancelBtn.off('click');
	$cancelBtn.on('click', utils.processCancel);

	onProcess = true;
	Search.checkReaderPage();
}

Search.checkReaderPage = function () {
	if (!onProcess) {
		alert('ページ検索が中断されました。\n現在取得したページ内のユーザー検索を開始します。');
		onProcess = true;
		pageCount = pageNum;
		pageNum = 0;
		Search.doneSearch();
		return;
	}

	$.ajax({
		type: 'GET',
		url: 'http://ameblo.jp/' + searchId + '/reader-' + pageNum
			+ '.html',
		dataType: 'html',
		success: function (data) {
			if ($(data).find('ul.contentsList li').length == 0
				&& $(data).find('ul[data-uranus-component="readersList"] li').length == 0) {
				Search.notFindReader();
				return;
			}

			if ($(data).find('a.pagingNext').length != 0 || $(data).find('a.skin-paginationNext').length != 0) {
				pageNum++;
				$('#searchStatus').text('リスト数確認中:' + pageNum);
				Search.checkReaderPage();
				return;
			}

			pageCount = pageNum;
			pageNum = 0;
			Search.doneSearch();
		}, error: function (data) {
			alert('読者ページへの接続に失敗しました。\n入力したユーザーIDをご確認下さい。');
			Search.searchEnd();
		}
	});
}

Search.doneSearch = function () {
	$('#searchStatus').text('リスト取得中:' + pageNum + ' / ' + pageCount);
	var progress_rate = Math.round(pageNum / pageCount * 100);
	$('#searchPopup .progress-bar').attr('style', 'width:' + progress_rate + '%').attr('aria-valuenow', progress_rate).text(progress_rate + '%');


	if (pageNum >= pageCount) {
		Search.searchEnd();
		return;
	}

	if (!onProcess) {
		alert('処理が中断されました。\n検索を終了します。');
		Search.searchEnd();
		return;
	}

	pageNum++;
	Search.getReaderList();
}

Search.getReaderList = function () {
	if (MyList.getUserListNum(activeListNum) > MAX_USER) {
		alert('タブ内のユーザ数が上限値に達しました。');
		Search.searchEnd();
		return;
	}

	if (!onProcess) {
		alert('処理が中断されました。\n検索を終了します。');
		Search.searchEnd();
		return
	}

	$.ajax({
		type: 'GET',
		url: 'http://ameblo.jp/' + searchId + '/reader-' + pageNum
			+ '.html',
		dataType: 'html',
		success: function (data) {
			var $lists = $(data).find('ul.contentsList li');

			if ($lists.length == 0) {
				var $lists = $(data).find('ul[data-uranus-component="readersList"] li');
			}

			var userList = [];
			$lists.each(function () {
				var userId = $(this).find('a').attr('href').replace(/\//g, "");

				userList.push({
					id: userId,
					request: 'unrequest',
					peta: 'unpeta',
					iine: 'ungood'
				});

				$('#serchResultList').append('<li>' + userId + '</li>');
			});

			MyList.addUserList(userList, activeListNum);
			Search.doneSearch();
		}, error: function (data) {
			alert('アメーバへの接続に失敗しました。\nインターネットの接続状態を確認して下さい。');
			Search.searchEnd();
		}
	});
}

Search.notFindReader = function () {
	alert('[' + searchId + ']は読者がいません');
	Search.searchEnd();
}

Search.searchEnd = function () {
	onProcess = false;

	$('#searchStatus').text('');
	$('#searchPopup .progress-bar').attr('style', 'width:0%').attr('aria-valuenow', 0).text('');
	$('#searchPopup .load').toggle(false);

	var $inputId = $('#searchId');
	$inputId.prop('disabled', false);
	$inputId.val('');

	$('#search_submit').prop('disabled', false);

	$('#serchResultList').empty();

	var $cancelBtn = $('#search_cancel');
	$cancelBtn.off('click');
	$cancelBtn.on('click', Popup.closePopup);

	Layout.createUserHTML(activeListNum);

	Popup.closePopup();
}