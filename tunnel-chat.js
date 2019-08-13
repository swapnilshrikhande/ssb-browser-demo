const Notify = require('pull-notify');

exports.manifest =  {
  tunnelMessage: 'async'
}

exports.permissions = {
  anonymous: {allow: ['tunnelMessage']}
}

exports.name = 'tunnelChat'

exports.init = function (sbot, config) {

  var messages = Notify()
  var remote

  sbot.on('rpc:connect', function (rpc, isClient) {
    if (!isClient)
      remote = rpc
  })
  
  return {
    acceptMessages: function() {
      SSB.net.connect(SSB.remoteAddress, (err, rpc) => {
	if (err) throw(err)

	rpc.tunnel.announce()
      })
    },
    connect: function(remoteId) {
      var remoteKey = remoteId.substring(1, remoteId.indexOf('.'))
      SSB.net.connect('tunnel:@'+SSB.remoteAddress.split(':')[3]+ ':' + remoteId + '~shs:' + remoteKey, (err, rpc) => {
	if (err) throw(err)

	remote = rpc
	messages({user: '', text: rpc.id + " connected!"})
      })
    },
    sendMessage: function(text) {
      remote.tunnelChat.tunnelMessage(text)
      messages({user: 'me', text})
    },
    tunnelMessage: function(text) {
      messages({user: 'remote', text})
    },
    messages: function() {
      return messages.listen()
    }
  }
}
