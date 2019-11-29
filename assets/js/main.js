const socket = io()

// login
$('#submit_name').submit(e => {
  e.preventDefault()
  const username = $('#username').val()

  // kirim data username ke server
  //dengan membuat key, value
  socket.emit("loginUser", username)
})

socket.on("loginResponse", status => {
  if (status) {
    $('#login').addClass('hidden')
    $('#chatroom').removeClass('hidden')
  }
})