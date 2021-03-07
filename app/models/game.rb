class Game < ApplicationRecord
  def initialize_state
    update!(state: {
      started: false,
      players: [],
    })
  end

  def started?
    state['started']
  end

  def start
    state['started'] = true
    save!
  end

  def player?(player)
    state['players'].include?(player.id)
  end

  def add_player(player)
    return if started?
    return if player?(player)

    state['players'] << player.id
    save!
  end

  def created_by?(player)
    state['players'].first == player.id
  end
end
