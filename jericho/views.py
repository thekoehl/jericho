from django.template import Context, loader
from django.http import HttpResponse
from django.shortcuts import redirect, render_to_response
from django.template import RequestContext
from urllib2 import Request, urlopen, URLError

from jericho.models import Post, SiteMessaging

import urllib
import urllib2

def index(request, post_id=0):
    try:
        site_messaging = SiteMessaging.objects.filter(active=True).order_by('-id')[0]
    except IndexError:
        site_messaging = None

    try:
        if (post_id == 0):
            starting_post = Post.objects.filter(image__isnull=False).order_by('-id')[0]
        else:
            starting_post = Post.objects.get(pk=post_id)
        header_height = starting_post.image.image.height + 85
        hero_width = starting_post.image.image.width
        # div margin - logo width - div padding
        logo_left = ((1070 - starting_post.image.image.width) / 2) - 94 - 40
    except IndexError:
        starting_post = None
    except Post.DoesNotExist:
        starting_post = None

    if (post_id):
        posts = Post.objects.filter(pk__lte=post_id).order_by('-added_datetime')
    else:
        posts = Post.objects.order_by('-added_datetime')
    return render_to_response('index.html', locals(), RequestContext(request))
