from django.db import models
from django.contrib.auth.models import User

class Image(models.Model):
    name = models.CharField(max_length=30)
    creator = models.ForeignKey(User)
    image = models.ImageField(upload_to='images')
    added_date = models.DateField()
    last_updated_date = models.DateField()

    def __unicode__(self):
        return u'%s: %s' % (self.added_date, self.name)

class Post(models.Model):
    name = models.CharField(max_length=30)
    creator = models.ForeignKey(User)
    description = models.TextField()
    image = models.ForeignKey(Image)
    added_date = models.DateField()
    last_updated_date = models.DateField()

    def __unicode__(self):
        return u'%s: %s' % (self.added_date, self.name)

class Comment(models.Model):
    name = models.CharField(max_length=30)
    creator = models.ForeignKey(User)
    post = models.ForeignKey(Post)
    description = models.TextField()
    added_date = models.DateField()
    last_updated_date = models.DateField()

    def __unicode__(self):
        return u'%s: %s' % (self.added_date, self.name)
