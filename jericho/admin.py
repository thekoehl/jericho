from django.contrib import admin
from jericho.models import Image, Post, Comment, SiteMessaging

admin.site.register(Image)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(SiteMessaging)
