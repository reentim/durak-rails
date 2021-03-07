Rails.application.routes.draw do
  root to: 'games#new'

  resources :game_commencements, only: [:create]
  resources :games, only: [:new, :show, :create]
  resources :players, only: [:create, :update]
end
