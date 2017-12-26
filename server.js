var http = require('http'),
    exec = require('child_process').exec

const PORT = 9991,
      PATH = '/var/www/html/scheduled'

var deployServer = http.createServer(function(request, response) {
  if (request.url.search(/deploy\/?$/i) > 0) {

    var commands = [
      'cd ' + PATH,
      'git pull'
    ].join(' && ')

    exec(commands, function(err, out, code) {
      if (err instanceof Error) {
        response.writeHead(500)
        response.end('Server Internal Error')
        throw err
      }
      response.writeHead(200)
      response.end('Deploy Done')
    })

  } else {

	if (request.url.search(/status\/?$/i) > 0) {
		response.writeHead(200)
		response.end('Normal Status')
	}

    response.writeHead(404)
    response.end('Not Found')
  }

})

deployServer.listen(PORT)