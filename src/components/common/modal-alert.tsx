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
  secondButtonTitle?: string
  open: boolean
  onClose: () => void
  secondAlertAction?: () => void
  alertAction?: () => void
}

function ModalAlert({
  title,
  description,
  buttonTitle,
  open,
  secondButtonTitle,
  secondAlertAction,
  onClose,
  alertAction,
}: ModalAlertProps) {
  const secondButtonClose = async () => {
    if (secondAlertAction) {
      secondAlertAction()
    }
    onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={() => onClose()}>
      <AlertDialogContent className="max-w-md px-5">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex w-full gap-8">
            <Button
              onClick={alertAction}
              className="mt-4 w-full py-6 font-semibold"
            >
              {buttonTitle}
            </Button>
            {secondButtonTitle && (
              <Button
                variant="destructive"
                onClick={secondButtonClose}
                className="mt-4 w-full py-6 font-semibold"
              >
                {secondButtonTitle}
              </Button>
            )}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ModalAlert }
