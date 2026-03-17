# frozen_string_literal: true

module Pages
  module Components
    class ComboboxPage < BaseComponentPage
      def initialize
        super(title: "Combobox", description: "A searchable select with autocomplete filtering.")
      end

      def view_template
        preview("Default") do
          ui_combobox(name: "framework", class: "w-[240px]") do
            ui_combobox_trigger do
              ui_combobox_value(placeholder: "Select framework...")
            end
            ui_combobox_content do
              ui_combobox_input(placeholder: "Search frameworks...")
              ui_combobox_empty { "No framework found." }
              ui_combobox_item(value: "next") { "Next.js" }
              ui_combobox_item(value: "svelte") { "SvelteKit" }
              ui_combobox_item(value: "nuxt") { "Nuxt" }
              ui_combobox_item(value: "remix") { "Remix" }
              ui_combobox_item(value: "astro") { "Astro" }
            end
          end
        end

        code <<~RUBY
          ui_combobox(name: "framework") do
            ui_combobox_trigger do
              ui_combobox_value(placeholder: "Select...")
            end
            ui_combobox_content do
              ui_combobox_input(placeholder: "Search...")
              ui_combobox_empty { "No results." }
              ui_combobox_item(value: "next") { "Next.js" }
              ui_combobox_item(value: "svelte") { "SvelteKit" }
            end
          end
        RUBY
      end
    end
  end
end
