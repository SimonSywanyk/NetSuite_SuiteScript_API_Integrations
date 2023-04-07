/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/search', 'N/record', 'N/https', 'N/runtime'], function (search, record, https, runtime) {
    function execute(context) {
        var dataTransferSearch = search.create({
            type: 'customrecord_data_transfer', // Replace with your custom record type ID
            filters: [
                ['custrecord_processed', 'is', 'F'],
            ],
        });

        dataTransferSearch.run().each(function (result) {
            var invoiceId = result.getValue('custrecord_invoice_id');
            var sfSalesOrderId = result.getValue('custrecord_sf_sales_order_id');
            var dataType = result.getValue('custrecord_data_type');

            var invoice = record.load({
                type: record.Type.INVOICE,
                id: invoiceId,
            });

            var sfData = {};
            if (dataType == 1) {
                sfData.invoiceDate = invoice.getValue('trandate');
                sfData.invoiceNumber = invoice.getValue('tranid');
                sfData.invoiceTotal = invoice.getValue('total');
            } else if (dataType == 2) {
                sfData.paymentData = invoice.getValue('paymenteventamount');
                sfData.invoiceNumber = invoice.getValue('tranid');
                sfData.paymentAmount = invoice.getValue('amountpaid');
                sfData.paymentStatus = invoice.getValue('status');
            }

            sendToSalesforce(sfSalesOrderId, sfData);
            return true;
        });
    }

    function sendToSalesforce(sfSalesOrderId, sfData) {
        // Authenticate with Salesforce using OAuth 2.0
        var clientId = '<YOUR_SALESFORCE_CLIENT_ID>';
        var clientSecret = '<YOUR_SALESFORCE_CLIENT_SECRET>';
        var username = '<YOUR_SALESFORCE_USERNAME>';
        var password = '<YOUR_SALESFORCE_PASSWORD>';
        var securityToken = '<YOUR_SALESFORCE_SECURITY_TOKEN>';

        var tokenUrl = 'https://login.salesforce.com/services/oauth2/token';

        var tokenResponse = https.post({
            url: tokenUrl,
            body: 'grant_type=password&client_id=' + clientId + '&client_secret=' + clientSecret + '&username=' + username + '&password=' + password + securityToken,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        var tokenResponseJson = JSON.parse(tokenResponse.body);
        var accessToken = tokenResponseJson.access_token;
        var instanceUrl = tokenResponseJson.instance_url;

        // Update the Salesforce Sales Order object
        var salesOrderUrl = instanceUrl + '/services/data/v53.0/sobjects/SalesOrder/' + sfSalesOrderId;

        var salesOrderData = {
            // Map your custom fields in Salesforce with the sfData object
            Invoice_Date__c: sfData.invoiceDate,
            Invoice_Number__c: sfData.invoiceNumber,
            Invoice_Total__c: sfData.invoiceTotal,
            Payment_Data__c: sfData.paymentData,
            Payment_Amount__c: sfData.paymentAmount,
            Payment_Status__c: sfData.paymentStatus,
        };

        var updateResponse = https.patch({
            url: salesOrderUrl,
            body: JSON.stringify(salesOrderData),
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
        });
    }

    return {
        execute: execute,
    };
});
