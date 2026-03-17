import { application } from "./application"
import { registerShadcnControllers } from "./shadcn/index"
import ToastTriggerController from "./toast_trigger_controller"
import SonnerController from "./sonner_controller"

registerShadcnControllers(application)
application.register("toast-trigger", ToastTriggerController)
application.register("sonner", SonnerController)
