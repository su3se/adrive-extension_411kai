document.addEventListener("DOMContentLoaded", function() {
  $.ajax({
    type: "GET",
    url: "https://dauth.user.ameba.jp/accounts/login",
    dataType: "html",
    success: function( data ) {
      if( $(data).find("p.-name").length != 0 ){
        loginID = $( data ).find( "p.-name" ).text();
      } else {
        loginID = $( data ).find( ".PcProfile_Name" ).text();
      }

      resultLogin();
    },
    error: function(data) {
      alert( "アメーバへの接続に失敗しました。\nインターネットの接続状態を確認して下さい。" );
    }
  });
});

function resultLogin() {
  if (loginID) {
    afterLoginSettings();
    Layout.initLayout();
  } else {
    alert( "Amebaのログイン情報が取得出来ませんでした。\nAmebaへログイン後再度アクセスして下さい。" );
    location.href = "https://dauth.user.ameba.jp/accounts/login";
  }
}

function afterLoginSettings() {
  if (!MyList.getList(0)) {
    MyList.start();
  }

  $("span#loginUser").text(loginID);

  Daily.initDailyData();

  $("#nav li.nav_option").on("click", Action.changeNav);
  $("button#prevbtn").on("click", Action.viewPrevList);
  $("button#nextbtn").on("click", Action.viewNextList);
  $('input[name="allCheck"]').change(Action.changeCheck);

  Popup.searchPopup();
  $("#search_submit").on("click", Search.searchById);
  $("input#search_cancel").on("click", Popup.closePopup);

  Popup.renamePopup();
  $("#rename_submit").on("click", Rename.rename);
  $("input#rename_cancel").on("click", Popup.closePopup);

  Popup.deletePopup();
  $("input#delete_submit").on("click", Delete.deleteUser);
  $("input#delete_cancel").on("click", Popup.closePopup);

  Popup.refreshPopup();
  $("input#refresh_submit").on("click", Refresh.refreshUser);
  $("input#refresh_cancel").on("click", Popup.closePopup);

  Popup.requestPopup();
  $("a#requestLink").on("click", Request.drawReqList);
  $("input#request_submit").on("click", Request.readyForReader);
  $("input#request_cancel").on("click", Request.reqClose);
  $('input[name="reqSpamCheck"]').change(Request.reqSpamCheck);

  Popup.petaPopup();
  $("a#petaLink").on("click", Peta.drawPetaList);
  $("input#peta_submit").on("click", Peta.readyForPeta);
  $("input#peta_cancel").on("click", Peta.PetaClose);

  Popup.iinePopup();
  $("a#iineLink").on("click", Good.drawGoodList);
  $("input#iine_submit").on("click", Good.readyForIine);
  $("input#iine_cancel").on("click", Good.goodClose);

  Popup.rdRefreshPopup();
  $("input#rdRefresh_submit").on("click", RdRefresh.start);
  $("input#rdRefresh_cancel").on("click", Popup.closePopup);

  Popup.maintenancePopup();
  $("a#maintenanceLink").on("click", Maintenance.drawList);
  $("input#maintenance_submit").on("click", Maintenance.start);
  $("input#maintenance_cancel").on("click", Maintenance.close);
}
