# frozen_string_literal: true

module Pages
  module Components
    class AvatarPage < BaseComponentPage
      def initialize
        super(title: "Avatar", description: "An image element with a fallback for representing the user.")
      end

      def view_template
        preview("With image") do
          ui_avatar do
            ui_avatar_image(src: "https://github.com/shadcn.png", alt: "shadcn")
            ui_avatar_fallback { "CN" }
          end
        end

        preview("With fallback") do
          div(class: "flex gap-3") do
            ui_avatar do
              ui_avatar_fallback { "JD" }
            end
            ui_avatar do
              ui_avatar_fallback { "AB" }
            end
            ui_avatar do
              ui_avatar_fallback { "KL" }
            end
          end
        end

        preview("Sizes") do
          div(class: "flex items-center gap-3") do
            ui_avatar(size: :sm) do
              ui_avatar_fallback { "SM" }
            end
            ui_avatar(size: :default) do
              ui_avatar_fallback { "MD" }
            end
            ui_avatar(size: :lg) do
              ui_avatar_fallback { "LG" }
            end
          end
        end

        preview("Avatar group") do
          ui_avatar_group do
            ui_avatar do
              ui_avatar_fallback { "JD" }
            end
            ui_avatar do
              ui_avatar_fallback { "AB" }
            end
            ui_avatar do
              ui_avatar_fallback { "KL" }
            end
            ui_avatar_group_count { "+3" }
          end
        end

        code <<~RUBY
          ui_avatar do
            ui_avatar_image(src: "avatar.png", alt: "User")
            ui_avatar_fallback { "JD" }
          end

          ui_avatar_group do
            ui_avatar { ui_avatar_fallback { "A" } }
            ui_avatar { ui_avatar_fallback { "B" } }
            ui_avatar_group_count { "+5" }
          end
        RUBY
      end
    end
  end
end
