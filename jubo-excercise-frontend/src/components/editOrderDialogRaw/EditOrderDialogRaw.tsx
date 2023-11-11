import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { Patient } from '../../models/Patient'
import axios from 'axios'

export interface EditOrderDialogRawProps {
    classes: Record<'paper', string>
    id: string
    keepMounted: boolean
    open: boolean
    patient: Patient,
    orderArrays: any;
    onClose: (value?: string) => void
  }
  
export function EditOrderDialogRaw(props: EditOrderDialogRawProps) {
    console.log(props)
    const { onClose, open, patient: patientProp, ...other } = props
    const [ orderMsg, setOrderMsg ] = React.useState<string | undefined>(patientProp.OrderId?.message)
    const [ patient, setPatient ] = React.useState<Patient>(patientProp)
  
    // handle enter dialog to get parent props
    const handleEntering = () => {
      // console.log('handleEntering patientProp', patientProp)
      // console.log('handleEntering patientProp?.OrderId.Message', patientProp.OrderId?.message)
      if (patientProp?.OrderId?.message) {
        setOrderMsg(patientProp.OrderId.message)
      } else {
        setOrderMsg('')
      }
      setPatient(patientProp)
      // console.log('handleEntering patient', patient)
    };
  
    // handle cancel event
    const handleCancel = () => {
      onClose('sub com handleCancel')
    };
  
    // handle ok event
    const handleOk = () => {
      // console.log('handleOk orderMsg', orderMsg)
      // console.log('handleOk patientProp A', patientProp)
      patientProp.OrderId = { message: orderMsg || '',  orderId: patientProp.OrderId?.orderId }
      // console.log('handleOk patientProp B', patientProp)

      void axios({
        method: 'post',
        url: `http://localhost:3000/editOrder/${patientProp?.patientId}`,
        data: { Patient: patientProp }
      });

      onClose('sub com handleOk')
    };
  
    // handle on change event
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setOrderMsg((event.target as HTMLInputElement).value)
    };
  
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        onEntering={handleEntering}
        aria-labelledby="edit-order-dialog-title"
        open={open}
        {...other}
      >
        <DialogTitle id="edit-order-dialog-title">編輯醫囑</DialogTitle>
        {patient.orderArrays? patient.orderArrays.map((_order: any, i:number) => {
            return (
              <DialogContent dividers>
              <TextField
                  autoFocus
                  margin="dense"
                  id="order-text"
                  label={"醫囑內容"+(i+1)}
                  type="text"
                  fullWidth
                  onChange={handleChange}
                  value={orderMsg || ''}
              />
            </DialogContent>
            ) 
          }):
          <DialogContent dividers>
              <TextField
                  autoFocus
                  margin="dense"
                  id="order-text"
                  label={"醫囑內容"+(1)}
                  type="text"
                  fullWidth
                  onChange={handleChange}
                  value={orderMsg || ''}
              />
            </DialogContent>
        }
        
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="primary">
            取消
          </Button>
          <Button onClick={handleOk} color="primary">
            確定
          </Button>
        </DialogActions>
      </Dialog>
    );
  }