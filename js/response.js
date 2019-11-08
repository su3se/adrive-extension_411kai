var response = [
	Request.resultClickAddReaderBtn,
	Request.inputForSpamImg,
	Request.executeCheckInput,
	Request.countTodayReaderReq,
	Request.alertWrongNumber,
	Good.articleNotFind,
	Good.countTodayIine,
	Good.skipIine,
	Maintenance.deleteComplete,
	Maintenance.tabError
];

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.fn <= 20) {
		response[request.fn](request.dt);
	}
});