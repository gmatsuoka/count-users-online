var express = require('express'),
    app = express(),
    //load = require('express-load'),
    server = require('http').createServer(app),
    fs = require('fs'),
    io = require('socket.io').listen(server);
    
var newrelic = require('newrelic');

//app.enable('trust proxy')
io.set('transports', ['xhr-polling']);

//set port
var port = Number(process.env.PORT || 8080);
server.listen(port, function() {
  console.log("Listening on " + port);
});

//set diretorio de view
app.set('views', __dirname + '/views');

//seta o tipo de view
app.set('view engine', 'ejs');

//rota para teste
app.get('/', function(req,res){
    res.render('index');
});

//Pega o ip da requisição
app.get('/myip', function(req,res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.jsonp({ ip: ip })
});

//rota para verificar os usuarios online
app.get('/online', function(req,res){
    res.render('online');
});

app.get('/ip', function(req,res){
    res.render('ip');
});






var clients = {};
var notify_me = [];

io.sockets.on('connection', function (socket) {

  socket.on('ping', function(ip){

    //add ip and client
    clients[socket.id] = ip;

    //send notify user
    private_notify(socket);

  });


  socket.on('notify-me', function(){
    if (notify_me.indexOf(socket.id) == -1) {
      notify_me.push(socket.id)
    }

    //força notificação do status atual
    private_notify(socket);
  });

  socket.on('disconnect', function(){

      //remove
      delete clients[socket.id];

      //remove da lista de notificao caso exista
      remove_notify(socket);

      //notifica caso alguem tenha saido
      private_notify(socket);
  });

});

//notifica para fila
function private_notify(socket){

  for(var x in notify_me){
    var params = {
      count_ip: count_unique(),
      count_clients: Object.keys(clients).length
    }

    io.sockets.socket(notify_me[x]).emit('notify', params);
  }

}

//count de ips unicos
function count_unique(){
  //cria um array com ips unicos
  var ips = [];

  for ( var x in clients ){
    if (ips.indexOf(clients[x]) == -1) {
      ips.push(clients[x])
    }
  }

  return ips.length;
}

//remove da lista de notificacoes
function remove_notify(socket){
  var i = notify_me.indexOf(socket.id);
  if(i != -1) {
    notify_me.splice(i, 1);
  }
}

//comandos
//git add . && git commit -m "change" && git push origin master && git push heroku master
//https://devcenter.heroku.com/articles/getting-started-with-nodejs
