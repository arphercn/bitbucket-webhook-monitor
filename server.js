var http = require('http'),
    exec = require('child_process').exec

const PORT = 9991,
      PATH = '/var/www/html/scheduled'

var server = http.createServer().listen(PORT)


server.on('request', function(req, res) {

    var msg = ''
        
    function _dump(msg) {
        var time = new Date().toLocaleString()
        console.log('['+time+'] ' + msg)
        res.end('['+time+'] ' + msg)
    }

    if (req.url.search(/deploy\/?$/i) > 0) {

        if (req.method == 'POST') {
            var body = ''

            req.on('data', function(data) {
                body += data
            })

            req.on('end', function () {
                var obj = JSON.parse(body),
                    version = '',
                    commands = ''
                if (obj.push.changes[0].old) {
                    version = obj.push.changes[0].old.name

                    if (version == 'master') {
                        commands = [
                        'cd ' + PATH,
                        'git checkout master',
                        'git pull'
                        ].join(' && ')

                        msg = 'pull ' + version

                        _dump(msg)
                        
                    } else if (version == 'develop') {
                        commands = [
                        'cd ' + PATH,
                        'git checkout develop',
                        'git pull'
                        ].join(' && ')

                        msg = 'pull ' + version
                        _dump(msg)

                    } else {
                        msg = 'not found version'
                        _dump(msg)
                    }

                    exec(commands, function(err, out, code) {
                        if (err instanceof Error) {
                            msg = 'Execute Commands Error'
                            _dump(msg)
                            //throw err
                        }
                    })

                }

            }) // end request on end

        } // end POST



    } else if (req.url.search(/status\/?$/i) > 0) {
        res.writeHead(200)
        msg = 'normal status'
        _dump(msg)
    } else {
        msg = 'other request'
        _dump(msg)
    }

})