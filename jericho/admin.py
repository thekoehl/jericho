from django.contrib import admin
from jericho.models import Image, Post, SiteMessaging

class ImageAdmin(admin.ModelAdmin):
    list_display = ('name', 'creator', 'image', 'added_datetime', 'last_updated_datetime',)
    search_fields = ('name', 'image',)
    list_filter = ('added_datetime',)
    date_hierarchy = 'added_datetime'
    ordering = ('-added_datetime',)

class PostAdmin(admin.ModelAdmin):
    list_display = ('name', 'creator', 'image', 'added_datetime', 'last_updated_datetime',)
    search_fields = ('name', 'image',)
    list_filter = ('added_datetime',)
    date_hierarchy = 'added_datetime'
    ordering = ('-added_datetime',)

class SiteMessagingAdmin(admin.ModelAdmin):
    list_display = ('name', 'creator', 'sunburst', 'active', 'added_datetime', 'last_updated_datetime',)
    search_fields = ('name',)
    list_filter = ('added_datetime',)
    date_hierarchy = 'added_datetime'
    ordering = ('-added_datetime',)

admin.site.register(Image, ImageAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(SiteMessaging, SiteMessagingAdmin)
