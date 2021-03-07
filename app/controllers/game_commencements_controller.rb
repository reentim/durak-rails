class GameCommencementsController < ApplicationController
  def create
    game = Game.find(params[:game_id])

    game.start

    redirect_back(fallback_location: root_path)
  end
end
