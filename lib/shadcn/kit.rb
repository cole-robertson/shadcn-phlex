# frozen_string_literal: true

module Shadcn
  # Include this module in any Phlex view to get short helper methods
  # for all Shadcn UI components.
  #
  #   class MyView < Phlex::HTML
  #     include Shadcn::Kit
  #
  #     def view_template
  #       ui_card do
  #         ui_card_header do
  #           ui_card_title { "Hello" }
  #         end
  #         ui_card_content do
  #           ui_button(variant: :destructive) { "Delete" }
  #         end
  #       end
  #     end
  #   end
  module Kit
    # ── Accordion ──────────────────────────────────────────────

    def ui_accordion(**attrs, &block)
      render Shadcn::UI::Accordion.new(**attrs, &block)
    end

    def ui_accordion_item(**attrs, &block)
      render Shadcn::UI::AccordionItem.new(**attrs, &block)
    end

    def ui_accordion_trigger(**attrs, &block)
      render Shadcn::UI::AccordionTrigger.new(**attrs, &block)
    end

    def ui_accordion_content(**attrs, &block)
      render Shadcn::UI::AccordionContent.new(**attrs, &block)
    end

    # ── Alert ──────────────────────────────────────────────────

    def ui_alert(**attrs, &block)
      render Shadcn::UI::Alert.new(**attrs, &block)
    end

    def ui_alert_title(**attrs, &block)
      render Shadcn::UI::AlertTitle.new(**attrs, &block)
    end

    def ui_alert_description(**attrs, &block)
      render Shadcn::UI::AlertDescription.new(**attrs, &block)
    end

    # ── Alert Dialog ───────────────────────────────────────────

    def ui_alert_dialog(**attrs, &block)
      render Shadcn::UI::AlertDialog.new(**attrs, &block)
    end

    def ui_alert_dialog_trigger(**attrs, &block)
      render Shadcn::UI::AlertDialogTrigger.new(**attrs, &block)
    end

    def ui_alert_dialog_overlay(**attrs, &block)
      render Shadcn::UI::AlertDialogOverlay.new(**attrs, &block)
    end

    def ui_alert_dialog_content(**attrs, &block)
      render Shadcn::UI::AlertDialogContent.new(**attrs, &block)
    end

    def ui_alert_dialog_header(**attrs, &block)
      render Shadcn::UI::AlertDialogHeader.new(**attrs, &block)
    end

    def ui_alert_dialog_footer(**attrs, &block)
      render Shadcn::UI::AlertDialogFooter.new(**attrs, &block)
    end

    def ui_alert_dialog_title(**attrs, &block)
      render Shadcn::UI::AlertDialogTitle.new(**attrs, &block)
    end

    def ui_alert_dialog_description(**attrs, &block)
      render Shadcn::UI::AlertDialogDescription.new(**attrs, &block)
    end

    def ui_alert_dialog_action(**attrs, &block)
      render Shadcn::UI::AlertDialogAction.new(**attrs, &block)
    end

    def ui_alert_dialog_cancel(**attrs, &block)
      render Shadcn::UI::AlertDialogCancel.new(**attrs, &block)
    end

    # ── Aspect Ratio ───────────────────────────────────────────

    def ui_aspect_ratio(**attrs, &block)
      render Shadcn::UI::AspectRatio.new(**attrs, &block)
    end

    # ── Avatar ─────────────────────────────────────────────────

    def ui_avatar(**attrs, &block)
      render Shadcn::UI::Avatar.new(**attrs, &block)
    end

    def ui_avatar_image(**attrs, &block)
      render Shadcn::UI::AvatarImage.new(**attrs, &block)
    end

    def ui_avatar_fallback(**attrs, &block)
      render Shadcn::UI::AvatarFallback.new(**attrs, &block)
    end

    def ui_avatar_badge(**attrs, &block)
      render Shadcn::UI::AvatarBadge.new(**attrs, &block)
    end

    def ui_avatar_group(**attrs, &block)
      render Shadcn::UI::AvatarGroup.new(**attrs, &block)
    end

    def ui_avatar_group_count(**attrs, &block)
      render Shadcn::UI::AvatarGroupCount.new(**attrs, &block)
    end

    # ── Badge ──────────────────────────────────────────────────

    def ui_badge(**attrs, &block)
      render Shadcn::UI::Badge.new(**attrs, &block)
    end

    # ── Breadcrumb ─────────────────────────────────────────────

    def ui_breadcrumb(**attrs, &block)
      render Shadcn::UI::Breadcrumb.new(**attrs, &block)
    end

    def ui_breadcrumb_list(**attrs, &block)
      render Shadcn::UI::BreadcrumbList.new(**attrs, &block)
    end

    def ui_breadcrumb_item(**attrs, &block)
      render Shadcn::UI::BreadcrumbItem.new(**attrs, &block)
    end

    def ui_breadcrumb_link(**attrs, &block)
      render Shadcn::UI::BreadcrumbLink.new(**attrs, &block)
    end

    def ui_breadcrumb_page(**attrs, &block)
      render Shadcn::UI::BreadcrumbPage.new(**attrs, &block)
    end

    def ui_breadcrumb_separator(**attrs, &block)
      render Shadcn::UI::BreadcrumbSeparator.new(**attrs, &block)
    end

    def ui_breadcrumb_ellipsis(**attrs, &block)
      render Shadcn::UI::BreadcrumbEllipsis.new(**attrs, &block)
    end

    # ── Button ─────────────────────────────────────────────────

    def ui_button(**attrs, &block)
      render Shadcn::UI::Button.new(**attrs, &block)
    end

    def ui_button_group(**attrs, &block)
      render Shadcn::UI::ButtonGroup.new(**attrs, &block)
    end

    def ui_button_group_text(**attrs, &block)
      render Shadcn::UI::ButtonGroupText.new(**attrs, &block)
    end

    # ── Card ───────────────────────────────────────────────────

    def ui_card(**attrs, &block)
      render Shadcn::UI::Card.new(**attrs, &block)
    end

    def ui_card_header(**attrs, &block)
      render Shadcn::UI::CardHeader.new(**attrs, &block)
    end

    def ui_card_title(**attrs, &block)
      render Shadcn::UI::CardTitle.new(**attrs, &block)
    end

    def ui_card_description(**attrs, &block)
      render Shadcn::UI::CardDescription.new(**attrs, &block)
    end

    def ui_card_action(**attrs, &block)
      render Shadcn::UI::CardAction.new(**attrs, &block)
    end

    def ui_card_content(**attrs, &block)
      render Shadcn::UI::CardContent.new(**attrs, &block)
    end

    def ui_card_footer(**attrs, &block)
      render Shadcn::UI::CardFooter.new(**attrs, &block)
    end

    # ── Checkbox ───────────────────────────────────────────────

    def ui_checkbox(**attrs, &block)
      render Shadcn::UI::Checkbox.new(**attrs, &block)
    end

    # ── Collapsible ────────────────────────────────────────────

    def ui_collapsible(**attrs, &block)
      render Shadcn::UI::Collapsible.new(**attrs, &block)
    end

    def ui_collapsible_trigger(**attrs, &block)
      render Shadcn::UI::CollapsibleTrigger.new(**attrs, &block)
    end

    def ui_collapsible_content(**attrs, &block)
      render Shadcn::UI::CollapsibleContent.new(**attrs, &block)
    end

    # ── Combobox ───────────────────────────────────────────────

    def ui_combobox(**attrs, &block)
      render Shadcn::UI::Combobox.new(**attrs, &block)
    end

    def ui_combobox_trigger(**attrs, &block)
      render Shadcn::UI::ComboboxTrigger.new(**attrs, &block)
    end

    def ui_combobox_value(**attrs, &block)
      render Shadcn::UI::ComboboxValue.new(**attrs, &block)
    end

    def ui_combobox_content(**attrs, &block)
      render Shadcn::UI::ComboboxContent.new(**attrs, &block)
    end

    def ui_combobox_input(**attrs, &block)
      render Shadcn::UI::ComboboxInput.new(**attrs, &block)
    end

    def ui_combobox_item(**attrs, &block)
      render Shadcn::UI::ComboboxItem.new(**attrs, &block)
    end

    def ui_combobox_empty(**attrs, &block)
      render Shadcn::UI::ComboboxEmpty.new(**attrs, &block)
    end

    # ── Command ────────────────────────────────────────────────

    def ui_command(**attrs, &block)
      render Shadcn::UI::Command.new(**attrs, &block)
    end

    def ui_command_dialog(**attrs, &block)
      render Shadcn::UI::CommandDialog.new(**attrs, &block)
    end

    def ui_command_input(**attrs, &block)
      render Shadcn::UI::CommandInput.new(**attrs, &block)
    end

    def ui_command_list(**attrs, &block)
      render Shadcn::UI::CommandList.new(**attrs, &block)
    end

    def ui_command_empty(**attrs, &block)
      render Shadcn::UI::CommandEmpty.new(**attrs, &block)
    end

    def ui_command_group(**attrs, &block)
      render Shadcn::UI::CommandGroup.new(**attrs, &block)
    end

    def ui_command_item(**attrs, &block)
      render Shadcn::UI::CommandItem.new(**attrs, &block)
    end

    def ui_command_separator(**attrs, &block)
      render Shadcn::UI::CommandSeparator.new(**attrs, &block)
    end

    def ui_command_shortcut(**attrs, &block)
      render Shadcn::UI::CommandShortcut.new(**attrs, &block)
    end

    # ── Context Menu ───────────────────────────────────────────

    def ui_context_menu(**attrs, &block)
      render Shadcn::UI::ContextMenu.new(**attrs, &block)
    end

    def ui_context_menu_trigger(**attrs, &block)
      render Shadcn::UI::ContextMenuTrigger.new(**attrs, &block)
    end

    def ui_context_menu_content(**attrs, &block)
      render Shadcn::UI::ContextMenuContent.new(**attrs, &block)
    end

    def ui_context_menu_item(**attrs, &block)
      render Shadcn::UI::ContextMenuItem.new(**attrs, &block)
    end

    def ui_context_menu_checkbox_item(**attrs, &block)
      render Shadcn::UI::ContextMenuCheckboxItem.new(**attrs, &block)
    end

    def ui_context_menu_radio_group(**attrs, &block)
      render Shadcn::UI::ContextMenuRadioGroup.new(**attrs, &block)
    end

    def ui_context_menu_radio_item(**attrs, &block)
      render Shadcn::UI::ContextMenuRadioItem.new(**attrs, &block)
    end

    def ui_context_menu_label(**attrs, &block)
      render Shadcn::UI::ContextMenuLabel.new(**attrs, &block)
    end

    def ui_context_menu_separator(**attrs, &block)
      render Shadcn::UI::ContextMenuSeparator.new(**attrs, &block)
    end

    def ui_context_menu_shortcut(**attrs, &block)
      render Shadcn::UI::ContextMenuShortcut.new(**attrs, &block)
    end

    def ui_context_menu_sub_trigger(**attrs, &block)
      render Shadcn::UI::ContextMenuSubTrigger.new(**attrs, &block)
    end

    def ui_context_menu_sub_content(**attrs, &block)
      render Shadcn::UI::ContextMenuSubContent.new(**attrs, &block)
    end

    # ── Dialog ─────────────────────────────────────────────────

    def ui_dialog(**attrs, &block)
      render Shadcn::UI::Dialog.new(**attrs, &block)
    end

    def ui_dialog_trigger(**attrs, &block)
      render Shadcn::UI::DialogTrigger.new(**attrs, &block)
    end

    def ui_dialog_overlay(**attrs, &block)
      render Shadcn::UI::DialogOverlay.new(**attrs, &block)
    end

    def ui_dialog_content(**attrs, &block)
      render Shadcn::UI::DialogContent.new(**attrs, &block)
    end

    def ui_dialog_header(**attrs, &block)
      render Shadcn::UI::DialogHeader.new(**attrs, &block)
    end

    def ui_dialog_footer(**attrs, &block)
      render Shadcn::UI::DialogFooter.new(**attrs, &block)
    end

    def ui_dialog_title(**attrs, &block)
      render Shadcn::UI::DialogTitle.new(**attrs, &block)
    end

    def ui_dialog_description(**attrs, &block)
      render Shadcn::UI::DialogDescription.new(**attrs, &block)
    end

    def ui_dialog_close(**attrs, &block)
      render Shadcn::UI::DialogClose.new(**attrs, &block)
    end

    # ── Direction ──────────────────────────────────────────────

    def ui_direction(**attrs, &block)
      render Shadcn::UI::Direction.new(**attrs, &block)
    end

    # ── Drawer ─────────────────────────────────────────────────

    def ui_drawer(**attrs, &block)
      render Shadcn::UI::Drawer.new(**attrs, &block)
    end

    def ui_drawer_trigger(**attrs, &block)
      render Shadcn::UI::DrawerTrigger.new(**attrs, &block)
    end

    def ui_drawer_overlay(**attrs, &block)
      render Shadcn::UI::DrawerOverlay.new(**attrs, &block)
    end

    def ui_drawer_content(**attrs, &block)
      render Shadcn::UI::DrawerContent.new(**attrs, &block)
    end

    def ui_drawer_header(**attrs, &block)
      render Shadcn::UI::DrawerHeader.new(**attrs, &block)
    end

    def ui_drawer_footer(**attrs, &block)
      render Shadcn::UI::DrawerFooter.new(**attrs, &block)
    end

    def ui_drawer_title(**attrs, &block)
      render Shadcn::UI::DrawerTitle.new(**attrs, &block)
    end

    def ui_drawer_description(**attrs, &block)
      render Shadcn::UI::DrawerDescription.new(**attrs, &block)
    end

    def ui_drawer_close(**attrs, &block)
      render Shadcn::UI::DrawerClose.new(**attrs, &block)
    end

    # ── Dropdown Menu ──────────────────────────────────────────

    def ui_dropdown_menu(**attrs, &block)
      render Shadcn::UI::DropdownMenu.new(**attrs, &block)
    end

    def ui_dropdown_menu_trigger(**attrs, &block)
      render Shadcn::UI::DropdownMenuTrigger.new(**attrs, &block)
    end

    def ui_dropdown_menu_content(**attrs, &block)
      render Shadcn::UI::DropdownMenuContent.new(**attrs, &block)
    end

    def ui_dropdown_menu_item(**attrs, &block)
      render Shadcn::UI::DropdownMenuItem.new(**attrs, &block)
    end

    def ui_dropdown_menu_checkbox_item(**attrs, &block)
      render Shadcn::UI::DropdownMenuCheckboxItem.new(**attrs, &block)
    end

    def ui_dropdown_menu_radio_group(**attrs, &block)
      render Shadcn::UI::DropdownMenuRadioGroup.new(**attrs, &block)
    end

    def ui_dropdown_menu_radio_item(**attrs, &block)
      render Shadcn::UI::DropdownMenuRadioItem.new(**attrs, &block)
    end

    def ui_dropdown_menu_label(**attrs, &block)
      render Shadcn::UI::DropdownMenuLabel.new(**attrs, &block)
    end

    def ui_dropdown_menu_separator(**attrs, &block)
      render Shadcn::UI::DropdownMenuSeparator.new(**attrs, &block)
    end

    def ui_dropdown_menu_shortcut(**attrs, &block)
      render Shadcn::UI::DropdownMenuShortcut.new(**attrs, &block)
    end

    def ui_dropdown_menu_group(**attrs, &block)
      render Shadcn::UI::DropdownMenuGroup.new(**attrs, &block)
    end

    def ui_dropdown_menu_sub_trigger(**attrs, &block)
      render Shadcn::UI::DropdownMenuSubTrigger.new(**attrs, &block)
    end

    def ui_dropdown_menu_sub_content(**attrs, &block)
      render Shadcn::UI::DropdownMenuSubContent.new(**attrs, &block)
    end

    # ── Empty ──────────────────────────────────────────────────

    def ui_empty(**attrs, &block)
      render Shadcn::UI::Empty.new(**attrs, &block)
    end

    def ui_empty_media(**attrs, &block)
      render Shadcn::UI::EmptyMedia.new(**attrs, &block)
    end

    def ui_empty_title(**attrs, &block)
      render Shadcn::UI::EmptyTitle.new(**attrs, &block)
    end

    def ui_empty_description(**attrs, &block)
      render Shadcn::UI::EmptyDescription.new(**attrs, &block)
    end

    def ui_empty_actions(**attrs, &block)
      render Shadcn::UI::EmptyActions.new(**attrs, &block)
    end

    # ── Field ──────────────────────────────────────────────────

    def ui_field(**attrs, &block)
      render Shadcn::UI::Field.new(**attrs, &block)
    end

    def ui_field_control(**attrs, &block)
      render Shadcn::UI::FieldControl.new(**attrs, &block)
    end

    def ui_field_description(**attrs, &block)
      render Shadcn::UI::FieldDescription.new(**attrs, &block)
    end

    def ui_field_error(**attrs, &block)
      render Shadcn::UI::FieldError.new(**attrs, &block)
    end

    def ui_fieldset(**attrs, &block)
      render Shadcn::UI::Fieldset.new(**attrs, &block)
    end

    def ui_fieldset_legend(**attrs, &block)
      render Shadcn::UI::FieldsetLegend.new(**attrs, &block)
    end

    # ── Hover Card ─────────────────────────────────────────────

    def ui_hover_card(**attrs, &block)
      render Shadcn::UI::HoverCard.new(**attrs, &block)
    end

    def ui_hover_card_trigger(**attrs, &block)
      render Shadcn::UI::HoverCardTrigger.new(**attrs, &block)
    end

    def ui_hover_card_content(**attrs, &block)
      render Shadcn::UI::HoverCardContent.new(**attrs, &block)
    end

    # ── Input ──────────────────────────────────────────────────

    def ui_input(**attrs, &block)
      render Shadcn::UI::Input.new(**attrs, &block)
    end

    def ui_input_group(**attrs, &block)
      render Shadcn::UI::InputGroup.new(**attrs, &block)
    end

    # ── Input OTP ──────────────────────────────────────────────

    def ui_input_otp(**attrs, &block)
      render Shadcn::UI::InputOTP.new(**attrs, &block)
    end

    def ui_input_otp_group(**attrs, &block)
      render Shadcn::UI::InputOTPGroup.new(**attrs, &block)
    end

    def ui_input_otp_slot(**attrs, &block)
      render Shadcn::UI::InputOTPSlot.new(**attrs, &block)
    end

    def ui_input_otp_separator(**attrs, &block)
      render Shadcn::UI::InputOTPSeparator.new(**attrs, &block)
    end

    # ── Item ───────────────────────────────────────────────────

    def ui_item(**attrs, &block)
      render Shadcn::UI::Item.new(**attrs, &block)
    end

    def ui_item_media(**attrs, &block)
      render Shadcn::UI::ItemMedia.new(**attrs, &block)
    end

    def ui_item_content(**attrs, &block)
      render Shadcn::UI::ItemContent.new(**attrs, &block)
    end

    def ui_item_title(**attrs, &block)
      render Shadcn::UI::ItemTitle.new(**attrs, &block)
    end

    def ui_item_description(**attrs, &block)
      render Shadcn::UI::ItemDescription.new(**attrs, &block)
    end

    def ui_item_actions(**attrs, &block)
      render Shadcn::UI::ItemActions.new(**attrs, &block)
    end

    # ── Kbd ────────────────────────────────────────────────────

    def ui_kbd(**attrs, &block)
      render Shadcn::UI::Kbd.new(**attrs, &block)
    end

    def ui_kbd_group(**attrs, &block)
      render Shadcn::UI::KbdGroup.new(**attrs, &block)
    end

    # ── Label ──────────────────────────────────────────────────

    def ui_label(**attrs, &block)
      render Shadcn::UI::Label.new(**attrs, &block)
    end

    # ── Menubar ────────────────────────────────────────────────

    def ui_menubar(**attrs, &block)
      render Shadcn::UI::Menubar.new(**attrs, &block)
    end

    def ui_menubar_menu(**attrs, &block)
      render Shadcn::UI::MenubarMenu.new(**attrs, &block)
    end

    def ui_menubar_trigger(**attrs, &block)
      render Shadcn::UI::MenubarTrigger.new(**attrs, &block)
    end

    def ui_menubar_content(**attrs, &block)
      render Shadcn::UI::MenubarContent.new(**attrs, &block)
    end

    def ui_menubar_item(**attrs, &block)
      render Shadcn::UI::MenubarItem.new(**attrs, &block)
    end

    def ui_menubar_checkbox_item(**attrs, &block)
      render Shadcn::UI::MenubarCheckboxItem.new(**attrs, &block)
    end

    def ui_menubar_radio_group(**attrs, &block)
      render Shadcn::UI::MenubarRadioGroup.new(**attrs, &block)
    end

    def ui_menubar_radio_item(**attrs, &block)
      render Shadcn::UI::MenubarRadioItem.new(**attrs, &block)
    end

    def ui_menubar_label(**attrs, &block)
      render Shadcn::UI::MenubarLabel.new(**attrs, &block)
    end

    def ui_menubar_separator(**attrs, &block)
      render Shadcn::UI::MenubarSeparator.new(**attrs, &block)
    end

    def ui_menubar_shortcut(**attrs, &block)
      render Shadcn::UI::MenubarShortcut.new(**attrs, &block)
    end

    def ui_menubar_sub_trigger(**attrs, &block)
      render Shadcn::UI::MenubarSubTrigger.new(**attrs, &block)
    end

    def ui_menubar_sub_content(**attrs, &block)
      render Shadcn::UI::MenubarSubContent.new(**attrs, &block)
    end

    # ── Native Select ──────────────────────────────────────────

    def ui_native_select(**attrs, &block)
      render Shadcn::UI::NativeSelect.new(**attrs, &block)
    end

    # ── Navigation Menu ────────────────────────────────────────

    def ui_navigation_menu(**attrs, &block)
      render Shadcn::UI::NavigationMenu.new(**attrs, &block)
    end

    def ui_navigation_menu_list(**attrs, &block)
      render Shadcn::UI::NavigationMenuList.new(**attrs, &block)
    end

    def ui_navigation_menu_item(**attrs, &block)
      render Shadcn::UI::NavigationMenuItem.new(**attrs, &block)
    end

    def ui_navigation_menu_trigger(**attrs, &block)
      render Shadcn::UI::NavigationMenuTrigger.new(**attrs, &block)
    end

    def ui_navigation_menu_content(**attrs, &block)
      render Shadcn::UI::NavigationMenuContent.new(**attrs, &block)
    end

    def ui_navigation_menu_link(**attrs, &block)
      render Shadcn::UI::NavigationMenuLink.new(**attrs, &block)
    end

    def ui_navigation_menu_viewport(**attrs, &block)
      render Shadcn::UI::NavigationMenuViewport.new(**attrs, &block)
    end

    def ui_navigation_menu_indicator(**attrs, &block)
      render Shadcn::UI::NavigationMenuIndicator.new(**attrs, &block)
    end

    # ── Pagination ─────────────────────────────────────────────

    def ui_pagination(**attrs, &block)
      render Shadcn::UI::Pagination.new(**attrs, &block)
    end

    def ui_pagination_content(**attrs, &block)
      render Shadcn::UI::PaginationContent.new(**attrs, &block)
    end

    def ui_pagination_item(**attrs, &block)
      render Shadcn::UI::PaginationItem.new(**attrs, &block)
    end

    def ui_pagination_link(**attrs, &block)
      render Shadcn::UI::PaginationLink.new(**attrs, &block)
    end

    def ui_pagination_previous(**attrs, &block)
      render Shadcn::UI::PaginationPrevious.new(**attrs, &block)
    end

    def ui_pagination_next(**attrs, &block)
      render Shadcn::UI::PaginationNext.new(**attrs, &block)
    end

    def ui_pagination_ellipsis(**attrs, &block)
      render Shadcn::UI::PaginationEllipsis.new(**attrs, &block)
    end

    # ── Popover ────────────────────────────────────────────────

    def ui_popover(**attrs, &block)
      render Shadcn::UI::Popover.new(**attrs, &block)
    end

    def ui_popover_trigger(**attrs, &block)
      render Shadcn::UI::PopoverTrigger.new(**attrs, &block)
    end

    def ui_popover_content(**attrs, &block)
      render Shadcn::UI::PopoverContent.new(**attrs, &block)
    end

    def ui_popover_anchor(**attrs, &block)
      render Shadcn::UI::PopoverAnchor.new(**attrs, &block)
    end

    def ui_popover_header(**attrs, &block)
      render Shadcn::UI::PopoverHeader.new(**attrs, &block)
    end

    def ui_popover_title(**attrs, &block)
      render Shadcn::UI::PopoverTitle.new(**attrs, &block)
    end

    def ui_popover_description(**attrs, &block)
      render Shadcn::UI::PopoverDescription.new(**attrs, &block)
    end

    # ── Progress ───────────────────────────────────────────────

    def ui_progress(**attrs, &block)
      render Shadcn::UI::Progress.new(**attrs, &block)
    end

    # ── Radio Group ────────────────────────────────────────────

    def ui_radio_group(**attrs, &block)
      render Shadcn::UI::RadioGroup.new(**attrs, &block)
    end

    def ui_radio_group_item(**attrs, &block)
      render Shadcn::UI::RadioGroupItem.new(**attrs, &block)
    end

    # ── Resizable ──────────────────────────────────────────────

    def ui_resizable_panel_group(**attrs, &block)
      render Shadcn::UI::ResizablePanelGroup.new(**attrs, &block)
    end

    def ui_resizable_panel(**attrs, &block)
      render Shadcn::UI::ResizablePanel.new(**attrs, &block)
    end

    def ui_resizable_handle(**attrs, &block)
      render Shadcn::UI::ResizableHandle.new(**attrs, &block)
    end

    # ── Scroll Area ────────────────────────────────────────────

    def ui_scroll_area(**attrs, &block)
      render Shadcn::UI::ScrollArea.new(**attrs, &block)
    end

    def ui_scroll_bar(**attrs, &block)
      render Shadcn::UI::ScrollBar.new(**attrs, &block)
    end

    # ── Select ─────────────────────────────────────────────────

    def ui_select(**attrs, &block)
      render Shadcn::UI::Select.new(**attrs, &block)
    end

    def ui_select_trigger(**attrs, &block)
      render Shadcn::UI::SelectTrigger.new(**attrs, &block)
    end

    def ui_select_value(**attrs, &block)
      render Shadcn::UI::SelectValue.new(**attrs, &block)
    end

    def ui_select_content(**attrs, &block)
      render Shadcn::UI::SelectContent.new(**attrs, &block)
    end

    def ui_select_group(**attrs, &block)
      render Shadcn::UI::SelectGroup.new(**attrs, &block)
    end

    def ui_select_item(**attrs, &block)
      render Shadcn::UI::SelectItem.new(**attrs, &block)
    end

    def ui_select_label(**attrs, &block)
      render Shadcn::UI::SelectLabel.new(**attrs, &block)
    end

    def ui_select_separator(**attrs, &block)
      render Shadcn::UI::SelectSeparator.new(**attrs, &block)
    end

    # ── Separator ──────────────────────────────────────────────

    def ui_separator(**attrs, &block)
      render Shadcn::UI::Separator.new(**attrs, &block)
    end

    # ── Sheet ──────────────────────────────────────────────────

    def ui_sheet(**attrs, &block)
      render Shadcn::UI::Sheet.new(**attrs, &block)
    end

    def ui_sheet_trigger(**attrs, &block)
      render Shadcn::UI::SheetTrigger.new(**attrs, &block)
    end

    def ui_sheet_overlay(**attrs, &block)
      render Shadcn::UI::SheetOverlay.new(**attrs, &block)
    end

    def ui_sheet_content(**attrs, &block)
      render Shadcn::UI::SheetContent.new(**attrs, &block)
    end

    def ui_sheet_header(**attrs, &block)
      render Shadcn::UI::SheetHeader.new(**attrs, &block)
    end

    def ui_sheet_footer(**attrs, &block)
      render Shadcn::UI::SheetFooter.new(**attrs, &block)
    end

    def ui_sheet_title(**attrs, &block)
      render Shadcn::UI::SheetTitle.new(**attrs, &block)
    end

    def ui_sheet_description(**attrs, &block)
      render Shadcn::UI::SheetDescription.new(**attrs, &block)
    end

    def ui_sheet_close(**attrs, &block)
      render Shadcn::UI::SheetClose.new(**attrs, &block)
    end

    # ── Sidebar ────────────────────────────────────────────────

    def ui_sidebar(**attrs, &block)
      render Shadcn::UI::Sidebar.new(**attrs, &block)
    end

    def ui_sidebar_header(**attrs, &block)
      render Shadcn::UI::SidebarHeader.new(**attrs, &block)
    end

    def ui_sidebar_content(**attrs, &block)
      render Shadcn::UI::SidebarContent.new(**attrs, &block)
    end

    def ui_sidebar_footer(**attrs, &block)
      render Shadcn::UI::SidebarFooter.new(**attrs, &block)
    end

    def ui_sidebar_group(**attrs, &block)
      render Shadcn::UI::SidebarGroup.new(**attrs, &block)
    end

    def ui_sidebar_group_label(**attrs, &block)
      render Shadcn::UI::SidebarGroupLabel.new(**attrs, &block)
    end

    def ui_sidebar_group_content(**attrs, &block)
      render Shadcn::UI::SidebarGroupContent.new(**attrs, &block)
    end

    def ui_sidebar_menu(**attrs, &block)
      render Shadcn::UI::SidebarMenu.new(**attrs, &block)
    end

    def ui_sidebar_menu_item(**attrs, &block)
      render Shadcn::UI::SidebarMenuItem.new(**attrs, &block)
    end

    def ui_sidebar_menu_button(**attrs, &block)
      render Shadcn::UI::SidebarMenuButton.new(**attrs, &block)
    end

    def ui_sidebar_menu_action(**attrs, &block)
      render Shadcn::UI::SidebarMenuAction.new(**attrs, &block)
    end

    def ui_sidebar_menu_sub(**attrs, &block)
      render Shadcn::UI::SidebarMenuSub.new(**attrs, &block)
    end

    def ui_sidebar_menu_sub_item(**attrs, &block)
      render Shadcn::UI::SidebarMenuSubItem.new(**attrs, &block)
    end

    def ui_sidebar_menu_sub_button(**attrs, &block)
      render Shadcn::UI::SidebarMenuSubButton.new(**attrs, &block)
    end

    def ui_sidebar_panel(**attrs, &block)
      render Shadcn::UI::SidebarPanel.new(**attrs, &block)
    end

    def ui_sidebar_separator(**attrs, &block)
      render Shadcn::UI::SidebarSeparator.new(**attrs, &block)
    end

    def ui_sidebar_trigger(**attrs, &block)
      render Shadcn::UI::SidebarTrigger.new(**attrs, &block)
    end

    # ── Skeleton ───────────────────────────────────────────────

    def ui_skeleton(**attrs, &block)
      render Shadcn::UI::Skeleton.new(**attrs, &block)
    end

    # ── Slider ─────────────────────────────────────────────────

    def ui_slider(**attrs, &block)
      render Shadcn::UI::Slider.new(**attrs, &block)
    end

    # ── Spinner ────────────────────────────────────────────────

    def ui_spinner(**attrs, &block)
      render Shadcn::UI::Spinner.new(**attrs, &block)
    end

    # ── Switch ─────────────────────────────────────────────────

    def ui_switch(**attrs, &block)
      render Shadcn::UI::Switch.new(**attrs, &block)
    end

    # ── Table ──────────────────────────────────────────────────

    def ui_table(**attrs, &block)
      render Shadcn::UI::Table.new(**attrs, &block)
    end

    def ui_table_header(**attrs, &block)
      render Shadcn::UI::TableHeader.new(**attrs, &block)
    end

    def ui_table_body(**attrs, &block)
      render Shadcn::UI::TableBody.new(**attrs, &block)
    end

    def ui_table_footer(**attrs, &block)
      render Shadcn::UI::TableFooter.new(**attrs, &block)
    end

    def ui_table_row(**attrs, &block)
      render Shadcn::UI::TableRow.new(**attrs, &block)
    end

    def ui_table_head(**attrs, &block)
      render Shadcn::UI::TableHead.new(**attrs, &block)
    end

    def ui_table_cell(**attrs, &block)
      render Shadcn::UI::TableCell.new(**attrs, &block)
    end

    def ui_table_caption(**attrs, &block)
      render Shadcn::UI::TableCaption.new(**attrs, &block)
    end

    # ── Tabs ───────────────────────────────────────────────────

    def ui_tabs(**attrs, &block)
      render Shadcn::UI::Tabs.new(**attrs, &block)
    end

    def ui_tabs_list(**attrs, &block)
      render Shadcn::UI::TabsList.new(**attrs, &block)
    end

    def ui_tabs_trigger(**attrs, &block)
      render Shadcn::UI::TabsTrigger.new(**attrs, &block)
    end

    def ui_tabs_content(**attrs, &block)
      render Shadcn::UI::TabsContent.new(**attrs, &block)
    end

    # ── Textarea ───────────────────────────────────────────────

    def ui_textarea(**attrs, &block)
      render Shadcn::UI::Textarea.new(**attrs, &block)
    end

    # ── Toast / Sonner ─────────────────────────────────────────

    def ui_toaster(**attrs, &block)
      render Shadcn::UI::Toaster.new(**attrs, &block)
    end

    def ui_toast(**attrs, &block)
      render Shadcn::UI::Toast.new(**attrs, &block)
    end

    def ui_toast_title(**attrs, &block)
      render Shadcn::UI::ToastTitle.new(**attrs, &block)
    end

    def ui_toast_description(**attrs, &block)
      render Shadcn::UI::ToastDescription.new(**attrs, &block)
    end

    def ui_toast_action(**attrs, &block)
      render Shadcn::UI::ToastAction.new(**attrs, &block)
    end

    def ui_toast_close(**attrs, &block)
      render Shadcn::UI::ToastClose.new(**attrs, &block)
    end

    # ── Toggle ─────────────────────────────────────────────────

    def ui_toggle(**attrs, &block)
      render Shadcn::UI::Toggle.new(**attrs, &block)
    end

    def ui_toggle_group(**attrs, &block)
      render Shadcn::UI::ToggleGroup.new(**attrs, &block)
    end

    def ui_toggle_group_item(**attrs, &block)
      render Shadcn::UI::ToggleGroupItem.new(**attrs, &block)
    end

    # ── Tooltip ────────────────────────────────────────────────

    def ui_tooltip(**attrs, &block)
      render Shadcn::UI::Tooltip.new(**attrs, &block)
    end

    def ui_tooltip_trigger(**attrs, &block)
      render Shadcn::UI::TooltipTrigger.new(**attrs, &block)
    end

    def ui_tooltip_content(**attrs, &block)
      render Shadcn::UI::TooltipContent.new(**attrs, &block)
    end

    # ── Typography ─────────────────────────────────────────────

    def ui_typography_h1(**attrs, &block)
      render Shadcn::UI::TypographyH1.new(**attrs, &block)
    end

    def ui_typography_h2(**attrs, &block)
      render Shadcn::UI::TypographyH2.new(**attrs, &block)
    end

    def ui_typography_h3(**attrs, &block)
      render Shadcn::UI::TypographyH3.new(**attrs, &block)
    end

    def ui_typography_h4(**attrs, &block)
      render Shadcn::UI::TypographyH4.new(**attrs, &block)
    end

    def ui_typography_p(**attrs, &block)
      render Shadcn::UI::TypographyP.new(**attrs, &block)
    end

    def ui_typography_blockquote(**attrs, &block)
      render Shadcn::UI::TypographyBlockquote.new(**attrs, &block)
    end

    def ui_typography_inline_code(**attrs, &block)
      render Shadcn::UI::TypographyInlineCode.new(**attrs, &block)
    end

    def ui_typography_lead(**attrs, &block)
      render Shadcn::UI::TypographyLead.new(**attrs, &block)
    end

    def ui_typography_large(**attrs, &block)
      render Shadcn::UI::TypographyLarge.new(**attrs, &block)
    end

    def ui_typography_small(**attrs, &block)
      render Shadcn::UI::TypographySmall.new(**attrs, &block)
    end

    def ui_typography_muted(**attrs, &block)
      render Shadcn::UI::TypographyMuted.new(**attrs, &block)
    end

    def ui_typography_list(**attrs, &block)
      render Shadcn::UI::TypographyList.new(**attrs, &block)
    end

    # ── Compound Field Helpers ─────────────────────────────────

    def ui_text_field(**attrs, &block)
      render Shadcn::UI::TextField.new(**attrs, &block)
    end

    def ui_textarea_field(**attrs, &block)
      render Shadcn::UI::TextareaField.new(**attrs, &block)
    end

    # ── Theme Toggle ───────────────────────────────────────────

    def ui_theme_toggle(**attrs, &block)
      render Shadcn::UI::ThemeToggle.new(**attrs, &block)
    end
  end
end
