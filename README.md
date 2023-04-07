# NetSuite_SuiteScript_API_Integrations

Building a small collection of files which demonstrate using SuiteScript within NetSuite to interact with exernal software-as-a-service systems.

# Summary Description of Files

  These three SuiteScripts work together to integrate NetSuite and Salesforce, syncing invoice and payment data from NetSuite to the corresponding Sales Order records in Salesforce. When a user creates or modifies an invoice related to a Sales Order or applies a payment to such an invoice in NetSuite, the scripts trigger a data transfer to update the relevant Sales Order in Salesforce.

# Individual Scripts (SuiteScript)

# 1 - User Event Script for Invoices:  InvoiceTrigger.js
  
  This NetSuite User Event Script triggers when an invoice related to a Sales Order is created or updated. It creates a custom record ('customrecord_data_transfer') with the necessary information, such as the invoice ID, Salesforce Sales Order ID, and data type (1 for invoices). The Scheduled Script (InvoiceToSalesforce.js) will later process these custom records.


# 2 - User Event Script for Customer Payments: PaymentTrigger.js
  
  This NetSuite User Event Script triggers when a payment is applied to an invoice related to a Sales Order. It creates a custom record ('customrecord_data_transfer') with the necessary information, such as the invoice ID, Salesforce Sales Order ID, and data type (2 for payments). The Scheduled Script (InvoiceToSalesforce.js) will later process these custom records.


# 3 - Scheduled Script to Send Data to Salesforce:  InvoiceToSalesforce.js (Scheduled Script)
 
  This NetSuite Scheduled Script processes the custom records ('customrecord_data_transfer') created by the InvoiceTrigger.js and PaymentTrigger.js scripts. The script fetches unprocessed records, extracts the relevant data (invoice or payment data), and sends the data to Salesforce using OAuth 2.0 authentication. It updates the corresponding Sales Order records in Salesforce with the invoice or payment information received from NetSuite.

