class Game < ApplicationRecord
  def initialize_state
    update!(state: {
      game_id: id,
      started: false,
      players: [],
      hands: {},
      deck: [],
      attacks: Array.new(6),
    })
  end

  def started?
    state['started']
  end

  def start
    state['deck'] = %w[
      AC 6C 7C 8C 9C 10C JC QC KC
      AS 6S 7S 8S 9S 10S JS QS KS
      AD 6D 7D 8D 9D 10D JD QD KD
      AH 6H 7H 8H 9H 10H JH QH KH
    ].shuffle

    state['players'].each do |id|
      state['hands'][id] = state['deck'].pop(6)
    end

    state['attacks'] = Array.new(6)
    state['started'] = true
    state['attacker'] = state['players'].first
    state['defender'] = state['players'].second
    save!
    ActionCable.server.broadcast('notification_channel', action: 'reload')
  end

  def player?(player)
    state['players'].include?(player.id)
  end

  def players
    Player.where(id: state['players'])
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

  def hand_for(player_id)
    state['hands'][player_id]
  end

  def state_for(player)
    return {} unless player.present?

    state['names'] = {}
    state['players'].each do |id|
      state['names'][id] = Player.find(id).name
    end

    state['player_id'] = player.id

    state['deck'] = state['deck'].map { |card| card == state['deck'].last ? card : 'unknown' }

    if state['hands'] != {}
      state['players'].each do |player_id|
        next if player_id == player.id

        state['hands'][player_id] = state['hands'][player_id].map { |_card| 'unknown' }
      end
    end

    state
  end
end
