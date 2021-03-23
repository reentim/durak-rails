import consumer from './consumer'

window.onload = (e) => {
  const gameId = document.getElementById('game_id').textContent

  consumer.subscriptions.create({channel: "NotificationChannel", game_id: gameId }, {
    received(data) {
      console.log('rails', data)
    }
  })
}
