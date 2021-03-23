class Game < ApplicationRecord
  def initialize_state
    update!(state: {
      game_id: id,
      started: false,
      players: [],
      hands: {},
      deck: [],
    })
  end

  def beats_card?(attacker, defender)
    return true if [attacker, defender].all?(&:nil?)
    [
      trump?(attacker) && !trump?(defender),
      suit(attacker) == suit(defender) && rank(attacker) > rank(defender)
    ].any?
  end

  def end_round(advance_by = 1)
    state['attacks'] = Array.new(6)
    state['defences'] = Array.new(6)
    state['players'].each do |player|
      hand = state['hands'][player]
      if hand.count < 6
        hand.concat(state['deck'].shift(6 - hand.count))
      end
    end
    state['players'].rotate!(advance_by)
    state['attacker'] = state['players'].first
    state['defender'] = state['players'].second
    save!
  end

  def conceede_round
    end_round(2)
  end

  def attacks_covered?
    state['attacks'].all? { |card|
      beats_card?(state['defences'][state['attacks'].index(card)], card)
    }
  end

  def started?
    state['started']
  end

  def start
    state['deck'] = %w[
      14-C 6-C 7-C 8-C 9-C 10-C 11-C 12-C 13-C
      14-S 6-S 7-S 8-S 9-S 10-S 11-S 12-S 13-S
      14-D 6-D 7-D 8-D 9-D 10-D 11-D 12-D 13-D
      14-H 6-H 7-H 8-H 9-H 10-H 11-H 12-H 13-H
    ].shuffle

    state['players'].each do |id|
      state['hands'][id] = state['deck'].pop(6)
    end

    state['attacks'] = Array.new(6)
    state['defences'] = Array.new(6)
    state['started'] = true
    state['attacker'] = state['players'].first
    state['defender'] = state['players'].second
    state['trump'] = suit(state['deck'][-1])
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
    creator == player
  end

  def creator
    Player.where(id: state['created_by']).first
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

  def rank(card)
    card.split('-').first.to_i
  end

  def suit(card)
    card.split('-').last
  end

  def trump?(card)
    suit(card) == state['trump']
  end
end
