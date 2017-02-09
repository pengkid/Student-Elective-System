var mysql=require('mysql');

function connectServer(){
    var client = mysql.createConnection({
        host:'127.0.0.1',
        port:3305,  //默认是3306，但我修改过mysql的端口号
        user:'root',
        password:'root',
        database:'xuanke'
    });
    return client;
}

function dbControl(client, target, callback){
    client.connect();   //client为一个连接实例
    client.query(target, function(err, results){
        //target为一条SQL语句
        if(err) throw err;
        callback(results);
    });
    client.end();
}

exports.connectServer = connectServer;
exports.dbControl =dbControl;