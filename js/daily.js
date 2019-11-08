/*-----------------------
 daily data
 -----------------------*/

Daily.initDailyData = function () {
	userToday = loginID + 'today';
	todayReaderStorageName = loginID + 'dailyReader';
	todayPetaStorageName = loginID + 'dailyPeta';
	todayIineStorageName = loginID + 'dailyIine';

	// 日付を取得
	var date = new Date();
	var today = date.getDate();

	// 日が更新されいる時は、アクション情報を更新
	Daily.checkToday();

	// 初回ログイン時は初期化
	if (!localStorage[todayReaderStorageName] || !localStorage[todayPetaStorageName] || !localStorage[todayIineStorageName]) {
		Daily.clearDailyData();
	}

	// 揺らぎ時間を初期化
	if (!localStorage['begin']) {
		localStorage['begin'] = 8;
	} if (!localStorage['end']) {
		localStorage['end'] = 15;
	}

	console.log('ゆらぎ間隔' + localStorage['begin'] + '~' + localStorage['end']);
	console.log('today:', localStorage[userToday]);
	console.log('reader:', localStorage[todayReaderStorageName]);
	console.log('peta:', localStorage[todayPetaStorageName]);
	console.log('iine:', localStorage[todayIineStorageName]);
}

Daily.clearDailyData = function () {
	localStorage[todayReaderStorageName] = 0;
	localStorage[todayPetaStorageName] = 0;
	localStorage[todayIineStorageName] = 0;
	MyList.clearDailyData();
}

Daily.getDailyReaderNumber = function () {
	Daily.checkToday();
	return localStorage[todayReaderStorageName];
}

Daily.getDailyPetaNumber = function () {
	Daily.checkToday();
	return localStorage[todayPetaStorageName];
}

Daily.getDailyIineNumber = function () {
	Daily.checkToday();
	return localStorage[todayIineStorageName];
}

/*
 * 日付の更新を行う 
 */
Daily.checkToday = function () {
	// 日付を取得
	var today = new Date().getDate();

	// 日付が更新されている場合は、アクションデータの更新を実行する
	if (localStorage[userToday] != today) {
		localStorage[userToday] = today;
		Daily.clearDailyData();
	}
}