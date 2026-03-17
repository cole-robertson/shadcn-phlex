# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Skeleton
    class Skeleton < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("animate-pulse rounded-md bg-accent", @attrs.delete(:class))
        @attrs.merge(data_slot: "skeleton", class: classes)
      end
    end
  end
end
