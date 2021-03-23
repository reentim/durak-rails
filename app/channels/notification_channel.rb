class NotificationChannel < ApplicationCable::Channel
  def subscribed
    stream_from "notification_channel-#{params['game_id']}"
  end
end
