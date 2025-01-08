import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'

// alert 관련 type정의 : triggerBtnText, alertTitle, actionBtnText 필수
type CustomAlertDialogProps = {
  triggerBtnText: string
  alertTitle: string
  description?: string
  cancelBtnText?: string
  actionBtnText: string
  onActionClick?: () => void // 클릭 시 실행될 함수
}

function CustomAlertDialog({
  triggerBtnText,
  alertTitle,
  description,
  cancelBtnText,
  actionBtnText,
  onActionClick,
}: CustomAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{triggerBtnText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelBtnText && (
            <AlertDialogCancel>{cancelBtnText}</AlertDialogCancel>
          )}
          <AlertDialogAction onClick={onActionClick}>
            {actionBtnText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { CustomAlertDialog }
