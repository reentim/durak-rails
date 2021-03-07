class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games, id: :uuid do |t|
      t.jsonb :state
      t.timestamps
    end
  end
end
