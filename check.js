function getCheckSum(strData){
    var bufData = new Buffer(strData, "ascii");
    var checkResult = bufData.readInt8(0);

    for(var i=1;i < bufData.length;i++)
    {

        // console.log('1:' + checkResult.toString('2'));
        checkResult = checkResult^bufData[i];
       // console.log('2:' + bufData.readInt8(i).toString('2'));
       //  console.log('3:' + checkResult.toString('2'));
    }
    return checkResult.toString('16');
}
exports.getCheckSum = getCheckSum;

