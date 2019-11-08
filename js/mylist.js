// データリスト
MyList = {};

/*---------------------------
 MyList Object
 --------------------------*/

/**
 * リストの初期化
 */
MyList.start = function () {
	// 最大リスト数分繰り返す
	for (var i = 0; i < MAX_LIST; i++) {
		// ストレージにデータを保管
		MyList.setList(i, {
			listName: 'List' + (i + 1),
			userList: null
		});
	}
}

/**
 * ストレージに保存されたリストデータを取得
 */
MyList.getList = function (listNum) {
	return JSON.parse(localStorage.getItem('list' + listNum));
}

/**
 * ストレージに保存されたリストデータを取得
 */
MyList.getListName = function (listNum) {
	return JSON.parse(localStorage.getItem('list' + listNum)).listName;
}

/**
 * ストレージに保存されたリストデータを取得
 */
MyList.getUserList = function (listNum) {
	return JSON.parse(localStorage.getItem('list' + listNum)).userList;
}

/**
 * ストレージにリストデータを保存
 */
MyList.setList = function (listNum, data) {
	// ストレージにデータを保管
	localStorage.setItem('list' + listNum, JSON.stringify(data));
}

/**
 * ストレージにユーザデータを保存
 */
MyList.addUserList = function (newUsers, listNum) {
	var data = MyList.getList(listNum);

	if (data.userList == null) {
		data.userList = newUsers;
	} else {
		for (var user in newUsers) {
			data.userList.push(newUsers[user]);
		}
	}

	// ストレージにデータを保管
	MyList.setList(listNum, data);
}

/**
 * リスト名の変更 引数で得たリスト番号のリスト名を変更する
 * 
 * @param listNum
 *            変更するリストのリスト番号
 * @param newName
 *            変更後のリスト名
 */
MyList.changeListName = function (listNum, newName) {
	var data = MyList.getList(listNum);
	data.listName = newName;

	// ストレージにデータを保管
	MyList.setList(listNum, data);
}

/**
 * ストレージのユーザリスト削除
 * 
 * @param listNum
 *            タブ番号
 * @param deletData
 *            削除ユーザリスト
 */
MyList.deleteUserList = function (listNum, deleteData) {
	// ストレージからデータ取得
	var data = MyList.getList(listNum);
	var users = data.userList;

	// ユーザーリストが存在しない場合、処理を終了
	if (!users) {
		return;
	}

	// 削除データ以外のユーザーデータを取得
	var newUsers = users.filter(function (item, index) {
		var flag = true;
		for (var i in deleteData) {
			if (item.id == deleteData[i]) {
				flag = false;
				break;
			}
		}
		if (flag) {
			return true;
		}
	});
	// 新しいユーザーデータを保存
	data.userList = newUsers;

	// ストレージにデータを保管
	MyList.setList(listNum, data);
}

/**
 * 未リクエストリストを取得
 * 
 * @param listNum
 *            タブ番号
 */
MyList.getReqList = function (listNum) {
	// ストレージからデータ取得
	var data = MyList.getList(listNum);
	var users = data.userList;

	// ユーザーが存在しない場合は処理を終了
	if (!users) {
		return;
	}

	// 新しいユーザーデータ情報を取得
	var reqUsers = users.filter(function (item, index) {
		if (item.request == 'unrequest') {
			return true;
		}
	});

	return reqUsers;
}

/**
 * リスト内の未リクエストリストを取得
 * 
 * @param listNum
 *            タブ番号
 * @param idList
 *            対象リスト
 */
MyList.getReqFilterList = function (listNum, idList) {
	// ストレージからデータ取得
	var data = MyList.getList(listNum);
	var users = data.userList;

	// 新しいユーザーデータ情報を取得
	var reqUsers = users.filter(function (item, index) {
		for (var i in idList) {
			if (item.id == idList[i]) {
				return true;
			}
		}
	});

	// リクエストユーザーを初期化
	var targets = [];

	// リクエスト対象のIDのみを格納
	for (var i in reqUsers) {
		if (reqUsers[i].request == 'unrequest') {
			targets.push(reqUsers[i].id);
		}
	}

	return targets;
}

/**
 * 未ペタリストを取得
 * 
 * @param listNum
 *            タブ番号
 */
MyList.getPetaList = function (listNum) {
	// ストレージからデータ取得
	var data = MyList.getList(listNum);
	var users = data.userList;

	// ユーザーリストが存在しない場合、処理を終了
	if (!users) {
		return;
	}

	// 新しいユーザーデータ情報を取得
	var petaUsers = users.filter(function (item, index) {
		if (item.peta == 'unpeta') {
			return true;
		}
	});

	return petaUsers;
}

/**
 * リスト内の未ペタリストを取得
 * 
 * @param listNum
 *            タブ番号
 * @param idList
 *            対象リスト
 */
MyList.getPetaFilterList = function (listNum, idList) {
	// ストレージからデータ取得
	var data = MyList.getList(listNum);
	var users = data.userList;

	// ユーザーが存在しない場合、処理を終了
	if (!users) {
		return;
	}

	// 新しいユーザーデータ情報を取得
	var reqUsers = users.filter(function (item, index) {
		for (var i in idList) {
			if (item.id == idList[i]) {
				return true;
			}
		}
	});

	// リクエストユーザーを初期化
	var targets = [];

	// リクエスト対象のIDのみを格納
	for (var i in reqUsers) {
		if (reqUsers[i].peta == 'unpeta') {
			targets.push(reqUsers[i].id);
		}
	}

	return targets;
}

/**
 * リクエストデータの更新
 * 
 * @param listNum
 *            タブ番号
 * @param userId
 *            対象ユーザーID
 */
MyList.updateReq = function (listNum, userId) {
	if (!userId) {
		return;
	}

	// ストレージからデータ取得
	var data = MyList.getList(listNum);
	var users = data.userList;

	// ユーザーが存在しない場合、処理を終了
	if (!users) {
		return;
	}

	// 新しいユーザーデータ情報を取得
	var newUsers = users.filter(function (item, index) {
		if (item.id != userId) {
			return true;
		}
	});

	// 対象ユーザーデータ情報を取得
	var targetUser = users.filter(function (item, index) {
		if (item.id == userId) {
			return true;
		}
	});

	// ユーザーが存在しない場合、処理を終了
	if (!targetUser) {
		return;
	}

	// ユーザーデータ情報に更新データを追加する
	newUsers.push({
		id: targetUser[0].id,
		request: 'requested',
		peta: targetUser[0].peta,
		iine: targetUser[0].iine
	});

	// 新しいユーザーデータを保存
	data.userList = newUsers;

	// ストレージにデータを保管
	MyList.setList(listNum, data);
}

/**
 * ペタデータの更新
 * 
 * @param listNum
 *            タブ番号
 * @param userId
 *            対象ユーザーID
 */
MyList.updateAllowedPeta = function (listNum, userId) {
	// ストレージからデータ取得
	var data = MyList.getList(listNum);
	var users = data.userList;

	// ユーザーが存在しない場合、処理を終了
	if (!users) {
		return;
	}

	// 新しいユーザーデータ情報を取得
	var newUsers = users.filter(function (item, index) {
		if (item.id != userId) {
			return true;
		}
	});

	// 対象ユーザーデータ情報を取得
	var targetUser = users.filter(function (item, index) {
		if (item.id == userId) {
			return true;
		}
	});

	if (!targetUser) {
		return;
	}

	// ユーザーデータ情報に更新データを追加する
	newUsers.push({
		id: targetUser[0].id,
		request: targetUser[0].request,
		peta: 'petaed',
		iine: targetUser[0].iine
	});

	// 新しいユーザーデータを保存
	data.userList = newUsers;

	// ストレージにデータを保管
	MyList.setList(listNum, data);
}

/**
 * ペタデータの更新
 * 
 * @param listNum
 *            タブ番号
 * @param userId
 *            対象ユーザーID
 */
MyList.updateDeniedPeta = function (listNum, userId) {
	// ストレージからデータ取得
	var data = MyList.getList(listNum);
	var users = data.userList;

	// ユーザーが存在しない場合、処理を終了
	if (!users) {
		return;
	}

	// 新しいユーザーデータ情報を取得
	var newUsers = users.filter(function (item, index) {
		if (item.id != userId) {
			return true;
		}
	});

	// 対象ユーザーデータ情報を取得
	var targetUser = users.filter(function (item, index) {
		if (item.id == userId) {
			return true;
		}
	});

	// ユーザーデータ情報に更新データを追加する
	newUsers.push({
		id: targetUser[0].id,
		request: targetUser[0].request,
		peta: 'denied',
		iine: targetUser[0].iine
	});

	// 新しいユーザーデータを保存
	data.userList = newUsers;

	// ストレージにデータを保管
	MyList.setList(listNum, data);
}

/**
 * 未いいねリストを取得
 * 
 * @param listNum
 *            タブ番号
 */
MyList.getIineList = function (listNum) {
	// ストレージからデータ取得
	var data = MyList.getList(listNum);
	var users = data.userList;

	// ユーザーリストが存在しない場合、処理を終了
	if (!users) {
		return;
	}

	// 新しいユーザーデータ情報を取得
	var iineUsers = users.filter(function (item, index) {
		if (item.iine == 'ungood') {
			return true;
		}
	});

	return iineUsers;
}

/**
 * リスト内の未いいねリストを取得
 * 
 * @param listNum
 *            タブ番号
 * @param idList
 *            対象リスト
 */
MyList.getIineFilterList = function (listNum, idList) {
	// ストレージからデータ取得
	var data = MyList.getList(listNum);
	var users = data.userList;

	// ユーザーが存在しない場合、処理を終了
	if (!users) {
		return;
	}

	// 新しいユーザーデータ情報を取得
	var reqUsers = users.filter(function (item, index) {
		for (var i in idList) {
			if (item.id == idList[i]) {
				return true;
			}
		}
	});

	// リクエストユーザーを初期化
	var targets = [];

	// リクエスト対象のIDのみを格納
	for (var i in reqUsers) {
		if (reqUsers[i].iine == 'ungood') {
			targets.push(reqUsers[i].id);
		}
	}

	return targets;
}

/**
 * いいねデータの更新
 * 
 * @param listNum
 *            タブ番号
 * @param userId
 *            対象ユーザーID
 */
MyList.updateAllowedIine = function (listNum, userId) {
	// ストレージからデータ取得
	var data = MyList.getList(listNum);
	var users = data.userList;

	// ユーザーが存在しない場合、処理を終了
	if (!users) {
		return;
	}

	// 新しいユーザーデータ情報を取得
	var newUsers = users.filter(function (item, index) {
		if (item.id != userId) {
			return true;
		}
	});

	// 対象ユーザーデータ情報を取得
	var targetUser = users.filter(function (item, index) {
		if (item.id == userId) {
			return true;
		}
	});

	if (!targetUser) {
		return;
	}

	// ユーザーデータ情報に更新データを追加する
	newUsers.push({
		id: targetUser[0].id,
		request: targetUser[0].request,
		peta: targetUser[0].peta,
		iine: 'gooded'
	});

	// 新しいユーザーデータを保存
	data.userList = newUsers;

	// ストレージにデータを保管
	MyList.setList(listNum, data);
}

/**
 * デイリーデータをクリア
 */
MyList.clearDailyData = function () {
	for (var i = 0; i < MAX_LIST; i++) {
		// ストレージからデータ取得
		var data = MyList.getList(i);

		// リストデータが存在していない場合、スキップ
		if (!data) {
			continue;
		}

		var users = data.userList;

		// ユーザーリストが存在していない場合、スキップ
		if (!users) {
			continue;
		}

		// ペタ済み以外のユーザーデータ情報を取得
		var newUsers = users.filter(function (item, index) {
			if (item.peta != 'petaed' && item.iine != 'gooded') {
				return true;
			}
		});

		// ペタ済みユーザーデータ情報を取得
		var targetUser = users.filter(function (item, index) {
			if (item.peta == 'petaed' || item.iine == 'gooded') {
				return true;
			}
		});

		// ペタ済みユーザーが存在していない場合、スキップ
		if (!targetUser) {
			continue;
		}

		for (var j in targetUser) {
			// ユーザーデータ情報に更新データを追加する
			newUsers.push({
				id: targetUser[j].id,
				request: targetUser[j].request,
				peta: 'unpeta',
				iine: 'ungood'
			});
		}

		// 新しいユーザーデータを保存
		data.userList = newUsers;

		// ストレージにデータを保管
		MyList.setList(i, data);
	}
}

MyList.getUserListNum = function (listNum) {
	var userList = MyList.getUserList(listNum);
	if (userList == null) {
		return 0;
	}
	return Object.keys(MyList.getUserList(listNum)).length;
}

/**
 * ユーザーデータの重複更新
 * 
 * @param listNum
 *            タブ番号
 * @param userId
 *            対象ユーザーID
 */
MyList.refreshData = function (listNum) {
	// ストレージからデータ取得
	var data = MyList.getList(listNum);
	var users = data.userList;

	// ユーザーが存在しない場合、処理を終了
	if (!users) {
		return;
	}

	// カウンタ初期化
	var count = 0;
	// 対象ユーザーデータ情報を取得
	var newUsers = users.filter(function (item, index) {
		var flag = true;
		for (var i = count + 1; i < Object.keys(users).length; i++) {
			if (users[i].id == item.id) {
				flag = false;
				break;
			}
		}
		count++;
		if (flag) {
			return true;
		}
	});

	// 新しいユーザーデータを保存
	data.userList = newUsers;

	// ストレージにデータを保管
	MyList.setList(listNum, data);
}