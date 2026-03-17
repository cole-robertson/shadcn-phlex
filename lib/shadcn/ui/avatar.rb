# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Avatar
    # Sizes: default, sm, lg
    class Avatar < Base
      def initialize(size: :default, **attrs)
        @size = size
        @attrs = attrs
      end

      def view_template(&block)
        span(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none",
          "data-[size=lg]:size-10 data-[size=sm]:size-6",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "avatar", data_size: @size, class: classes)
      end
    end

    class AvatarImage < Base
      def initialize(src:, alt: "", **attrs)
        @src = src
        @alt = alt
        @attrs = attrs
      end

      def view_template
        img(**build_attrs)
      end

      private

      def build_attrs
        classes = cn("aspect-square size-full", @attrs.delete(:class))
        @attrs.merge(data_slot: "avatar-image", src: @src, alt: @alt, class: classes)
      end
    end

    class AvatarFallback < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        span(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground",
          "group-data-[size=sm]/avatar:text-xs",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "avatar-fallback", class: classes)
      end
    end

    class AvatarBadge < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        span(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full",
          "bg-primary text-primary-foreground ring-2 ring-background select-none",
          "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
          "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
          "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "avatar-badge", class: classes)
      end
    end

    class AvatarGroup < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "avatar-group", class: classes)
      end
    end

    class AvatarGroupCount < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "relative flex size-8 shrink-0 items-center justify-center rounded-full",
          "bg-muted text-sm text-muted-foreground ring-2 ring-background",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "avatar-group-count", class: classes)
      end
    end
  end
end
