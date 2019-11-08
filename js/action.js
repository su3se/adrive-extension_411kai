/**
 * タブクリック時の表示変更
 */
Action.changeActiveList = function () {
	// タブクリック時のクリックアクション
	$('#tabList li.tlist').on('click', function (e) {
		// 現在のアクティブタブのクラスを削除
		$('#tab' + activeListNum).removeClass('tab-active');
		// 現在のアクティブユーザリストを隠すクラスを追加
		$('#userList' + activeListNum).addClass('elm-invisible');
		// 次のタブ番号
		var nextTabNum = e.target.getAttribute('id').match(/tab(\d+)/)[1];
		// クリックされたタブにアクティブタブクラスを追加
		$('#tab' + nextTabNum).addClass('tab-active');
		// 現在のアクティブユーザリストのクラスを隠すクラスを削除
		$('#userList' + nextTabNum).removeClass('elm-invisible');
		// アクティブリストをクリックされたタブへ変更
		activeListNum = nextTabNum;
		Layout.createUserHTML(activeListNum);
		// 検索ナビボタンをクリック
		$('#searchNav').click();
	});
}

/**
 * ユーザ列テーブルクリック時のアクション
 */
Action.changeCheck = function () {
	var is = $(this).is(':checked');
	$('input[name="userCheck"]').each(function () {
		// チェック済みの時、
		if (is) {
			// チェックを付ける
			$(this).prop('checked', true);
		} else {
			// チェックを外す
			$(this).prop('checked', false);
		}
	});
}


Action.changeNav = function () {
	activePageNum = 0;

	$('div#nav .nav_selected').removeClass('nav_selected');
	$(this).addClass('nav_selected');

	var navId = $(this).attr('id');

	if (navId == 'searchNav' || navId == 'actionNav') {
		$('div#userListMgr').toggle(true);
		$('div#readerMgr').toggle(false);
		if (navId == 'searchNav') {
			$('#userListMgr .actionbar .searchIconG').toggle(true);
			$('#userListMgr div.actionbar .actionIcon').toggle(false);
			$('#actionLimit').toggle(false);
		} else if (navId == 'actionNav') {
			$('#userListMgr .actionbar .searchIconG').toggle(false);
			$('#userListMgr .actionbar .actionIcon').toggle(true);
			$('#actionLimit').toggle(true);
		}
		Layout.reloadLayout();
		return;
	} else if (navId = 'maintenanceNav') {
		$('#userList').empty();
		$('#userListMgr').toggle(false);
		$('#readerMgr').toggle(true);
		Layout.createReaderHTML();
		Popup.rdRefreshPopup();
	}
}

Action.viewPrevList = function () {
	activePageNum = activePageNum - 1;

	if (activePageNum == 0) {
		$('#prevbtn').toggle(false);
	}

	$('#nextbtn').toggle(true);

	var navId = $('.nav_selected').attr('id');

	if (navId == 'requestNav') {
		Layout.reloadLayout('req');
	} else if (navId == 'petaNav') {
		Layout.reloadLayout('peta');
	} else if (navId == 'iineNav') {
		Layout.reloadLayout('good');
	} else {
		Layout.createUserHTML(activeListNum);
	}
}

Action.viewNextList = function () {
	activePageNum = activePageNum + 1;

	if (activePageNum == 1) {
		$('#prevbtn').toggle(true);
	}

	var navId = $('.nav_selected').attr('id');

	if (navId == 'requestNav') {
		Layout.reloadLayout('req');
	} else if (navId == 'petaNav') {
		Layout.reloadLayout('peta');
	} else if (navId == 'iineNav') {
		Layout.reloadLayout('good');
	} else {
		Layout.createUserHTML(activeListNum);
	}
}