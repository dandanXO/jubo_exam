import React, { useEffect } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import ListSubheader from '@material-ui/core/ListSubheader'
import { EditOrderDialogRaw } from './components/editOrderDialogRaw/EditOrderDialogRaw'
import { useStyles } from './mocks/constData'
import { Patient } from './models/Patient'
import axios from 'axios'
import './App.css'

function App() {
  const url = "http://localhost:3000/getAllPatientsData"
  const classes = useStyles()
  const [ open, setOpen ] = React.useState<boolean>(false)
  const [ patient, setPatient ] = React.useState<Patient>(new Patient())
  const [ data, setData ] = React.useState([])
  const [ loadData, setLoadData ] = React.useState<boolean>(true)

  // get api to fetch all patient & order data
  const fetchData = async () => {
    const result = await axios.get(url)
    setData(result.data)
  }

  // init & refresh data
  useEffect(() => {
    if (loadData) {
      fetchData()
      setLoadData(!loadData)
    } else return
  },[data, loadData])

  // handle click each order of list
  const handleClickListItem = (patient: Patient) => () => {
    setOpen(true);
    // console.log('handleClickListItem patient', patient)
    if (patient)
      setPatient(patient)
  };

  // handle close dialog event
  const handleClose = (receiveSubComValue?: string) => {
    setOpen(false);
    // console.log('receiveSubComValue', receiveSubComValue)
    // latency 500ms to fetch data again, because fetch right away data won't get newest
    setTimeout(() => setLoadData(true), 500)
  };

  return (
    <>
      <List subheader={<ListSubheader>住民與醫囑</ListSubheader>} className={classes.root}>
        { data.map((patient: { patientId: number; name: string; orderArrays:[]; OrderId: { orderId: number; message: string } }) => {
          const patientId = `patient-id-${patient.patientId}`;
          const patientData: Patient = {
            patientId: patient.patientId,
            name: patient.name,
            orderArrays: patient?.orderArrays,
            OrderId: {
              orderId: patient.OrderId?.orderId,
              message: patient.OrderId?.message
            }
          }
          // console.log('patientData', patientData);
          
          return (
            <ListItem key={patient.patientId}>
              <ListItemText id={patientId} primary={patient.name} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="編輯" onClick={handleClickListItem(patientData)}>
                  <EditIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        }) }
      </List>
      <EditOrderDialogRaw
        classes={{
          paper: classes.paper,
        }}
        id="order-edit"
        keepMounted
        open={open}
        onClose={handleClose}
        patient={patient} orderArrays={undefined}      />
    </>
  );
}

export default App;
