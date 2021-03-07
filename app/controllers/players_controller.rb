class PlayersController < ApplicationController
  def create
  end

  def update
    player = Player.find(params[:id])

    player.update!(player_params)

    redirect_back(fallback_location: root_path)
  end

  private

  def player_params
    params.require(:player).permit(:name)
  end
end
