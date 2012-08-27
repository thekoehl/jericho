from django.db import models
from django.contrib.auth.models import User

class Image(models.Model):
    name = models.CharField(max_length=30)
    creator = models.ForeignKey(User)
    image = models.ImageField(upload_to='uploads')
    added_datetime = models.DateTimeField(auto_now_add=True)
    last_updated_datetime = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u'%s: %s' % (self.added_datetime, self.name)

class Post(models.Model):
    name = models.CharField(max_length=30)
    creator = models.ForeignKey(User)
    description = models.TextField()
    image = models.ForeignKey(Image, null=True, blank=True)
    added_datetime = models.DateTimeField(auto_now_add=True)
    last_updated_datetime = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u'%s: %s' % (self.added_datetime, self.name)

class Comment(models.Model):
    name = models.CharField(max_length=30)
    creator = models.ForeignKey(User)
    post = models.ForeignKey(Post)
    description = models.TextField()
    added_datetime = models.DateTimeField(auto_now_add=True)
    last_updated_datetime = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u'%s: %s' % (self.added_datetime, self.name)

class SiteMessaging(models.Model):
    name = models.CharField(max_length=100)
    creator = models.ForeignKey(User)
    description = models.TextField()
    sunburst = models.ForeignKey(Image, null=True, blank=True)
    active = models.BooleanField()
    added_datetime = models.DateTimeField(auto_now_add=True)
    last_updated_datetime = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u'%s: %s' % (self.added_datetime, self.name)
