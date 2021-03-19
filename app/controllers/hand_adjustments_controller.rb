class HandAdjustmentsController < ApplicationController
  def create
    game = Game.find(params[:game_id])
    player = Player.find(params[:playerId])

    if (
        game.hand_for(params[:playerId]).sort == params[:hand].sort &&
        player.secret == params[:secret]
    )
      game.state['hands'][params[:playerId]] = params[:hand]
      game.save!

      render json: {}, status: :ok
    else
      render json: {}, status: :unauthorized
    end
  end
end
