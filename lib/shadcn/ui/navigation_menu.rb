# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui NavigationMenu
    class NavigationMenu < Base
      def initialize(viewport: true, **attrs)
        @viewport = viewport
        @attrs = attrs
      end

      def view_template(&block)
        nav(**build_attrs) do
          yield if block_given?
          render NavigationMenuViewport.new if @viewport
        end
      end

      private

      def build_attrs
        classes = cn(
          "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "navigation-menu",
          data_viewport: @viewport,
          class: classes
        )
      end
    end

    class NavigationMenuList < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        ul(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "group flex flex-1 list-none items-center justify-center gap-1",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "navigation-menu-list", class: classes)
      end
    end

    class NavigationMenuItem < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        li(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("relative", @attrs.delete(:class))
        @attrs.merge(data_slot: "navigation-menu-item", class: classes)
      end
    end

    class NavigationMenuTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs) do
          yield if block_given?
          plain " "
          svg(
            xmlns: "http://www.w3.org/2000/svg",
            width: "12", height: "12",
            viewbox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            stroke_linecap: "round",
            stroke_linejoin: "round",
            class: "relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180",
            aria_hidden: "true"
          ) do |s|
            s.path(d: "m6 9 6 6 6-6")
          end
        end
      end

      private

      def build_attrs
        classes = cn(
          "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium",
          "transition-[color,box-shadow] outline-none",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:bg-accent focus:text-accent-foreground",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
          "disabled:pointer-events-none disabled:opacity-50",
          "data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "navigation-menu-trigger", type: "button", class: classes)
      end
    end

    class NavigationMenuContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "top-0 left-0 w-full p-2 pr-2.5",
          "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52",
          "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
          "data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in",
          "data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out",
          "md:absolute md:w-auto",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "navigation-menu-content", class: classes)
      end
    end

    class NavigationMenuViewport < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template
        div(class: "absolute top-full left-0 isolate z-50 flex justify-center") do
          div(**build_attrs)
        end
      end

      private

      def build_attrs
        classes = cn(
          "origin-top-center relative mt-1.5 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow",
          "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:zoom-in-90",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "navigation-menu-viewport", class: classes)
      end
    end

    class NavigationMenuLink < Base
      def initialize(href: "#", active: false, **attrs)
        @href = href
        @active = active
        @attrs = attrs
      end

      def view_template(&block)
        a(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:bg-accent focus:text-accent-foreground",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
          "data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground",
          "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "navigation-menu-link",
          data_active: @active,
          href: @href,
          class: classes
        )
      end
    end

    class NavigationMenuIndicator < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template
        div(**build_attrs) do
          div(class: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md")
        end
      end

      private

      def build_attrs
        classes = cn(
          "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
          "data-[state=hidden]:animate-out data-[state=hidden]:fade-out",
          "data-[state=visible]:animate-in data-[state=visible]:fade-in",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "navigation-menu-indicator", class: classes)
      end
    end
  end
end
