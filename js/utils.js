// タブのロード完了を待ち、スクリプトを実行
function executeOnTab(tab, fn, param) {
	// 該当のタブ情報を取得
	chrome.tabs.get(tab.id, function (tab) {
		// タブのロードが完了したら、関数を実行
		if (tab.status == 'complete') {
			if (param == null)
				fn();
			else
				fn(param);
		} else { // タブがロード中の時、
			setTimeout(function () {
				executeOnTab(tab, fn, param);
			}, TAB_LOAD_TIME);
		}

	});
}

function executeOnTabWithUrl(tab, fn, param, url) {

	chrome.tabs.get(tab.id, function (tab) {

		if (tab.url.match(url)) {
			if (tab.status === 'complete') {
				if (param === null)
					fn();
				else
					fn(param);
			} else {
				setTimeout(function () {
					executeOnTabWithUrl(tab, fn, param, url);
				}, TAB_LOAD_TIME);
			}
		} else {
			setTimeout(function () {
				executeOnTabWithUrl(tab, fn, param, url);
			}, TAB_LOAD_TIME);
		}

	});
}

utils.getCheckList = function () {
	var data = [];
	$('tbody input:checked').parent().next().each(
		function () {
			data.push(this.innerText);
		});

	return data;
}

utils.drawCheckList = function (selector, id) {
	var targets = utils.getCheckList();

	if (id == 'peta_table') {
		targets = MyList.getPetaFilterList(activeListNum, targets);
	} else if (id == 'good_table') {
		targets = MyList.getIineFilterList(activeListNum, targets);
	}

	if (targets.length == 0) {
		alert('IDが選択されていません。');
		Popup.closePopup();
		return;
	}

	var tableDom = null;

	targets.forEach(function (value) {
		tableDom += '<tr>'
			+ '<td>' + value + '</td>'
			+ '<td class="done" id="status_' + value + '"></td>'
			+ '</tr>';
	});

	$(selector).append('<tbody id="' + id + '">' + tableDom + '</tbody>');
}

/**
 * キャンセル時処理
 */
utils.processCancel = function () {
	onProcess = false;
}

/**
 * 処理ストップ
 */
utils.removeTab = function () {
	// 現在表示されているタブを閉じる
	if (currentTab != null) {
		chrome.tabs.get(currentTab.id, function (tab) {
			chrome.tabs.remove(tab.id);
		});
		currentTab = null;
	}
}

/**
 * 全てのチェック項目を外す
 */
utils.checkClear = function () {
	$('input[name="userCheck"]').each(function () {
		// チェックを外す
		$(this).prop('checked', false);
	});
}

utils.getReqStr = function (data) {
	var str;
	if (data == 'unrequest') {
		str = '未申請';
	} else {
		str = '申請済み';
	}
	return str;
}
utils.getPetaStr = function (data) {
	var str;
	if (data == 'unpeta') {
		str = '未ペタ';
	} else if (data == 'petaed') {
		str = 'ペタ済み';
	} else {
		str = 'ペタ不可';
	}
	return str;
}
utils.getIineStr = function (data) {
	var str;
	if (data == 'ungood') {
		str = '未いいね';
	} else if (data == 'gooded') {
		str = 'いいね済み';
	}
	return str;
}
utils.getReaderStatus = function (data) {
	var str;
	if (data == 'open') {
		str = '承認済み';
	} else if (data == 'wait') {
		str = '申請中';
	}
	return str;
}

function inputEnter(code) {
	if (code == 13) {
		alert("test");
	}
}

/**
 * 残りレートを取得
*/
utils.getProgressRate = function (DAY_MAX_COUNT, day_now_count, TARGET_MAX_COUNT, targets_remaining_count) {
	var rate;
	// 本日の残りアクション数を取得
	var day_remaining_count = DAY_MAX_COUNT - day_now_count;
	// 現在のターゲットカウントを取得
	var target_now_count = TARGET_MAX_COUNT - targets_remaining_count;

	// 残りターゲット数が本日の制限より少ない時は、通常の計算を行う
	if (targets_remaining_count < day_remaining_count) {
		rate = Math.round(target_now_count / TARGET_MAX_COUNT * 100);
	} else {
		rate = Math.round(target_now_count / (day_remaining_count + target_now_count) * 100);
	}

	return rate;
}