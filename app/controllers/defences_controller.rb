class DefencesController < ApplicationController
  def create
    game = Game.find(params[:game_id])
    player = Player.find_by(secret: cookies[:_durak_player_secret])
    attacking_card = game.state['attacks'][params[:defences].index(params[:card])]

    if (
        game.state['defender'] == player.id &&
        attacking_card.present? &&
        game.beats_card?(params[:card], attacking_card) &&
        game.state['defences'].compact.push(params[:card]).sort == params[:defences].compact.sort
    )
      game.state['defences'] = params[:defences]
      game.state['hands'][player.id].delete(params[:card])

      game.save!

      render json: {}, status: :ok
    else
      render json: {}, status: :unauthorized
    end

    ActionCable.server.broadcast("notification_channel-#{game.id}", action: 'reload')
  end
end
