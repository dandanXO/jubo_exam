import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const patientList = [
    { Id: 1, Name: '小民', OrderId: 1 },
    { Id: 2, Name: '小王', OrderId: 2 },
    { Id: 3, Name: '小中', OrderId: 3 },
    { Id: 4, Name: '小劉', OrderId: 4 },
    { Id: 5, Name: '小林', OrderId: 5 },
];
  
export const orderList = [
    { Id: 1, Message: '超過120請施打8u' },
    { Id: 2, Message: null },
    { Id: 3, Message: null },
    { Id: 4, Message: null },
    { Id: 5, Message: null },
];

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    paper: {
      width: '80%',
      maxHeight: 435,
    },
  }),
);