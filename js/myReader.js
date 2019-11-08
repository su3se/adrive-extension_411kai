MyReader.saveReaders = function (list) {
    localStorage.setItem('myReader', JSON.stringify(list));
    return;
}

MyReader.getReaders = function () {
    return JSON.parse(localStorage.getItem('myReader'));
}

MyReader.saveYourReaders = function (list) {
    localStorage.setItem('yourReader', JSON.stringify(list));
    return;
}

MyReader.getYourReaders = function () {
    return JSON.parse(localStorage.getItem('yourReader'));
}

MyReader.setMaintenanceReaders = function () {
    var myReader = MyReader.getReaders();
    var yourReader = MyReader.getYourReaders();

    var diffReadersList = myReader.filter(function (item, index) {
        var flg = true;

        for (var i in yourReader) {
            if (yourReader[i] == item.id) {
                flg = false;
                break;
            }
        }

        if (flg) {
            return true;
        }
    });

    var targetList = diffReadersList.filter(function (item, index) {
        var flg = true;

        for (var i in yourReader) {
            if (yourReader[i] == item.id) {
                flg = false;
                break;
            }
        }

        if (flg) {
            return true;
        }
    });


    MyReader.saveMaintenanceReaders(targetList);

    return targetList;
}

MyReader.saveMaintenanceReaders = function (list) {
    localStorage.setItem('maintenanceReader', JSON.stringify(list));
    return;
}

MyReader.getMaintenanceReaders = function () {
    return JSON.parse(localStorage.getItem('maintenanceReader'));
}