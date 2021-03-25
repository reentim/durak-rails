class AttacksController < ApplicationController
  def create
    game = Game.find(params[:game_id])
    player = Player.find_by(secret: cookies[:_durak_player_secret])

    if game.state['attacks'].compact.push(params[:card]).sort == params[:attacks].compact.sort && (
        game.state['hands'][game.state['defender']].any? &&
        game.state['attacks'].compact.count <= game.state['hands'][game.state['defender']].count &&
        (game.state['attacker'] == player.id || game.state['attacks'].compact.any?) &&
        (game.state['attacks'].concat(game.state['defences']).compact
            .map { |card| game.rank(card) }
            .any? { |rank| game.rank(params[:card]) == rank } || game.state['attacks'].compact.none?)
    )
      if game.state['defender'] != player.id
        game.state['hands'][player.id].delete(params[:card])
        game.state['attacks'] = params[:attacks]
      elsif game.state['attacks'].compact.all? { |attack| game.rank(attack) == game.rank(params[:card]) }
        game.state['hands'][player.id].delete(params[:card])
        game.state['attacks'] = params[:attacks]
        game.rotate_play
      end

      if game.state['hands'][player.id] == [] && game.state['deck'] == []
        game.state['finishedPlayers'].push(player.id)
      end

      game.save!

      render json: {}, status: :ok
    else
      render json: {}, status: :unauthorized
    end

    ActionCable.server.broadcast("notification_channel-#{game.id}", action: 'reload')
  end
end
