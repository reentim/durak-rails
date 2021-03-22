class AttacksController < ApplicationController
  def create
    game = Game.find(params[:game_id])
    player = Player.find_by(secret: cookies[:_durak_player_secret])

    if game.state['attacks'].compact.push(params[:card]).sort == params[:attacks].compact.sort && (
        game.state['defender'] != player.id &&
        (game.state['attacker'] == player.id || game.state['attacks'].compact.any?) &&
        (game.state['attacks'].concat(game.state['defences']).compact
            .map { |card| game.rank(card) }
            .any? { |rank| game.rank(params[:card]) == rank } || game.state['attacks'].compact.none?)
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
