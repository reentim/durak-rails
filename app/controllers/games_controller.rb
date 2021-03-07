class GamesController < ApplicationController
  def new
    @game = Game.new
  end

  def show
    @game = Game.find(params[:id])

    cookies[:_durak_player_secret] ||= SecureRandom.hex
    @player = Player.find_or_create_by(secret: cookies[:_durak_player_secret])

    @game.add_player(@player) unless @game.started?
  end

  def create
    @game = Game.create!
    @game.initialize_state

    redirect_to @game
  end
end
