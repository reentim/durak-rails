class PlayersController < ApplicationController
  def create
    game = Game.find(params[:game_id])

    cookies[:_durak_player_secret] ||= SecureRandom.hex
    player = Player.find_or_create_by(secret: cookies[:_durak_player_secret])
    player.update!(player_params)

    game.add_player(player)

    redirect_to game
  end

  private

  def player_params
    params.permit(:name)
  end
end
