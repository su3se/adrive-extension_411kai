/*---------------------------
 Login Parameter
 --------------------------*/
var loginID = null;

/*---------------------------
 Search reader from ID Parameter
 --------------------------*/
// 読者検索用ページ番号
var pageNum = 0;
// ページ数
var pageCount = 0;
// 検索対象ID
var searchId = null;
// 検索ページの最大数
var PAGE_MAX = 500;

/*---------------------------
 Request Reader Parameter
 --------------------------*/
// 1日の読者申請の最大数
var READER_MAX = 50;
// 読者申請ターゲット
var reqTargets;
// 本日の読者申請のストレージ名
var todayReaderStorageName = null;
// 読者申請のターゲット数
var max_request_target;

/*---------------------------
 Peta Parameter
 --------------------------*/
// 1日の最大ペタ数
var PETA_MAX = 500;
// ペタターゲット
var petaTargets;
// 本日のペタ数の格納名
var todayPetaStorageName = null;
// ペタのターゲット数
var max_peta_target;

/*---------------------------
 Peta Parameter
 --------------------------*/
// 1日の最大いいね数
var IINE_MAX = 300;
// いいねターゲット
var iineTargets;
// 本日のいいね数の格納名
var todayIineStorageName = null;
// いいねターゲット数
var max_good_target;

/*---------------------------
 Maintenance
 --------------------------*/
var maintenanceTargets;

/*---------------------------
 Timeout time Parameter
 --------------------------*/
// タブのロード待ち時間
var TAB_LOAD_TIME = 2000;
// タブのスクリプト実行時間
var TAB_REMOVE_TIME = 2000;
// タブのロード待ち時間
var TAB_SEARCH_READER_TIME = 2000;
// いいねの完了待ち
var TAB_IINE_TIME = 2000;

/*---------------------------
 List Parameter
 --------------------------*/
// 現在選択中のリスト番号
var activeListNum = 0;
// 最大リスト数
var MAX_LIST = 10;

/*---------------------------
 Other Parameter
 --------------------------*/
// 本日のユーザー
var userToday = null;
// プロセスフラグ
var onProcess;
// スキップフラグ
var isSkip;
// 現在のタブ
var currentTab;
// 現在のID
var currentId;
// タブ内の最大ユーザー数
var MAX_USER = 500000;
// アクティブページ番号
var activePageNum = 0;
// 1ページに表示する最大ユーザー数
var MAX_LIST_NUM = 500;
// チェックフラグ
var onCheck;

/*---------------------------
 Script
 --------------------------*/
MyList = {};
Daily = {};
Popup = {};
Search = {};
Rename = {};
Delete = {};
Refresh = {};
Request = {};
Peta = {};
Good = {};
utils = {};
Action = {};
Layout = {};
RdRefresh = {};
MyReader = {};
Maintenance = {};
