from django.template import Context, loader
from django.http import HttpResponse
from django.shortcuts import redirect, render_to_response
from django.template import RequestContext
from django.core.paginator import Paginator, InvalidPage
from django.utils import simplejson

from jericho.models import Post, SiteMessaging

import itertools

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
        logo_padding = ((1070 - starting_post.image.image.width) / 2) - 94 - 40
        header_overlay_padding = ((1070 - starting_post.image.image.width) / 2) - 40
    except IndexError:
        starting_post = None
    except Post.DoesNotExist:
        starting_post = None

    if (post_id):
        posts = Post.objects.filter(pk__lte=post_id).order_by('-added_datetime')
    else:
        posts = Post.objects.order_by('-added_datetime')
    return render_to_response('index.html', locals(), RequestContext(request))

def list(request, post_id=0):
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
        logo_padding = ((1070 - starting_post.image.image.width) / 2) - 94 - 40
        header_overlay_padding = ((1070 - starting_post.image.image.width) / 2) - 40
    except IndexError:
        starting_post = None
    except Post.DoesNotExist:
        starting_post = None

    if (post_id):
        posts = Post.objects.filter(pk__lte=post_id).order_by('-added_datetime')
    else:
        posts = Post.objects.order_by('-added_datetime')

    return render_to_response('list.html', locals(), RequestContext(request))

def list_test(request):
    # Pull the data
    post_list = Post.objects.all()

    # Grab the first page of 100 items
    paginator = Paginator(post_list, 100)
    page_object = paginator.page(1)

    return render_to_response('list-test.html', locals(), RequestContext(request))

def list_json(request):
    # Pull the data
    post_list = Post.objects.all()
    page = request.GET.get('page');

    # Grab the first page of 100 items
    paginator = Paginator(post_list, 5)
    page_object = paginator.page(1)

    response_data = {}
    response_data['page'] = page_object.number
    response_data['test'] = request.GET.get('test');
    # response_data['hasNext'] = page_object.has_next

    # for (key, post in page_object.object_list):
    #     item_list[key] = {}
    #     item_list[key]['string'] = "{{ post.added_datetime|date:"U" }}:&nbsp;&nbsp;&nbsp;{{ post|truncatewords:10|escapejs }}"

    # response_data['itemList'] = item_list;
    return HttpResponse(simplejson.dumps(response_data), mimetype="application/json")

    # # Pull the data
    # post_list = Post.objects.all()

    # # Grab the first page of 100 items
    # paginator = Paginator(post_list, 100)
    # try:
    #     page_object = paginator.page(page)
    # except InvalidPage:
    #     # Return 404 if the page doesn't exist
    #     raise Http404
