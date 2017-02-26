var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var net = require('net');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var RECPORT = 6969;  // 接受下位机数据的端口
var WSPORT = 3000;   // 网页显示的服务端口(websocket server)

const BUFFER_SIZE = 1000;
var CircleQueue = require('./CircleQueue');
var cqBuffer = new CircleQueue();
cqBuffer.initQueue(BUFFER_SIZE);

var  resolve = require('./resolve');
var res = require('./respond');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express').static(path.join(__dirname, 'public')));


// 响应调试信息显示页面请求
app.get('/debug', function(req, res) {
    console.log(__dirname);
    res.sendFile(__dirname + '/show.html');
});

// 调试信息显示服务器开始监听
http.listen(WSPORT, function(){
  console.log('websocket server listening on *:'+ WSPORT + '...\n');
});

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
var server = net.createServer(function(sock) {
    // 获得一个连接 - 该连接自动关联一个socket对象
    console.log('\nTCP CONNECTED With: ' + sock.remoteAddress + ':' + sock.remotePort + '\n');

    sock.setEncoding('ascii');
    // 为这个socket实例添加一个"data"事件（接受到数据时触发）处理函数
    sock.on('data', function(data) {
        // 回发该数据，客户端将收到来自服务端的数据
        cqBuffer.enterQueues(data.toString('ascii').split(''));

        console.log('-------接受数据情况：---------------')
        console.log("host：" + sock.remoteAddress + ":" + sock.remotePort +"\ncontent："+ data);
        console.log("timestamp：" + new Date().toTimeString())
        console.log('--------------------------------\n')

        console.log('-------缓冲情况：---------------')
        console.log(cqBuffer.queueSize());
        cqBuffer.showQueue();
        console.log('------------------------------\n')
        console.log("emit data:" + data.toString('ascii'));
        io.emit('originMsgs', data.toString('ascii'));
        dealWithAFram(sock);
    });

    // 为这个socket实例添加一个"close"事件处理函数
    // 当该tcp连接被关闭时触发该事件
    sock.on('close', function(data) {
        console.log('TCP CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });

    sock.on('error', function (data) {
        console.log('erro')
    });

});
server.listen(RECPORT);
server.on('error', function(err) {
    console.log('err happened')
    throw err;
});


function dealWithAFram(sock) {
    console.log('\ntry to deal with a frame...');
    if(cqBuffer.isEmpty()) {
        console.log('buffer is empty!');
        return;
    }
    if(cqBuffer.find('#') < 0) {
        console.log('no complete frame');
        return;
    }

    var f = cqBuffer.delQueueTo('#').join('');
    console.log('origin frame is' + f);

    if(f.indexOf('$') < 0) {
        console.log('frame missing start $');
        return;
    }

    var frame = resolve.reslv(f);
    console.log('get a complete frame');
    console.log('   frame content :' );
    console.log(frame);

    switch(frame.addr) {
        case 'LCLOG':LCLOG_deal(frame, sock);break;
        case 'LCDIN':LCDIN_deal(frame, sock);break;
        default:console.log('not found 404');
    }

}


function LCLOG_deal(frame, sock) {
    userList.push(user);
    var response = res.reslog(frame.id, frame.order, frame.chkSum === frame.rlChkSum);
    sock.write(response, 'ascii');
}

function LCDIN_deal(frame, sock) {
    var response = res.resdata(frame.id, frame.order, frame.chkSum === frame.rlChkSum);
    io.emit('structMsg', JSON.stringify(frame));
    sock.write(response, 'ascii')
}

// 监听未捕获异常，防止未处理的错误导致，服务器崩溃
process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack);
});
