from django.template import Context, loader
from django.http import HttpResponse
from django.shortcuts import redirect, render_to_response
from django.template import RequestContext
from urllib2 import Request, urlopen, URLError

from jericho.models import Post, SiteMessaging

import urllib
import urllib2

def index(request):
    try:
        site_messaging = SiteMessaging.objects.filter(active=True).order_by('-id')[0]
    except IndexError:
        site_messaging = None

    try:
        starting_post = Post.objects.filter(image__isnull=False).order_by('-id')[0]
        header_height = starting_post.image.image.height + 85
    except IndexError:
        starting_post = None

    posts = Post.objects.order_by('-added_datetime')
    return render_to_response('index.html', locals(), RequestContext(request))
