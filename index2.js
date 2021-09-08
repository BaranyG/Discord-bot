const fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path");

http.createServer(function (req, res) {
    if(req.url != "/movie.mp4"){
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end('<video src="http://localhost:8888/movie.mp4" controls> </video>');
    }else{
        let file = path.resolve("/video/","movie.mp4");
        fs.stat(file, function(err, stats) {
            if (err) {
                if (err.code === 'ENOENT') {
                  return res.sendStatus(404);
                }
              res.end(err);
            }
            let range = req.headers.range;
            if (!range) {
                // 416 Wrong range
                return res.sendStatus(416);
            }
            let positions = range.replace(/bytes/, "").split("-");
            let start = parseInt(positions[0], 10);
            let total = stats.size;
            let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            let chunksize = (end - start) + 1;

            res.writeHead(206, {
                "Content-Range": "bytes " + start + "-" + end + "/" + total,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4"
            });
            let stream = fs.createReadStream(file, {start: start, end: end})
            .on("open", function() {
                stream.pipe(res);
            }).on("error", function(err) {
                res.end(err);
            });
        });
        
    }
}).listen(8888);