from django.db import models
from django.contrib.auth.models import User
from taggit.managers import TaggableManager

class Image(models.Model):
    name = models.CharField(max_length=30)
    creator = models.ForeignKey(User)
    image = models.ImageField(upload_to='uploads')
    added_datetime = models.DateTimeField(auto_now_add=True)
    last_updated_datetime = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u'%s: %s' % (self.added_datetime, self.name)

    tags = TaggableManager()

class Post(models.Model):
    name = models.CharField(max_length=30)
    creator = models.ForeignKey(User)
    description = models.TextField()
    image = models.ForeignKey(Image, null=True, blank=True)
    added_datetime = models.DateTimeField(auto_now_add=True)
    last_updated_datetime = models.DateTimeField(auto_now=True)

    tags = TaggableManager()

    def __unicode__(self):
        return u'%s: %s' % (self.added_datetime, self.name)

    def get_next(self):
        next = Post.objects.filter(id__gt=self.id).order_by('added_datetime')
        if next:
            return next[0]
        return False

    def get_previous(self):
        previous = Post.objects.filter(id__lt=self.id).order_by('-added_datetime')
        if previous:
            return previous[0]
        return False

    def get_next_id(self):
        next = self.get_next()
        if next:
            return next.id
        return False

    def get_previous_id(self):
        previous = self.get_previous()
        if previous:
            return previous.id
        return False

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
