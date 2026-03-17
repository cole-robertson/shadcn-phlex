# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Direction (RTL/LTR wrapper)
    class Direction < Base
      def initialize(dir: :ltr, **attrs)
        @dir = dir
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "direction", dir: @dir.to_s)
      end
    end
  end
end
