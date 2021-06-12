import json

import azure.functions as func


def main(req: func.HttpRequest, urlJSON) -> func.HttpResponse:
    message = json.loads(urlJSON)
    return func.HttpResponse(message["URL"])
