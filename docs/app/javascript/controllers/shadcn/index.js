// Shadcn Phlex Stimulus Controllers
// Register all controllers with your Stimulus application
//
// Usage with importmap-rails or jsbundling:
//   import { application } from "controllers/application"
//   import { registerShadcnControllers } from "shadcn/controllers"
//   registerShadcnControllers(application)

import AccordionController from "./accordion_controller"
import DarkModeController from "./dark_mode_controller"
import CheckboxController from "./checkbox_controller"
import CollapsibleController from "./collapsible_controller"
import ComboboxController from "./combobox_controller"
import CommandController from "./command_controller"
import ContextMenuController from "./context_menu_controller"
import DialogController from "./dialog_controller"
import DrawerController from "./drawer_controller"
import DropdownMenuController from "./dropdown_menu_controller"
import HoverCardController from "./hover_card_controller"
import MenubarController from "./menubar_controller"
import NavigationMenuController from "./navigation_menu_controller"
import PopoverController from "./popover_controller"
import RadioGroupController from "./radio_group_controller"
import ScrollAreaController from "./scroll_area_controller"
import SelectController from "./select_controller"
import SheetController from "./sheet_controller"
import SliderController from "./slider_controller"
import SwitchController from "./switch_controller"
import TabsController from "./tabs_controller"
import ToastController from "./toast_controller"
import ToggleController from "./toggle_controller"
import ToggleGroupController from "./toggle_group_controller"
import TooltipController from "./tooltip_controller"

export function registerShadcnControllers(application) {
  application.register("shadcn--accordion", AccordionController)
  application.register("shadcn--dark-mode", DarkModeController)
  application.register("shadcn--checkbox", CheckboxController)
  application.register("shadcn--collapsible", CollapsibleController)
  application.register("shadcn--combobox", ComboboxController)
  application.register("shadcn--command", CommandController)
  application.register("shadcn--context-menu", ContextMenuController)
  application.register("shadcn--dialog", DialogController)
  application.register("shadcn--drawer", DrawerController)
  application.register("shadcn--dropdown-menu", DropdownMenuController)
  application.register("shadcn--hover-card", HoverCardController)
  application.register("shadcn--menubar", MenubarController)
  application.register("shadcn--navigation-menu", NavigationMenuController)
  application.register("shadcn--popover", PopoverController)
  application.register("shadcn--radio-group", RadioGroupController)
  application.register("shadcn--scroll-area", ScrollAreaController)
  application.register("shadcn--select", SelectController)
  application.register("shadcn--sheet", SheetController)
  application.register("shadcn--slider", SliderController)
  application.register("shadcn--switch", SwitchController)
  application.register("shadcn--tabs", TabsController)
  application.register("shadcn--toast", ToastController)
  application.register("shadcn--toggle", ToggleController)
  application.register("shadcn--toggle-group", ToggleGroupController)
  application.register("shadcn--tooltip", TooltipController)
}

export {
  AccordionController,
  DarkModeController,
  CheckboxController,
  CollapsibleController,
  ComboboxController,
  CommandController,
  ContextMenuController,
  DialogController,
  DrawerController,
  DropdownMenuController,
  HoverCardController,
  MenubarController,
  NavigationMenuController,
  PopoverController,
  RadioGroupController,
  ScrollAreaController,
  SelectController,
  SheetController,
  SliderController,
  SwitchController,
  TabsController,
  ToastController,
  ToggleController,
  ToggleGroupController,
  TooltipController,
}
