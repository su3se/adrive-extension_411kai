/*
 * セレクトユーザーのテーブル描画
 */
Request.drawReqList = function() {
  utils.drawCheckList("table#targetReaderTable", "req_table");
};

/*
 * キャンセルボタンクリック時アクション
 */
Request.reqClose = function() {
  $("tbody#req_table").remove();
  Popup.closePopup();
};

/*
 * スパン画像スキップフラグチェック
 */
Request.reqSpamCheck = function() {
  // チェックフラグの値を取得
  onCheck = $(this).is(":checked") ? true : false;
};

/*
 * 自動読者申請の初期化を実行
 */
Request.readyForReader = function() {
  // サブミットボタンを入力不可にする
  $("#request_submit").attr("disabled", true);
  // キャンセルボタン押下時に処理を強制終了
  $("#request_cancel")
    .off("click")
    .on("click", Request.quiteReq);

  // ポップアップ内のレイアウト変更
  $("#requestPopup .pcontent_max")
    .removeClass("pcontent_max")
    .addClass("pcontent_req");

  // スパム画像の入力項目を表示する
  $("#spam-img-wrapper").toggle(true);

  // ターゲットを取得
  reqTargets = utils.getCheckList();

  // パラメータの初期化
  onProcess = true;
  max_request_target = reqTargets.length;

  // 自動処理開始
  Request.executeReq();
};

/*
 * 自動読者申請を実行
 */
Request.executeReq = function() {
  // キャンセルが押されたら強制終了
  if (!onProcess) {
    Request.reqEnd();
    return;
  }

  // 読者申請数が上限に達してる場合、強制終了
  if (READER_MAX <= localStorage[todayReaderStorageName]) {
    alert("本日のフォロー数の上限に達しています");
    Request.reqEnd();
    return;
  }

  // 現在の読者IDを初期化
  var currentId = reqTargets[0];

  // 現在の読者IDが存在しない時、終了
  if (!currentId) {
    Request.reqEnd();
    return;
  }

  // 現在の読者IDへ読者申請を開始
  Request.doReader(currentId);
};

/*
 * 読者への読者申請を実行
 */
Request.doReader = function(id) {
  // 読者申請が可能かをサイトのHTMLからチェックする
  $.ajax({
    type: "GET",
    url: "http://blog.ameba.jp/reader.do?bnm=" + id,
    dataType: "html",
    success: function(data) {
      var $regist02 = $(data).find("#regist_02");

      // 読者申請を実行
      if (!$regist02.hasClass("rd-off")) {
        Request.openReaderReq(id);
        return;
      }

      var $error = $regist02.find(".rd-error .error");

      // 既に読者申請済みの為、スキップ
      if ($error.length == 0) {
        Request.skipRequest("already");
        return;
      }

      // 読者申請を許可していない為、スキップ
      if ($error.text() == "\n1日に読者登録できる上限を超えました。\n") {
        Request.upperLimit();
      }

      Request.skipRequest("disable");
    },
    error: function() {
      alert(
        "フォローページへの接続に失敗しました。\nネットワーク状況をご確認下さい。"
      );
      Request.searchEnd();
    }
  });
};

/*
 * 読者申請用の新規タブを開く
 */
Request.openReaderReq = function(id) {
  // キャンセルボタンが押下された時は、強制終了
  if (!onProcess) {
    alert("処理が中断されました。\nフォローを終了します。");
    Request.reqEnd();
    return;
  }

  // 新規タブを開き、追加ボタンをクリック
  chrome.tabs.create(
    {
      url: "http://blog.ameba.jp/reader.do?bnm=" + id,
      selected: false
    },
    function(tab) {
      currentTab = tab;
      executeOnTab(tab, Request.clickAddReaderBtn, tab);
    }
  );
};

/*
 * 追加ボタンを読者ページタブでクリック
 */
Request.clickAddReaderBtn = function(tab) {
  chrome.tabs.executeScript(parseInt(tab.id), {
    code: "clickAddReaderBtn();"
  });
};

/*
 * 追加ボタンクリック後の処理
 */
Request.resultClickAddReaderBtn = function() {
  // キャンセルボタンが押下されたら、強制終了
  if (!onProcess) {
    utils.removeTab();
    alert("処理が中断されました。\nフォローを終了します。");
    Request.reqEnd();
    return;
  }

  // URLを取得
  var url = /blog\.ameba\.jp\/readerend\.do/;

  // 画面推移後のタブ内容チェックを実行
  executeOnTabWithUrl(
    currentTab,
    Request.completeReaderRequest,
    currentTab,
    url
  );
};

/*
 * 画面推移後のタブチェックを実行
 */
Request.completeReaderRequest = function(tab) {
  chrome.tabs.executeScript(parseInt(tab.id), {
    code: "completeReaderRequest();"
  });
};

/*
 * 本日の読者申請数を進める 
 */
Request.countTodayReaderReq = function() {
  // タブの削除
  setTimeout(function() {
    chrome.tabs.get(currentTab.id, function(tab) {
      chrome.tabs.remove(tab.id);
      currentTab = null;
    });
  }, TAB_IINE_TIME);

  // 本日の読者申請数を取得
  localStorage[todayReaderStorageName] =
    parseInt(Daily.getDailyReaderNumber()) + 1;
  // カラムにステータスを出力
  $("td#status_" + reqTargets[0]).text("完了");

  // 次のプロセスへ進む
  Request.nextReqProcess();
};

/*
 * スパム画像の出力と入力UI制御
 */
Request.inputForSpamImg = function(src) {
  // プロセスフラグがオフの場合、強制終了
  if (!onProcess) {
    Request.reqEndAfterRemoveTab();
    Request.reqEnd();
    return;
  }
  // スパム画像チェックフラグがオフの時はスキップする
  else if (onCheck) {
    utils.removeTab();
    Request.skipRequest("spam");
    return;
  }

  // 画像をAD画面に出力
  $("#spam-img").attr("src", src);
  $("#spam-img-input").focus();

  // ボタンセレクタを取得
  var $btn = $("#spam-img-input-btn");

  // キャンセルボタンクリック時は強制終了
  $btn.off("click").on("click", Request.tmpFnForSubmit);
  $("#request_cancel").on("click", Request.reqEndAfterRemoveTab);

  // Enterキークリック時にボタン押下を実行
  $("#spam-img-input").on("keydown", function(e) {
    if (e.keyCode === 13) {
      $btn.trigger("click");
    }
  });
};

/*
 * スパム画像入力データの送信を実行
 */
Request.tmpFnForSubmit = function() {
  // 数字以外が入力されている時は、書き直し
  if (isNaN($("#spam-img-input").val())) {
    alert("数字以外の文字が入力されています。\n数字のみを入力してください。");
    return;
  }

  // クリックトリガー及びキーダウントリガーをキャンセル
  $("#request_cancel")
    .off("click")
    .on("click", Request.quiteReq);
  $("#spam-img-input").off("keydown");

  // スパム画像を非表示にする
  $("#spam-img").attr("src", "");

  // URLを初期化
  var url = /blog\.ameba\.jp\/reader.*end\.do/;

  // タブでボタンクリックを実行
  executeOnTabWithUrl(
    currentTab,
    function() {
      Request.clickSubmit(currentTab);
    },
    currentTab,
    url
  );
};

Request.clickSubmit = function(tab) {
  var $input = $("input#spam-img-input");
  var inputNum = $input.val();
  $input.val("");

  chrome.tabs.executeScript(parseInt(tab.id), {
    code: "clickSubmit(" + inputNum + ");"
  });
};

Request.executeCheckInput = function() {
  var url = /blog\.ameba\.jp\/reader.*end\.do/;

  setTimeout(function() {
    executeOnTabWithUrl(
      currentTab,
      function() {
        Request.checkInput(currentTab);
      },
      currentTab,
      url
    );
  }, TAB_LOAD_TIME);
};

Request.checkInput = function(tab) {
  chrome.tabs.executeScript(parseInt(tab.id), {
    code: "checkInput();"
  });
};

Request.alertWrongNumber = function(src) {
  alert("入力した数字が違います。再度入力して下さい");
  Request.inputForSpamImg(src);
};

/*
 * スキップ処理
 */
Request.skipRequest = function(status) {
  // テキストを初期化
  var status_text;

  // ステータスによりテキストの出力内容を変える
  if (status == "already") {
    status_text = "リクエスト済み";
  } else if (status == "spam") {
    status_text = "スパム対策ユーザーのためスキップ";
  } else {
    status_text = "申請不可";
  }

  // カラム内にテキストを出力
  $("td#status_" + reqTargets[0]).text(status_text);

  // 次のプロセスへ進む
  Request.nextReqProcess();
};

Request.upperLimit = function() {
  utils.removeTab();
  alert("フォロー数が1日の上限数に達しました。\n処理を終了します。");
  localStorage[todayReaderStorageName] = READER_MAX;
  Request.reqEnd();
  return;
};

/*
 * 次の読者申請へ進む
 */
Request.nextReqProcess = function() {
  // ペタ内容をアップグレードする
  MyList.updateReq(activeListNum, reqTargets[0]);

  // 新規読者ターゲットを取得
  var nextReqs = reqTargets.filter(function(item, index) {
    if (index != 0) return true;
  });
  reqTargets = nextReqs;

  // 読者ターゲットが存在しなかったら、処理を終了
  if (reqTargets.length == 0) {
    Request.reqEnd();
    return;
  }

  // 進行状況レートを取得
  var progress_rate = utils.getProgressRate(
    READER_MAX,
    Daily.getDailyReaderNumber(),
    max_request_target,
    reqTargets.length
  );

  // 進行状況を更新
  $("#requestPopup .progress-bar")
    .attr("style", "width:" + progress_rate + "%")
    .attr("aria-valuenow", progress_rate)
    .text(progress_rate + "%");

  // ゆらぎ数を取得
  var begin = parseInt(localStorage["begin"]);
  var end = parseInt(localStorage["end"]);
  var sleepTime = Math.floor(Math.random() * (end - begin) + begin) * 800;

  // 時間を置いてから次の読者申請を実行
  setTimeout(Request.executeReq, sleepTime);
};

Request.reqEndAfterRemoveTab = function() {
  utils.removeTab();
  $("#request_cancel").off("click");
  $("#spam-img-wrapper").toggle();
  alert("処理が中断されました。\nフォローを終了します。");
  Request.reqEnd();
  return;
};

Request.quiteReq = function() {
  onProcess = true;
  alert("処理が中断されました。\nフォローを終了します。");
  Request.reqEnd();
  return;
};

/*
 * 読者申請の終了処理
 */
Request.reqEnd = function() {
  // パラメータをリセット
  onProcess = false;

  // 進行状況を初期化
  $("#requestPopup .progress-bar")
    .attr("style", "width:0%")
    .attr("aria-valuenow", 0)
    .text("");

  // レイアウトを初期化
  $("#spam-img-wrapper").toggle(false);
  $("#requestPopup .pcontent_req")
    .removeClass("pcontent_req")
    .addClass("pcontent_max");

  // ボタンを初期化
  $("#request_submit").attr("disabled", false);
  $("input#request_cancel")
    .off("click")
    .on("click", Request.reqClose);

  // 読者申請用テーブルを削除
  $("#req_table").remove();
  // チェックを外す
  utils.checkClear();
  // ユーザーテーブルを描画し直し
  Layout.createUserHTML(activeListNum);
  // ポップアップを閉じる
  Popup.closePopup();
};
