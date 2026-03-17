# frozen_string_literal: true

module Pages
  module Components
    class TablePage < BaseComponentPage
      def initialize
        super(title: "Table", description: "A responsive table component for displaying tabular data.")
      end

      def view_template
        preview("Default") do
          ui_table do
            ui_table_header do
              ui_table_row do
                ui_table_head { "Invoice" }
                ui_table_head { "Status" }
                ui_table_head(class: "text-right") { "Amount" }
              end
            end
            ui_table_body do
              ui_table_row do
                ui_table_cell { "INV-001" }
                ui_table_cell { "Paid" }
                ui_table_cell(class: "text-right") { "$250.00" }
              end
              ui_table_row do
                ui_table_cell { "INV-002" }
                ui_table_cell { "Pending" }
                ui_table_cell(class: "text-right") { "$150.00" }
              end
              ui_table_row do
                ui_table_cell { "INV-003" }
                ui_table_cell { "Unpaid" }
                ui_table_cell(class: "text-right") { "$350.00" }
              end
            end
            ui_table_footer do
              ui_table_row do
                ui_table_cell(colspan: "2") { "Total" }
                ui_table_cell(class: "text-right") { "$750.00" }
              end
            end
          end
        end

        code <<~RUBY
          ui_table do
            ui_table_header do
              ui_table_row do
                ui_table_head { "Name" }
                ui_table_head { "Amount" }
              end
            end
            ui_table_body do
              ui_table_row do
                ui_table_cell { "Item" }
                ui_table_cell { "$100" }
              end
            end
          end
        RUBY
      end
    end
  end
end
