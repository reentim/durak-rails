class AttacksController < ApplicationController
  def create
    game = Game.find(params[:game_id])
    player = Player.find_by(secret: cookies[:_durak_player_secret])

    if (
        game.state['attacker'] == player.id &&
        game.state['attacks'].compact.push(params[:card]).sort == params[:attacks].compact.sort
    )
      game.state['attacks'] = params[:attacks]
      game.state['hands'][player.id].delete(params[:card])
      game.save!

      render json: {}, status: :ok
    else
      render json: {}, status: :unauthorized
    end

    ActionCable.server.broadcast('notification_channel', action: 'reload')
  end
end
