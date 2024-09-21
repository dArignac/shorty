# Development

This gives some insights into development, mostly for myself to remember the information.

## Startup

- create `functions/local.settings.json`:

```
{
  "IsEncrypted": false,
  "Values": {
    "StorageAccount": "<storage-account-connection-string>",
    "FUNCTIONS_WORKER_RUNTIME": "python"
  },
  "Host": {
    "CORS": "http://localhost:3000"
  }
}
```

- [Install Azure Functions SDK](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=linux%2Ccsharp%2Cportal%2Cbash%2Ckeda&source=docs#install-the-azure-functions-core-tools)
- Run everything with Static Web Apps CLI (see below): `npm run swa` from root folder (this also starts the functions emulator and react)
- open http://localhost:4280

## Miscellaneous

Uses the [Django validator](https://github.com/django/django/blob/main/django/core/validators.py) approach for URL validation which is partially translated into React and the Python code for the functions.

## Workflows

- create shorted link
  - send to function
  - store to database if not yet existing
  - return short url
  - show "detail" page with qr code generated in frontend
- open short url
  - send to function to retrieve real url
  - forward to url
- generic error route

## Azure Static Web App

- [Authentication](https://docs.microsoft.com/en-us/azure/static-web-apps/authentication-authorization)
- [User Information](https://docs.microsoft.com/en-us/azure/static-web-apps/user-information?tabs=javascript)
- [Routes](https://docs.microsoft.com/en-us/azure/static-web-apps/configuration#routes)

### Authentication Workflow

- redirect user to `/.auth/login/github`
- user authenticates and gets redirected to `/`
- generally read `/.auth/me` for credentials
- redirect user to `/.auth/logout/` to log out

## Static Web Apps CLI

Emulates the Static Web App with authentication: https://github.com/azure/static-web-apps-cli#readme

Use `npm run swa` to run in dev mode and browse http://localhost:4280
Use `npm run swa:prod` to run in prod mode - build react beforehand and _do not start functions_ - browse http://localhost:4281

## Azure Functions (in Azure Static Web App)

- Documentation:
  - https://docs.microsoft.com/en-us/python/api/azure-functions/azure.functions?view=azure-python
- URLs:
  - `/api/urls` - `POST` - create URL
  - `/api/short/<code>` - `GET` - get URL information
- Azure Functions Table Storage Bindings
  - https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-table
  - the `filter` OData query can take any key of the input JSON request body for filtering, see `functions.json` for `SetURL`
- Local debugging
  - press `F5` in Visual Studio Code to debug (stop any `func start` instance before), see `.vscode` folder for the setup

### Setup for deployment

#### Create storage connection string

The storage account connection string must be set for the Azure Static Web App as well. Best is to create a Shared Access Signature (SAS) with limited permissions. Therefore open "Shared access signature" in Azure portal in the storage account and configure a SAS:

- allowed services: `Table`
- Allowed resource types: `Object`
- Allowed permissions: `Read` and `Add`
- set a start and end date according to your preferences
- Allowed protocols: `HTTPS only`
- Preferred routing tier: `Basic (default)`

Take the `SAS token` value from the portal page and remove the question mark at the beginning and insert it:

```
TableEndpoint=https://urlstore.table.core.windows.net;SharedAccessSignature=<SAS-token>
```

For more information about storage account SAS read [here](https://docs.microsoft.com/en-us/rest/api/storageservices/create-service-sas#permissions-for-a-table).

Further reading about connection strings: [Azure documentation](https://docs.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string#create-a-connection-string-using-a-shared-access-signature).

#### Configure the connection string

The application settings of the Static Web App **can** be set via the Azure Portal - create an entry with the name `StorageAccount` and with the connection string as value.

**For me this did not work (the changes were not saved), that's why I used the Azure CLI to do it:**

Prerequisite: Install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

Create the file `functions/local.settings.properties.json` and fill it with the following content, replace `<connection-string>` with the connection string to your storage account:

```
{
  "properties": {
    "StorageAccount": "<connection-string>"
  }
}
```

Run `az rest --method post --uri "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/staticSites/<static-web-app-name>/listFunctionAppSettings?api-version=2019-12-01-preview"` _to retrieve the current settings_.

Run `az rest --method put --headers "Content-Type=application/json" --uri "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/staticSites/<static-web-app-name>/config/functionappsettings?api-version=2019-12-01-preview" --body @local.settings.properties.json` to _update the settings_.
