var net = require('net');

var HOST = '127.0.0.1';
var PORT = 6969;
var client = new net.Socket();

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
	// rl.close();
});


rl.on('line', (input) => {
  // console.log(`Received: ${input}`);
    if(input == 'exit') {
        client.end();
        return;
    }
    client.write(input + '');
});

// 为客户端添加“data”事件处理函数
// data是服务器发回的数据
client.on('data', function(data) {
    console.log('DATA: ' + data);
});

// 为客户端添加“close”事件处理函数
client.on('close', function() {
    console.log('Connection closed');
});

client.on('error', function() {
    console.log('Connection error');
});