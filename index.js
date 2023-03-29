const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync('home.html','utf-8');

const PORT = process.env.PORT || 3000

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempvalmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempvalmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    
    
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&appid=94b4ac6501a64440d34c44de4cf8cb0a&units=metric")
        .on('data',  (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata]
            // console.log(arrData[0].main.temp);
            const realTimeData = arrData.map(val => replaceVal(homeFile, val)).join("");
            // console.log(realTimeData);
            res.write(realTimeData);
        })
        .on('end',  (err) => {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
    }
})

server.listen(PORT, ()=>{
    console.log(`Server is running on port number ${PORT}`)
});