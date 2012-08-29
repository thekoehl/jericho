from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'jericho.views.home', name='home'),
    # url(r'^jericho/', include('jericho.foo.urls')),
    url(r'^$', 'jericho.views.index', name='home'),
    url(r'^(?P<post_id>\d+)/$', 'jericho.views.index'),
    url(r'^list/', 'jericho.views.list_test'),
    url(r'^list/json/(?P<page>[0-9]+)/', 'jericho.views.list_json'),
    url(r'^list/(?P<post_id>\d+)$', 'jericho.views.list'),
    url(r'^show/(?P<post_id>\d+)$', 'jericho.views.show'),
    url(r'^comments/', include('django.contrib.comments.urls')),
    # url(r'^search/', include('haystack.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

if settings.DEBUG:
    urlpatterns += patterns('django.views.static',
        (r'^assets/(?P<path>.*)$',
         'serve',
            {
                'document_root': settings.MEDIA_ROOT,
                'show_indexes': True
            }
        ),
    )
