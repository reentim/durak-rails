Rails.application.routes.draw do
  root to: 'games#new'

  resources :game_commencements, only: [:create]
  resources :games, only: [:new, :show, :create] do
    resource :state, only: [:show]
  end
  resources :players, only: [:create]
end
