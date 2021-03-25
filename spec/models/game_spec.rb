require 'rails_helper'

RSpec.describe Game do
  describe '#start' do
    subject { game.start(deck) }

    before do
      game.initialize_state
      game.add_player(Player.create! name: 'Alice')
      game.add_player(Player.create! name: 'Bob')
      game.add_player(Player.create! name: 'Charlie')
      game.add_player(Player.create! name: 'Derek')
    end

    let!(:game) { Game.create! }
    let(:deck) {
      %w[
        12-C 6-C 7-C 8-C 9-C 10-C 11-C
             6-S 7-S 8-S 9-S 10-S 11-S
             6-D 7-D 8-D 9-D 10-D 11-D
             6-H 7-H 8-H 9-H 10-H 11-H
      ]
    }

    it 'assigns attacker to the player with the lowest trump' do
      subject

      expect(game.state['hands'][game.state['players'].first]).to include("6-C")
    end
  end
end
