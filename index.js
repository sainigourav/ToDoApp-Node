var http = require("http");
var fs = require("fs");

function readFile( file_name, content_type, response)
{
	fs.readFile(file_name, function(err , data)
	{
		if(err)
		{
			throw err;
		}
		else
		{
			response.writeHead(200, {'Content-type' : content_type});
			response.write(data);
			response.end();
		}
	})
}





function receptionist(request, response)
{
	var path = request.url;
	var method = request.method;
	
	if(method === "GET")
	{
		if(path === "/")
		{
			readFile("./index.html", "text/html", response);
		}
		else if(path === "/css/style_one.css" ||path === "/css/style_two.css")
		{
			readFile("."+path, "text/css", response);
		}
		else if(path === "/js/script_one.js" ||path === "/js/script_two.js")
		{
			readFile("."+path, "text/javascript", response);
		}
		else if(path === "/tasks.txt")
		{
			readFile("."+path, "text/txt", response);
		}
		else if(path === "/check.txt")
		{
			readFile("."+path, "text/txt", response);
		}
		else
		{
			
			response.writeHead(200);
			response.end();
		}
    }
	else if(method === "POST")
	{
		if(path === "/tasks")
		{
			readJson(request, function(task){
				readTask(path,function(alltask){
					if(alltask.length === 0)
					{
						alltask = [];
					}
					else
					{
						alltask = JSON.parse(alltask);
					}
					alltask.push(task);
					writeTask(path,JSON.stringify(alltask), function(){
					response.end();
					
				});
				});
				
			});
		}
		else if(path === "/check")
		{
			readJson(request, function(task){
				readTask(path,function(allcheck){
					if(allcheck.length === 0)
					{
						allcheck = [];
					}
					else
					{
						allcheck = JSON.parse(allcheck);
					}
					allcheck.push(task);
					writeTask(path,JSON.stringify(allcheck), function(){
					response.end();
					
				});
				});
				
			});
		}
	}
	else if(method === "PUT")
	{
		if(path === "/check")
		{
			readJson(request, function(task)
			{
				writeTask(path,JSON.stringify(task), function()
				{
					response.end();
				});
			});
		}
		else if(method === "PUT")
	{
		if(path === "/tasks")
		{
			readJson(request, function(task)
			{
				writeTask(path,JSON.stringify(task), function()
				{
					response.end();
				});
			});
		}
	}
	}
}

function readTask(path,callback)
{
	fs.readFile("."+path+".txt", function(err, data){
		if(err)
		{
			throw err;
		}
		callback(data);
	});
}



function writeTask(path, task , callback)
{
	fs.writeFile("."+path+".txt", task, function(err){
		if(err)
		{
			throw err;
		}
		callback();
	})
}

function readJson(request, callback)
{
	var body = "";
	request.on('data',function(chunk){
		body += chunk;
	});
	request.on('end',function(){
		var data = JSON.parse(body);
		callback(data);
	});
	
}

var server_setup = http.createServer( receptionist );

server_setup.listen(8000);

console.log("server is running");








