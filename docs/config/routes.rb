Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  root "pages#home"
  get "installation", to: "pages#installation"
  get "components/:name", to: "pages#component", as: :component
end
