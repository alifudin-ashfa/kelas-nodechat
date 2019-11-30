const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

// permission file assets
app.use(express.static('assets'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

let users = {},
  usernames = []

io.on('connection', socket => {

  // mengirim pesan
  socket.on('newMessage', (msg) => {
    io.emit('newMessage', msg)
  })

  // login
  // mendeteksi informasi dari client side key, value
  socket.on("loginUser", username => {
    //  menampilkan user online
    usernames.push(username)
    users[socket.id] = username
    // kirim data untuk semua user
    io.emit('onlineUsers', usernames)

    // kirim data untuk kita sendiri
    socket.emit('loginResponse', true)
  })

  // chat message
  socket.on('newMessage', user => {
    io.emit('newMassage', user)
  })

  socket.on('disconnect', () => {
    // menghapus data user logout
    const index = usernames.indexOf(users[socket.id])
    if (users[socket.id]) {
      // hapus user di data array (posisi array, jumlah yg dihapus)
      usernames.splice(index, 1)
    }

    // hapus userdi data json
    delete users[socket.id]

    io.emit('onlineUsers', usernames)
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000')
});