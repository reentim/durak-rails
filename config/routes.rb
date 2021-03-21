Rails.application.routes.draw do
  mount ActionCable.server => '/cable'

  root to: 'games#new'

  resources :game_commencements, only: [:create]
  resources :games, only: [:new, :show, :create] do
    resource :state, only: [:show]
    resource :hand_adjustments, only: [:create]
    resource :attacks, only: [:create]
    resource :defences, only: [:create]
  end
  resources :players, only: [:create]
end
