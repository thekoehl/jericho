from django.template import Context, loader
from django.http import HttpResponse
from django.shortcuts import redirect, render_to_response
from django.template import RequestContext
from urllib2 import Request, urlopen, URLError

import urllib
import urllib2

def index(request):
    return render_to_response('index.html', locals(), RequestContext(request))

# def getData(request):
#     url = 'https://agad-gplus.appspot.com/partners/question_of_day/3'
#     requestData = urllib.urlencode(request.REQUEST)
#     fullUrl = url + '?' + requestData
#     urlRequest = urllib2.Request(fullUrl)

#     try:
#         urlResponse = urllib2.urlopen(urlRequest)
#     except URLError, e:
#         if hasattr(e, 'reason'):
#             jsonData = '{"status":0, "data":"There was an hitting the API url from the proxy, error message: ' + e.reason + '"}'
#         elif hasattr(e, 'code'):
#             jsonData = '{"status":0, "data":"There was an hitting the API url from the proxy, error code: ' + e.code + '"}'
#     else:
#         data = urlResponse.read()
#         data = data[9:-1]
#         jsonData = '{"status":1, "data":' + data + '}'

#     return HttpResponse(jsonData, mimetype="application/json")
