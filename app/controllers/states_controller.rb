class StatesController < ApplicationController
  def show
    player = Player.find(params[:player_id])
    game = Game.find(params[:game_id])

    if player.secret == params[:secret]
      render json: game.state_for(player)
    else
      render json: {}, status: :unauthorized
    end
  end
end
