import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'

type ModalAlertProps = {
  title: string
  description: string
  buttonTitle: string
  open: boolean
  onClose: () => void
  alertAction: () => void
}

function ModalAlert({
  title,
  description,
  buttonTitle,
  open,
  onClose,
  alertAction,
}: ModalAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={() => onClose()}>
      <AlertDialogContent className="max-w-md px-5">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={alertAction}
            className="mt-4 w-full py-6 font-semibold"
          >
            {buttonTitle}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ModalAlert }
