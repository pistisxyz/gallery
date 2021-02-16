const formidable = require('formidable');
const crypto = require('crypto');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');


export default function(req,res,next){
    if(routes[req.method] && routes[req.method]['/'+req.url.split('/')[1]]){
        req.cookies = funcs.parseCookies(req);
        routes[req.method]['/'+req.url.split('/')[1]](req, res);
    }else{
        console.log('asdbaidsubj')
        next();
    }
}

function checksum(str, algorithm, encoding) {
    return crypto
      .createHash(algorithm || 'md5')
      .update(str, 'utf8')
      .digest(encoding || 'hex')
}

var storage = [];
var users = {};
var authCookies = {};

fs.readFile(path.join(__dirname, 'storage.json'), function (err, data) {
    storage = JSON.parse(data);
})

fs.readFile(path.join(__dirname, 'users.json'), function (err, data) {
    users = JSON.parse(data);
})

fs.readFile(path.join(__dirname, 'sessions.json'), function (err, data) {
    authCookies = JSON.parse(data);
})

var saveStorageWait;


var funcs = {
    sS(){
        fs.writeFile(path.join(__dirname, 'storage.json'), JSON.stringify(storage), (err) => { 
            if(err){
                console.log(err);
            }
        });
    },
    sU(){
        fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users), (err) => { 
            if(err){
                console.log(err);
            }
        });
    },
    sSession(){
        fs.writeFile(path.join(__dirname, 'sessions.json'), JSON.stringify(authCookies), (err) => { 
            if(err){
                console.log(err);
            }
        });
    },
    parseCookies(request) {
        var list = {},
            rc = request.headers.cookie;
    
        rc && rc.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
    
        return list;
    },
    stringifyCookies(cookies) {
        return Object.entries( cookies )
          .map( ([k,v]) => k + '=' + encodeURIComponent(v) )
          .join( '; Path=/');
    },
    parsePost(req, cb, mb){
        let maxSize = mb*1000000 || 10e6; //default max size 10MB
        let body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > maxSize) req.connection.destroy();
        });
        req.on('end', function () {
            cb(body)
        });
    },
    bodyPostParse(body){
        let arr = body.split('&');
        let len = arr.length;
        let parsed = {}
        for(var i = 0; i<len; i++){
            let item = arr[i].split('=');
            parsed[item[0]] = item[1];
        }
        return parsed;
    }
}

function saveStorage(){
    clearTimeout(saveStorageWait);
    saveStorageWait = setTimeout(funcs.sS,10000);
}

const uploads_location = path.join(__dirname, '../uploads/');


const routes = {
    GET: {
        '/getimage': (req, res)=>{
            let image_location = req.url.split('/')[2];
            var info = storage.find(element => element.path == image_location);
            fs.readFile(path.join(uploads_location, 'resized', image_location), function (err, image) {
                if (err) {
                    res.writeHead(400, {'Content-type':'text/plain'});
                    console.log(err);
                    res.end("No such image");
                } else {
                    //specify the content type in the response will be an image
                    res.writeHead(200,{'Content-type':info.type});
                    res.end(image);
                }
            });
        },
        '/getfullimage': (req, res)=>{
            let image_location = req.url.split('/')[2];
            var info = storage.find(element => element.path == image_location);
            fs.readFile(path.join(uploads_location, image_location), function (err, image) {
                if (err) {
                    res.writeHead(400, {'Content-type':'text/plain'});
                    console.log(err);
                    res.end("No such image");    
                } else {
                    //specify the content type in the response will be an image
                    res.writeHead(200,{'Content-type':info.type});
                    res.end(image);
                }
            });
        },
        '/gallery': (req, res)=>{
            let max_per = 100;
            let len = (max_per * req.url.split('/').pop());
            if(len-max_per > storage.length){
                res.writeHead(200, {'content-type': 'text/plain'});
                return res.end('no more images');
            }
            res.writeHead(200, {'content-type': 'application/json'});
            var send_array = [];
            for(var i = 0; i < (storage.length > max_per? max_per:storage.length); i++){
                let item = storage[(len-max_per+i)]
                send_array.push({path: item.path, name: item.name, LM: item.lastModified});
            }
            res.end(JSON.stringify(send_array));
        }
    },
    POST: {
        '/checklogin': (req, res)=>{
            res.writeHead(200, {'content-type': 'text/plain'});
            if(req.cookies.son && authCookies[req.cookies.son]){
                console.log(authCookies[req.cookies.son].name)
                res.end(`${authCookies[req.cookies.son].name}${authCookies[req.cookies.son].admin? ':admin':''}`);
            }else{
                res.end('false');
            }
        },
        '/logout': (req, res)=>{
            if(req.cookies.son && authCookies[req.cookies.son]){
                console.log(`${authCookies[req.cookies.son].name} logged out`);
                delete authCookies[req.cookies.son];
                res.writeHead(200, {'content-type': 'text/plain'});
                res.end('logged out');
            }else{
                res.writeHead(200, {'content-type': 'text/plain'});
                res.end('not logged in');
            }
        },
        '/register': (req, res)=>{
            if(req.cookies.son && authCookies[req.cookies.son] && authCookies[req.cookies.son].admin){
                funcs.parsePost(req, function(bod){
                    var body = funcs.bodyPostParse(bod);
                    console.log(body)
                    if(users[body.name]){
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end(`user already exists`);
                    }else{
                        users[body.name] = {
                            password: body.pss
                        }
                        funcs.sU();
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end(`user registered`);
                    }
                });
            }
        },
        '/login': (req, res)=>{
            if(req.cookies.son && authCookies[req.cookies.son]){
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(`true:${authCookies[req.cookies.son].name}:already logged in`);
            }else{
                function generate_random_token(cb){
                    crypto.randomBytes(48, function(err, buffer) {
                        cb(buffer.toString('hex'));
                    });
                }

                function checktoken(cb){
                    generate_random_token(function(token){
                        if(authCookies[token]){
                            checktoken(cb);
                        }else{
                            cb(token);
                        }
                    })
                }

                funcs.parsePost(req, function(bod){
                    var body = funcs.bodyPostParse(bod);
                    if(users[body.name] && users[body.name].password == body.pss){
                        checktoken(function(token){
                            authCookies[token] = {
                                admin: users[body.name].admin? true:false,
                                name: body.name
                            };
                            funcs.sSession(); //save session cookie
                            req.cookies.son = token;
                            res.writeHead(200, {
                                'Set-Cookie': funcs.stringifyCookies({son: req.cookies.son})+'; Path=/',
                                'Content-Type': 'text/plain'
                            });
                            res.end(`true:${body.name}:logging in${users[body.name].admin? ':true':''}`);
                        })
                    }else{
                        res.writeHead(200, {
                            'Content-Type': 'text/plain'
                        });
                        res.end('wrong username or password');
                    }
                })
            }

        },
        '/upload': (req, res)=>{
            try {
                var form = new formidable.IncomingForm();
                form.parse(req, function(err, fields, files) {
                    if (err) {
                      console.log(err.message);
                      return;
                    }
    
                    res.writeHead(200, {'content-type': 'text/plain'});

                    let item = files.image;
    
                    if(item.type.split('/')[0] == 'image'){
                        fs.readFile(item.path, function (err, data) {
                            var check = checksum(data);
                            var date_name = Date.now().toString() + '_' + check + '.' +item.name.split('.').pop();
                            var date_location = path.join(uploads_location, date_name);
                            fs.rename(item.path, date_location, function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                res.end('uploaded');
                            });
                            sharp(data).resize(200, null, {
                                fit: sharp.fit.inside,
                                withoutEnlargement: true
                            }).toBuffer().then(resizeddata => { 
                                fs.writeFile(path.join(uploads_location, 'resized', date_name), resizeddata, (err) => { 
                                    if(err){
                                        console.log(err);
                                    }
                                });
                            }).catch(err => { 
                                console.log(err)
                            });
                            storage.push({checksum: check, type: item.type, path: date_name, original_name: item.name, size: item.size, lastModified: fields.lastModified});
                            saveStorage();
                        })
                    }else{
                        fs.unlink(item.path, function(err){
                            if(err){
                                console.log(err);
                            }
                            res.end('error');
                        })
                    }
                });
            }catch(err){
                console.log(err)
            }
        }
    }
}
