import express = require("express")

const cors = require('cors')
const app = express()
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const port = 3000
const mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose)
mongoose.connect("mongodb+srv://user001:oc1ZVsMosdW1uerB@exam.fhfeek0.mongodb.net/Patients?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

// define order schema
const orderSchema = new mongoose.Schema({
    orderId: Number,
    message: String,
    PatientId: Number,
})
orderSchema.plugin(AutoIncrement, {id: 'order_id', inc_field: 'orderId'})

// define patient schema
const patientSchema = new mongoose.Schema({
    patientId: Number,
    name: String,
    OrderId: orderSchema
})
patientSchema.plugin(AutoIncrement, {id: 'patient_id', inc_field: 'patientId'})

// define patient model
const Patient = mongoose.model("Patient", patientSchema)
// define order model
const Order = mongoose.model("Order", orderSchema)

app.use(cors())
app.use('/api', createProxyMiddleware({ 
        target: 'http://localhost:8080/',
        changeOrigin: true,
        onProxyRes: function (proxyRes: { headers: { [x: string]: string } }, req: any, res: any) {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*'
        }
    })
);

// initial dataset at beginning
const order = new Order({
    message: '超過120請施打8u'
})
// order.save()

const patient1 = new Patient({
    name: "小民",
    OrderId: order
})
// patient1.save()

const patient2 = new Patient({
    name: "小豪"
})
// patient2.save()

const patient3 = new Patient({
    name: "小新"
})
// patient3.save()

const patient4 = new Patient({
    name: "小劉"
})
// patient4.save()

const patient5 = new Patient({
    name: "小黑"
})
// patient5.save()

// run up app
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})

app.get('/', function (req, res) {
    res.send('Hello World!')
})

// get all patient data
app.get('/getAllPatientsData', async function (req, res) {
    const patients = await Patient.aggregate([
        [
            {
              $lookup: {
                from: 'orders',
                localField: 'patientId',
                foreignField: 'patientId',
                as: 'orderArrays'
              }
            }
          ]
    ])
    // 利用 forgin key做查詢 order 
    res.send(patients)
})

// update order message of patient
app.post('/editOrder/:patientId', jsonParser, async function (req, res) {
    const orderId = req.body.Patient.OrderId.orderId
    const orderMessage = req.body.Patient.OrderId.message
    const patientId = req.body.Patient.patientId
    const patientName = req.body.Patient.name
    console.log(req.body)
    if (orderId !== undefined) {
        Order.updateOne({"OrderId.orderId": orderId}, {"OrderId.message": orderMessage}, (err: any) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Successfully updated the document')
                res.send('Successfully updated the document')
            }
        })
    } else {
        const order = new Order({ message: orderMessage })
        console.log(Order)
        const patient = await Patient.findOne({ patientId: patientId });
        order.overwrite({ patientId: patientId, name: patientName, OrderId: order })
        await patient.save()

    }
})
