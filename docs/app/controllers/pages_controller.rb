# frozen_string_literal: true

class PagesController < ApplicationController
  layout false

  def home
    render Pages::Home.new
  end

  def installation
    render Pages::Installation.new
  end

  def component
    name = params[:name]
    view_class = "Pages::Components::#{name.camelize}Page".safe_constantize

    if view_class
      render view_class.new
    else
      render plain: "Component '#{name}' not found", status: :not_found
    end
  end
end
