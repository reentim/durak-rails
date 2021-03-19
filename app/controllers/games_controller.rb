class GamesController < ApplicationController
  def new
    @game = Game.new
  end

  def show
    @game = Game.find(params[:id])
    @player = @game.players.find_by(secret: cookies[:_durak_player_secret])
  end

  def create
    game = Game.create!
    game.initialize_state

    cookies[:_durak_player_secret] ||= SecureRandom.hex
    player = Player.find_or_create_by(secret: cookies[:_durak_player_secret])
    player.update!(game_params)
    game.add_player(player)

    redirect_to game
  end

  private

  def game_params
    params.require(:game).permit(:name)
  end
end
