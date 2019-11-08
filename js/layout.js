Layout.initLayout = function () {
	var $tabList = $('ul#tabList');

	for (var i = 0; i < MAX_LIST; i++) {
		$tabList.append('<a href="#"><li class="tlist" id="tab' + i + '">' +
			MyList.getListName(i) + '</li></a>');
	}

	Layout.createUserHTML(activeListNum);

	$('#tab' + activeListNum).addClass("tab-active");
	Action.changeActiveList();
}

Layout.createUserHTML = function (listNum) {
	var users = MyList.getUserList(activeListNum);

	var $userList = $('tbody#userList');
	$userList.empty();

	if (users == null) {
		$('.currentpage').text('0');
		$('#nextbtn,#prevbtn').toggle(false);
		$('.maxpage').text('/0');
		return;
	}

	$('#checkBoxAll').prop('checked', false);

	var userNum = Object.keys(users).length;
	$('.currentpage').text(activePageNum + 1);
	$('.maxpage').text('/' + Math.ceil(userNum / MAX_LIST_NUM) + '  (' + userNum + ')');
	$('#nextbtn').toggle(true);

	var newList = null;

	for (var i = activePageNum * MAX_LIST_NUM; i < MAX_LIST_NUM + activePageNum * MAX_LIST_NUM; i++) {
		if (users[i] == null) {
			$('#nextbtn').toggle(false);
			break;
		}

		var id = users[i].id;
		newList += '<tr id="user' + listNum + '_' + i + '" class="whole-check">'
			+ '<td class="center col_check"><input name="userCheck" type="checkbox"></td>'
			+ '<td class="userId col_id"><a href="https://ameblo.jp/' + id + '" target=”_blank”>' + id + '</a></td>'
			+ '<td class="col_action">' + utils.getPetaStr(users[i].peta) + '</td>'
			+ '<td class="col_action">' + utils.getIineStr(users[i].iine) + '</td>'
			+ '<td class="col_action">' + utils.getReqStr(users[i].request) + '</td>'
			+ '</tr>';
	}

	$userList.append(newList);
	$('#readerLimit').text('本日の読者申請数：' + Daily.getDailyReaderNumber() + ' /' + READER_MAX);
	$('#petaLimit').text('本日のペタ数：' + Daily.getDailyPetaNumber() + ' /' + PETA_MAX);
	$('#goodLimit').text('本日のいいね数：' + Daily.getDailyIineNumber() + ' /' + IINE_MAX);
}

Layout.reloadLayout = function () {
	$('ul#tabList').empty();
	$('tbody#userList').empty();
	Layout.initLayout();
}

Layout.createReaderHTML = function (listNum) {
	var users = MyReader.getMaintenanceReaders();

	var $readerList = $('tbody#readerList');
	$readerList.empty();

	if (users == null) {
		$('#rdRefreshLink').click();
		return;
	}

	var newList = null;
	var waitReaderNum = 0;

	$('#rdCheckBoxAll').prop('checked', false);

	var userNum = users.length;

	for (var i = 0; i < userNum; i++) {
		var id = users[i].id;
		var status = users[i].status;
		newList += '<tr id="reader_' + id + '" class="whole-check">'
			+ '<td class="center"><input name="userCheck" type="checkbox"></td>'
			+ '<td class="userId"><a href="https://ameblo.jp/' + id + '" target=”_blank”>' + id + '</a></td>'
			+ '<td class="readerStatus">' + utils.getReaderStatus(status) + '</td>'
			+ '</tr>';

		if (status == 'wait') {
			waitReaderNum++;
		}
	}

	$readerList.append(newList);
	$('span.openReader').text('承認済みユーザー:' + (userNum - waitReaderNum));
	$('span.waitReader').text('申請中ユーザー:' + waitReaderNum);
}