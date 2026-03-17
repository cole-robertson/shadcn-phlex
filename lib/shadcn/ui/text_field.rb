# frozen_string_literal: true

module Shadcn
  module UI
    # Compound field component: Field + Label + Input + FieldDescription + FieldError
    #
    # Usage:
    #   render Shadcn::UI::TextField.new(
    #     label: "Email",
    #     name: "user[email]",
    #     type: "email",
    #     description: "We'll never share your email.",
    #     error: "is required",
    #     required: true,
    #     placeholder: "you@example.com"
    #   )
    class TextField < Base
      def initialize(label: nil, name: nil, type: "text", description: nil, error: nil, required: false, disabled: false, id: nil, **input_attrs)
        @label = label
        @name = name
        @type = type
        @description = description
        @error = error
        @required = required
        @disabled = disabled
        @id = id || generate_id(name)
        @input_attrs = input_attrs
      end

      def view_template
        render Field.new(disabled: @disabled) do
          if @label
            render Label.new(for: @id) do
              plain @label
              if @required
                span(class: "text-destructive") { " *" }
              end
            end
          end

          render Input.new(
            type: @type,
            name: @name,
            id: @id,
            required: @required || nil,
            disabled: @disabled || nil,
            aria_invalid: @error ? "true" : nil,
            aria_describedby: description_id,
            **@input_attrs
          )

          if @description && !@error
            render FieldDescription.new(id: description_id) {
              plain @description
            }
          end

          if @error
            render FieldError.new { plain @error }
          end
        end
      end

      private

      def generate_id(name)
        return nil unless name
        name.to_s.gsub(/[\[\]]/, "_").gsub(/_+/, "_").chomp("_")
      end

      def description_id
        return nil unless @description && @id
        "#{@id}_description"
      end
    end

    # Compound field component: Field + Label + Textarea + FieldDescription + FieldError
    #
    # Usage:
    #   render Shadcn::UI::TextareaField.new(
    #     label: "Message",
    #     name: "contact[message]",
    #     description: "Max 500 characters.",
    #     error: "can't be blank",
    #     required: true,
    #     rows: 4
    #   )
    class TextareaField < Base
      def initialize(label: nil, name: nil, description: nil, error: nil, required: false, disabled: false, id: nil, **textarea_attrs)
        @label = label
        @name = name
        @description = description
        @error = error
        @required = required
        @disabled = disabled
        @id = id || generate_id(name)
        @textarea_attrs = textarea_attrs
      end

      def view_template
        render Field.new(disabled: @disabled) do
          if @label
            render Label.new(for: @id) do
              plain @label
              if @required
                span(class: "text-destructive") { " *" }
              end
            end
          end

          render Textarea.new(
            name: @name,
            id: @id,
            required: @required || nil,
            disabled: @disabled || nil,
            aria_invalid: @error ? "true" : nil,
            aria_describedby: description_id,
            **@textarea_attrs
          )

          if @description && !@error
            render FieldDescription.new(id: description_id) {
              plain @description
            }
          end

          if @error
            render FieldError.new { plain @error }
          end
        end
      end

      private

      def generate_id(name)
        return nil unless name
        name.to_s.gsub(/[\[\]]/, "_").gsub(/_+/, "_").chomp("_")
      end

      def description_id
        return nil unless @description && @id
        "#{@id}_description"
      end
    end
  end
end
