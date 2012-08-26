from django.template import Context, loader
from django.http import HttpResponse
from django.shortcuts import redirect, render_to_response
from django.template import RequestContext
from urllib2 import Request, urlopen, URLError

from jericho.models import Post

import urllib
import urllib2

def index(request):
    starting_post = Post.objects.order_by('-id')[0]
    posts = Post.objects.order_by('-id')
    return render_to_response('index.html', locals(), RequestContext(request))
