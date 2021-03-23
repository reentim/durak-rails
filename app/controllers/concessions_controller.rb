class ConcessionsController < ApplicationController
  def create
    game = Game.find(params[:game_id])
    player = Player.find_by(secret: cookies[:_durak_player_secret])

    if game.state['defender'] == player.id
      game.state['hands'][player.id].concat(game.state['attacks'].compact, game.state['defences'].compact)
      game.conceede_round
      game.save!

      render json: {}, status: :ok
    else
      render json: {}, status: :unauthorized
    end

    ActionCable.server.broadcast("notification_channel-#{game.id}", action: 'reload')
  end
end
