class RoundClaimsController < ApplicationController
  def create
    game = Game.find(params[:game_id])
    player = Player.find_by(secret: cookies[:_durak_player_secret])

    if game.updated_at < 5.seconds.ago &&
        game.attacks_covered? &&
        game.state['defender'] == player.id
      game.end_round

      render json: {}, status: :ok
    else
      render json: {}, status: :unauthorized
    end

    ActionCable.server.broadcast("notification_channel-#{game.id}", action: 'reload')
  end
end
