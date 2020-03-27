const http = require('http');
const fs = require('fs');
const qs = require('querystring');

http.createServer((req,res)=>{
  
   let body = "";
   req.on('data',(chunk) => {
    body += chunk.toString();
    });
    req.on('end', () => {
    console.log(`POSTed: ${body}`)

    fs.appendFile('mynewfile1.txt', body, function (err) {
     if (err) throw err;
      console.log('Saved!');
    });
  
 });

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h1>Please enter a message below: </h1>');
  res.write('<form action="/message" method = "POST">');
  res.write('<label for = "message">Message </label>');
  res.write('<input type = "text" name="message" id ="message"><br>');
  res.write('<label for="submit">Submit </label>');
  res.write('<input type="submit" id="submit">');
  res.write('</form>');
  res.end();
  
}).listen(8080,()=>{console.log('we are listening on port 8080')});