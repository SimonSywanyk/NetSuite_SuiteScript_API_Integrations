/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record'], function (record) {
    function afterSubmit(context) {
        var eventType = context.type;
        if (eventType === context.UserEventType.CREATE || eventType === context.UserEventType.EDIT) {
            var invoice = context.newRecord;
            var salesOrder = invoice.getValue('createdfrom');

            if (salesOrder) {
                var paymentStatus = invoice.getValue('status');

                if (paymentStatus === 'Paid In Full' || paymentStatus === 'Partially Paid') {
                    var dataTransfer = record.create({
                        type: 'customrecord_data_transfer', // Replace with your custom record type ID
                    });

                    dataTransfer.setValue('custrecord_invoice_id', invoice.id);
                    dataTransfer.setValue('custrecord_sf_sales_order_id', salesOrder); // Replace with your Salesforce Sales Order ID field
                    dataTransfer.setValue('custrecord_data_type', (paymentStatus === 'Paid In Full') ? 2 : 1);

                    dataTransfer.save();
                }
            }
        }
    }

    return {
        afterSubmit: afterSubmit,
    };
});
