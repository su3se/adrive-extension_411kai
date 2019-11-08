Good.drawGoodList = function () {
	utils.drawCheckList('table#targetGoodTable', 'good_table');
}

Good.goodClose = function () {
	$('tbody#good_table').remove();
	Popup.closePopup();
}

Good.readyForIine = function () {
	$('#iine_submit').attr('disabled', true);
	var $cancelBtn = $('#iine_cancel');
	$cancelBtn.off('click');
	$cancelBtn.on('click', utils.processCancel);

	iineTargets = MyList.getIineFilterList(activeListNum, utils.getCheckList());

	onProcess = true;
	isSkip = false;
	currentTab = null;
	max_good_target = iineTargets.length;

	Good.executeIine();
}

Good.executeIine = function () {
	if (localStorage[todayIineStorageName] >= IINE_MAX) {
		alert('本日のいいね数の上限に達しました。いいねを終了します。\n※有料版はアメブロが上限としている300件/日のいいねが可能です。')
		Good.iineEnd();
		return;
	}

	if (!onProcess) {
		alert('処理が中断されました。\nいいね処理を終了します。');
		Good.iineEnd();
		return;
	}

	currentId = iineTargets[0];

	if (currentId == null || currentId == 'undefined') {
		Good.iineEnd();
		return;
	}

	Good.doIine(currentId);
}

Good.doIine = function (id) {
	$.ajax({
		type: 'GET',
		url: 'http://profile.ameba.jp/ameba/' + id,
		dataType: 'html',
		success: function (data) {
			if ($(data).find('ul.blog__list').length == 0) {
				Good.articleNotFind();
				return;
			}

			Good.resultSearchNewArticle($(data).find('ul.blog__list a.link').attr('href'));
		},
		error: function (data) {
			alert('アメーバへの接続に失敗しました。\n入力したユーザーIDをご確認下さい。');
			Good.iineEnd();
		}
	});
}

Good.articleNotFind = function () {
	$('td#status_' + iineTargets[0]).text('いいね不可');
	isSkip = true;
	utils.removeTab();
	Good.nextIineProcess();
}

Good.resultSearchNewArticle = function (articleUrl) {
	if (!onProcess) {
		alert('処理が中断されました。\nいいね処理を終了します。');
		Good.iineEnd();
		return;
	}

	chrome.tabs.create({
		url: articleUrl,
		selected: true
	}, function (tab) {
		currentTab = tab;
		executeOnTab(tab, Good.clickAddIineBtn, tab);
	});
}

Good.skipIine = function () {
	chrome.tabs.get(currentTab.id, function (tab) {
		chrome.tabs.remove(tab.id);
		currentTab = null;
	});

	isSkip = true;

	$('td#status_' + iineTargets[0]).text('既にいいね済み');

	Good.nextIineProcess();
}

Good.countTodayIine = function () {
	setTimeout(function () {
		chrome.tabs.get(currentTab.id, function (tab) {
			chrome.tabs.remove(tab.id);
			currentTab = null;
		});
	}, TAB_IINE_TIME);

	var num = parseInt(Daily.getDailyIineNumber());
	num++;
	localStorage[todayIineStorageName] = num;

	$('td#status_' + iineTargets[0]).text('完了');

	Good.nextIineProcess();
}

Good.nextIineProcess = function () {
	MyList.updateAllowedIine(activeListNum, iineTargets[0]);

	var nextIine = iineTargets.filter(function (item, index) {
		if (index != 0)
			return true;
	});

	iineTargets = nextIine;

	if (iineTargets.length == 0) {
		Good.iineEnd();
		return;
	}

	var progress_rate = utils.getProgressRate(IINE_MAX, Daily.getDailyIineNumber(), max_good_target, iineTargets.length);
	$('#iinePopup .progress-bar').attr('style', 'width:' + progress_rate + '%').attr('aria-valuenow', progress_rate).text(progress_rate + '%');

	if (!onProcess) {
		alert('処理が中断されました。\nいいね処理を終了します。');
		Good.iineEnd();
		return;
	}

	if (isSkip) {
		isSkip = false;
		var sleepTime = (Math.floor(Math.random() * (parseInt(localStorage['end']) - parseInt(localStorage['begin'])) + parseInt(localStorage['begin']))) * 500;
		setTimeout(Good.executeIine, sleepTime);
		return;
	}

	var sleepTime = (Math.floor(Math.random() * (parseInt(localStorage['end']) - parseInt(localStorage['begin'])) + parseInt(localStorage['begin']))) * 1000;
	setTimeout(Good.executeIine, sleepTime);
}

Good.iineEnd = function () {
	onProcess = false;

	$('#iinePopup .progress-bar').attr('style', 'width:0%').attr('aria-valuenow', 0).text('');

	$('#iine_submit').attr('disabled', false);
	var $cancelBtn = $('#iine_cancel');
	$cancelBtn.off('click');
	$cancelBtn.on('click', Good.goodClose);

	$('tbody#good_table').remove();

	Layout.createUserHTML(activeListNum);
	Popup.closePopup();
}

Good.clickAddIineBtn = function (tab) {
	chrome.tabs.executeScript(parseInt(tab.id), {
		code: 'clickAddIineBtn();'
	});
}