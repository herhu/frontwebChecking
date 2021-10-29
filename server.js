const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

const https = require('https');
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

var cors = require('cors');

// app.use(express.vhost('checkout.hscp.cl', require('/home/administrador/checkOut/web').app));
// app.use(express.vhost('checkin.hscp.cl', require(__dirname+'Prod/index.html').app));

app.use(cors({origin: 'http://localhost:80'}));
app.use(express.static(path.join(__dirname, 'Prod')));
app.use(express.static(path.join('/home/administrador/checkOut/web')));
app.use(express.static(path.join('/home/administrador/frenonApi/img')));

app.get('*', (req, res) => {
	console.log("data",req.headers.host);
	res.sendFile(path.join(__dirname, 'Prod/index.html'));
	/*if(req.headers.host == "checkin.hscp.cl"){
		res.sendFile(path.join(__dirname, 'Prod/index.html'));
	}
	else if(req.headers.host == "checkout.hscp.cl"){
		res.sendFile(path.join('/home/administrador/checkOut/web/index.html'));
	}*/
	
});


/*app.get("*", function(request, response){
  response.redirect("https://" + request.headers.host + request.url);
});*/

const port = '80';

const server = http.createServer(app);



const privateKey = fs.readFileSync('/etc/letsencrypt/live/checkin.hscp.cl/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/checkin.hscp.cl/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/checkin.hscp.cl/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const servers = https.createServer(credentials, app);

server.listen(port,() => console.log(`web check in-out:${port}`));
servers.listen(443,() => console.log(`web ssl check in-out: 443`));


