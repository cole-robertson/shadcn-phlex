# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Typography components
    # Heading, Paragraph, Blockquote, InlineCode, Lead, Muted, etc.

    class TypographyH1 < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        h1(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", @attrs.delete(:class))
        @attrs.merge(data_slot: "typography-h1", class: classes)
      end
    end

    class TypographyH2 < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        h2(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", @attrs.delete(:class))
        @attrs.merge(data_slot: "typography-h2", class: classes)
      end
    end

    class TypographyH3 < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        h3(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("scroll-m-20 text-2xl font-semibold tracking-tight", @attrs.delete(:class))
        @attrs.merge(data_slot: "typography-h3", class: classes)
      end
    end

    class TypographyH4 < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        h4(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("scroll-m-20 text-xl font-semibold tracking-tight", @attrs.delete(:class))
        @attrs.merge(data_slot: "typography-h4", class: classes)
      end
    end

    class TypographyP < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        p(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("leading-7 [&:not(:first-child)]:mt-6", @attrs.delete(:class))
        @attrs.merge(data_slot: "typography-p", class: classes)
      end
    end

    class TypographyBlockquote < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        blockquote(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("mt-6 border-l-2 pl-6 italic", @attrs.delete(:class))
        @attrs.merge(data_slot: "typography-blockquote", class: classes)
      end
    end

    class TypographyInlineCode < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        code(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "typography-inline-code", class: classes)
      end
    end

    class TypographyLead < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        p(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-xl text-muted-foreground", @attrs.delete(:class))
        @attrs.merge(data_slot: "typography-lead", class: classes)
      end
    end

    class TypographyLarge < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-lg font-semibold", @attrs.delete(:class))
        @attrs.merge(data_slot: "typography-large", class: classes)
      end
    end

    class TypographySmall < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        small(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm font-medium leading-none", @attrs.delete(:class))
        @attrs.merge(data_slot: "typography-small", class: classes)
      end
    end

    class TypographyMuted < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        p(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("text-sm text-muted-foreground", @attrs.delete(:class))
        @attrs.merge(data_slot: "typography-muted", class: classes)
      end
    end

    class TypographyList < Base
      def initialize(ordered: false, **attrs)
        @ordered = ordered
        @attrs = attrs
      end

      def view_template(&block)
        tag = @ordered ? :ol : :ul
        send(tag, **build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("my-6 ml-6 list-disc [&>li]:mt-2", @attrs.delete(:class))
        @attrs.merge(data_slot: "typography-list", class: classes)
      end
    end
  end
end
