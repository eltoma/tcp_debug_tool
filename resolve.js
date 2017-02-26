/**
 * Created by elotoma on 2017/2/26.
 */

var check =  require('./check');
/**
 * 解析一帧数据，结构化为json
 * @param f
 * @return 结构化帧内容
 */
function reslv(f) {
    var frame = {};
    frame.oriConten = f;
    // remove start and end character
    f = f.substr(f.indexOf("$") + 1, f.length - 2);
    frame.addr = f.split(',')[0];
    frame.data = f.split(',').slice(1);
    var endPiece = frame.data.pop();
    endPiece = endPiece.substring(0, endPiece.indexOf("*"));
    frame.data.push(endPiece);
    frame.id = frame.data[0];
    frame.order = frame.data[1];
    if(frame.addr === 'LCDIN') {
        frame.ymd = frame.data[2];
        frame.hms = frame.data[3];
        frame.temperature = frame.data[4];
        frame.humidity = frame.data[5];
        frame.ua = frame.data[6];
        frame.ub = frame.data[7];
        frame.uc = frame.data[8];
        frame.ia = frame.data[9];
        frame.ib = frame.data[10];
        frame.ic = frame.data[11];
        frame.pa = frame.data[12];
        frame.pb = frame.data[13];
        frame.pc = frame.data[14];

        frame.activePower = frame.data[15];
        frame.reactivePower = frame.data[16];

        frame.powerFactor = frame.data[17];
        frame.acFreq = frame.data[18];
        frame.iRate = frame.data[19];
        frame.out = frame.data[20];
    }
    frame.chkSum = f.substring(f.indexOf("*") + 1, f.length);
    frame.rlChkSum = check.getCheckSum(f.substring(0, f.indexOf('*')));

    return frame;
}

exports.reslv = reslv;