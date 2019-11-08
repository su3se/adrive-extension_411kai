Peta.drawPetaList = function () {
	utils.drawCheckList('table#targetPetaTable', 'peta_table');
}

Peta.PetaClose = function () {
	$('tbody#peta_table').remove();
	Popup.closePopup();
}

Peta.readyForPeta = function () {
	$('#peta_submit').attr('disabled', true);
	var $cancelBtn = $('#peta_cancel');
	$cancelBtn.off('click');
	$cancelBtn.on('click', utils.processCancel);

	petaTargets = MyList.getPetaFilterList(activeListNum, utils.getCheckList());

	onProcess = true;
	isSkip = false;
	currentTab = null;
	max_peta_target = petaTargets.length;

	Peta.executePeta();
}

Peta.executePeta = function () {
	if (localStorage[todayPetaStorageName] >= PETA_MAX) {
		alert('本日のペタ数の上限に達しました。ペタを終了します。')
		Peta.petaEnd();
		return;
	}

	if (!onProcess) {
		alert('処理が中断されました。ペタ処理を終了します。');
		Peta.petaEnd();
		return;
	}

	var currentId = petaTargets[0];

	if (currentId == null || currentId == 'undifined') {
		Peta.petaEnd();
		return;
	}

	Peta.doPeta(currentId);
}

Peta.doPeta = function (id) {
	$.ajax({
		type: 'GET',
		url: 'http://peta.ameba.jp/p/addPeta.do?targetAmebaId=' + id + '&service=blog',
		dataType: 'html',
		success: function (data) {
			if ($(data).find('span.errorMessage').text() == '1日500ペタ以上つけることはできません') {
				localStorage[todayPetaStorageName] = PETA_MAX;
				alert('1日のペタ数の上限に達しました。\n処理を終了します。');
				Peta.petaEnd();
				return;
			};

			var $petaLink = $(data).find('#petaButton a');

			if ($petaLink.length == 0) {
				Peta.registerDeniedPeta();
				return;
			}

			var link = $petaLink.attr('href');

			if (link == null || link == 'undefined') {
				Peta.registerDeniedPeta();
				return;
			}

			var petaID = link.match(/petaId=(.*?)&/)[1];
			Peta.finishPeta(petaID);
		},
		error: function (data) {
			alert('アメーバへの接続に失敗しました。\n入力したユーザーIDをご確認下さい。');
			Peta.petaEnd();
		}
	});
}

Peta.finishPeta = function (petaID) {
	chrome.tabs.create({
		url: 'http://peta.ameba.jp/p/addPetaComplete.do?sig=&key=&service=blog&targetAmebaId='
			+ petaTargets[0] + '&petaId=' + petaID,
		selected: false
	}, function (tab) {
		currentTab = tab;
		var url = /peta\.ameba\.jp\/p\/addPetaComplete\.do/;
		executeOnTabWithUrl(tab, Peta.countTodayPeta, currentTab,
			url);
	});
}

Peta.countTodayPeta = function (currentTab) {
	chrome.tabs.get(currentTab.id, function (tab) {
		chrome.tabs.remove(tab.id);
		currentTab = null;
	});

	var num = parseInt(Daily.getDailyPetaNumber());
	num++;
	localStorage[todayPetaStorageName] = num;
	MyList.updateAllowedPeta(activeListNum, petaTargets[0]);

	Peta.nextPetaProcess();
}

Peta.registerDeniedPeta = function () {
	isSkip = true;
	MyList.updateDeniedPeta(activeListNum, petaTargets[0]);
	Peta.nextPetaProcess();
}

Peta.nextPetaProcess = function () {
	$('td#status_' + petaTargets[0]).text((isSkip) ? 'ペタ不可' : '完了');

	var nextPetas = petaTargets.filter(function (item, index) {
		if (index != 0)
			return true;
	});

	petaTargets = nextPetas;

	if (petaTargets.length == 0) {
		Peta.petaEnd();
		return;
	}

	var progress_rate = utils.getProgressRate(PETA_MAX, Daily.getDailyPetaNumber(), max_peta_target, petaTargets.length);
	$('#petaPopup .progress-bar').attr('style', 'width:' + progress_rate + '%').attr('aria-valuenow', progress_rate).text(progress_rate + '%');

	if (!onProcess) {
		alert('処理が中断されました。\nペタ処理を終了します。');
		Peta.petaEnd();
		return;
	}

	if (isSkip) {
		isSkip = false;
		Peta.executePeta();
	} else {
		var begin = parseInt(localStorage['begin']);
		var end = parseInt(localStorage['end']);
		var sleepTime = (Math.floor(Math.random() * (end - begin) + begin)) * 1000;
		setTimeout(Peta.executePeta, sleepTime);
	}
}

Peta.petaEnd = function () {
	onProcess = false;

	$('#petaPopup .progress-bar').attr('style', 'width:0%').attr('aria-valuenow', 0).text('');
	$('#peta_submit').attr('disabled', false);
	var $cancelBtn = $('#peta_cancel');
	$cancelBtn.off('click');
	$cancelBtn.on('click', Peta.PetaClose);

	$('#peta_table').remove();

	Layout.createUserHTML(activeListNum);
	Popup.closePopup();
}