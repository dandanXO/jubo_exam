export class Patient {
    patientId: number | undefined;
    name: string | undefined;
    orderArrays: any;
    OrderId: {
        orderId: number | undefined;
        message: string;
    } | undefined;
    constructor() {}
}