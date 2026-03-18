# frozen_string_literal: true

module Shadcn
  module UI
    # Port of shadcn/ui Sidebar
    # Uses collapsible + sheet patterns for mobile
    class Sidebar < Base
      def initialize(side: :left, collapsible: :offcanvas, **attrs)
        @side = side
        @collapsible = collapsible
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "group/sidebar flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "sidebar-wrapper",
          data_side: @side,
          data_collapsible: @collapsible,
          class: classes
        )
      end
    end

    class SidebarPanel < Base
      def initialize(side: :left, variant: :sidebar, collapsible: :offcanvas, **attrs)
        @side = side
        @variant = variant
        @collapsible = collapsible
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs) do
          div(data_slot: "sidebar-container", class: sidebar_container_classes, &block)
        end
      end

      private

      def build_attrs
        classes = cn(
          "group peer hidden text-sidebar-foreground md:block",
          "data-[collapsible=offcanvas]:w-0 data-[collapsible=offcanvas]:opacity-0 data-[collapsible=offcanvas]:invisible",
          @collapsible == :none ? "" : "transition-[width,opacity] duration-200 ease-linear",
          @attrs.delete(:class)
        )
        @attrs.merge(
          data_slot: "sidebar",
          data_side: @side,
          data_variant: @variant,
          data_collapsible: @collapsible,
          class: classes
        )
      end

      def sidebar_container_classes
        cn(
          "flex h-full w-[--sidebar-width] flex-col bg-sidebar",
          "group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow",
          "group-data-[variant=inset]:bg-sidebar",
          "group-data-[side=left]:border-r group-data-[side=right]:border-l"
        )
      end
    end

    class SidebarHeader < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex flex-col gap-2 p-2", @attrs.delete(:class))
        @attrs.merge(data_slot: "sidebar-header", class: classes)
      end
    end

    class SidebarContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
          "group-data-[collapsible=icon]:overflow-hidden",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "sidebar-content", class: classes)
      end
    end

    class SidebarFooter < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex flex-col gap-2 p-2", @attrs.delete(:class))
        @attrs.merge(data_slot: "sidebar-footer", class: classes)
      end
    end

    class SidebarGroup < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("relative flex w-full min-w-0 flex-col p-2", @attrs.delete(:class))
        @attrs.merge(data_slot: "sidebar-group", class: classes)
      end
    end

    class SidebarGroupLabel < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70",
          "outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear",
          "focus-visible:ring-2",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          "[&>svg]:size-4 [&>svg]:shrink-0",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "sidebar-group-label", class: classes)
      end
    end

    class SidebarGroupContent < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        div(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("w-full text-sm", @attrs.delete(:class))
        @attrs.merge(data_slot: "sidebar-group-content", class: classes)
      end
    end

    class SidebarMenu < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        ul(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("flex w-full min-w-0 flex-col gap-1", @attrs.delete(:class))
        @attrs.merge(data_slot: "sidebar-menu", class: classes)
      end
    end

    class SidebarMenuItem < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        li(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn("group/menu-item relative", @attrs.delete(:class))
        @attrs.merge(data_slot: "sidebar-menu-item", class: classes)
      end
    end

    class SidebarMenuButton < Base
      VARIANTS = ClassVariants.build(
        base: [
          "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm",
          "outline-none ring-sidebar-ring transition-[width,height,padding]",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "focus-visible:ring-2",
          "active:bg-sidebar-accent active:text-sidebar-accent-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          "group-has-[[data-slot=sidebar-menu-action]]/menu-item:pr-8",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium",
          "data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
          "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
          "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
        ].join(" "),
        variants: {
          size: {
            default: "h-8 text-sm",
            sm: "h-7 text-xs",
            lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
          }
        },
        defaults: { size: :default }
      )

      def initialize(size: :default, active: false, **attrs)
        @size = size
        @active = active
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(VARIANTS.render(size: @size), @attrs.delete(:class))
        @attrs.merge(
          data_slot: "sidebar-menu-button",
          data_size: @size,
          data_active: @active,
          type: "button",
          class: classes
        )
      end
    end

    class SidebarMenuAction < Base
      def initialize(show_on_hover: false, **attrs)
        @show_on_hover = show_on_hover
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0",
          "text-sidebar-foreground outline-none ring-sidebar-ring transition-transform",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "focus-visible:ring-2",
          "peer-hover/menu-button:text-sidebar-accent-foreground",
          "[&>svg]:size-4 [&>svg]:shrink-0",
          @show_on_hover ? "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0" : "",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "sidebar-menu-action", type: "button", class: classes)
      end
    end

    class SidebarMenuSub < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        ul(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
          "group-data-[collapsible=icon]:hidden",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "sidebar-menu-sub", class: classes)
      end
    end

    class SidebarMenuSubItem < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        li(**build_attrs, &block)
      end

      private

      def build_attrs
        @attrs.merge(data_slot: "sidebar-menu-sub-item")
      end
    end

    class SidebarMenuSubButton < Base
      def initialize(active: false, size: :md, **attrs)
        @active = active
        @size = size
        @attrs = attrs
      end

      def view_template(&block)
        a(**build_attrs, &block)
      end

      private

      def build_attrs
        classes = cn(
          "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2",
          "text-sidebar-foreground outline-none ring-sidebar-ring",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
          "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
          "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
          @active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "",
          @size == :sm ? "text-xs" : "text-sm",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "sidebar-menu-sub-button", data_active: @active, data_size: @size, class: classes)
      end
    end

    class SidebarSeparator < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template
        div(**build_attrs)
      end

      private

      def build_attrs
        classes = cn("mx-2 h-px bg-sidebar-border", @attrs.delete(:class))
        @attrs.merge(data_slot: "sidebar-separator", class: classes)
      end
    end

    class SidebarTrigger < Base
      def initialize(**attrs)
        @attrs = attrs
      end

      def view_template(&block)
        button(**build_attrs) do
          if block_given?
            yield
          else
            # Default hamburger icon
            svg(xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16",
                viewbox: "0 0 24 24", fill: "none", stroke: "currentColor",
                stroke_width: "2", class: "size-4") do |s|
              s.line(x1: "3", x2: "21", y1: "6", y2: "6")
              s.line(x1: "3", x2: "21", y1: "12", y2: "12")
              s.line(x1: "3", x2: "21", y1: "18", y2: "18")
            end
            span(class: "sr-only") { "Toggle Sidebar" }
          end
        end
      end

      private

      def build_attrs
        classes = cn(
          "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium",
          "ring-ring transition-colors hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2",
          "h-7 w-7",
          @attrs.delete(:class)
        )
        @attrs.merge(data_slot: "sidebar-trigger", type: "button", class: classes)
      end
    end
  end
end
