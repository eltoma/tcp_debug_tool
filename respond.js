/**
 * Created by Tomato on 2017/2/26.
 */
var moment = require('moment');
var check = require('./check');

var yearMonthDate = moment().format('YYMMDD');//年月日
var hourMinSecond = moment().format('HHmmss');//时分秒
var day = moment().format('d');//星期

var message = {
    start:'$',
    address :'',
    id:'',
    order:'',
    ymd:yearMonthDate,
    hms:hourMinSecond,
    week:day,
    state:'',
    openTime:'1800',
    closeTime:'0800',
    asterisk:'*',
    checkSum:'',
    comma:',',
    end:'#'
};

//应答路灯控制器的登录请求
function reslog(id, order, isCheck) {
    var response;
    message.address = 'SELOA';
    message.id = id;
    message.order = order;

    //校验通过
    if (isCheck){
        //$SELOA,013612345678,0001,170220,161234,1,Y,1800,0800*hh#
     message.state = 'Y';
    }
    else {//校验未通过
        //$SELOA,013612345678,0001,170220,161234,1,A,0000,0000*hh#
     message.state = 'A';
    }
    response = message.address + message.comma + message.id + message.comma + message.order
             + message.comma + message.ymd+ message.comma + message.hms + message.comma +
             message.week + message.comma + message.state + message.comma + message.openTime +
             message.comma + message.closeTime;
    message.checkSum = check.getCheckSum(response);
    response = message.start + response + message.asterisk + message.checkSum + message.end;
    return response;
}

//应答路灯控制器的数据上传:$SEDIA,013612345678,0002,170220,201122,1,Y*hh#
function resdata(id, order, isCheck) {
    var response;
    message.address = 'SEDIA';
    message.id = id;
    message.order = order;
    //校验正确
    if (isCheck){
        message.state = 'Y';
    }
    else {
        message.state = 'A'
    }
    response = message.address + message.comma + message.id + message.comma + message.order
        + message.comma + message.ymd+ message.comma + message.hms + message.comma +
        message.week + message.comma + message.state ;
    message.checkSum = check.getCheckSum(response);
    response = message.start + response + message.asterisk + message.checkSum + message.end;
    return response;
}

exports.reslog = reslog;
exports.resdata = resdata;
//$SELOA,013612345678,0001,170220,161234,1,Y,1800,0800*hh#
// console.log(reslog('013612345678','0001',true));
//$SEDIA,013612345678,0002,170220,201122,1,Y*hh#
// console.log(resdata('013612345678','0002',true));
