from django.db import models
from django.contrib.auth.models import User

class Image(models.Model):
    name = models.CharField(max_length=30)
    creator = models.ForeignKey(User)
    image = models.ImageField(upload_to='images')
    added_date = models.DateField()
    last_updated_date = models.DateField()

    # def upload_to_name(instance, filename):
    #     filename = datetime.utcnow()
    #     filename.strftime("%Y_%m_%d_%H_%M_%S_%f")
    #     return 'images/%s' % (filename)

class Post(models.Model):
    name = models.CharField(max_length=30)
    creator = models.ForeignKey(User)
    description = models.TextField()
    image = models.ForeignKey(Image)
    added_date = models.DateField()
    last_updated_date = models.DateField()

class Comment(models.Model):
    name = models.CharField(max_length=30)
    creator = models.ForeignKey(User)
    description = models.TextField()
    added_date = models.DateField()
    last_updated_date = models.DateField()
