import datetime
from haystack import indexes
from jericho.models import Post


class PostIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    author = indexes.CharField(model_attr='creator')
    added_datetime = indexes.DateTimeField(model_attr='added_datetime')

    def get_model(self):
        return Post

    def index_queryset(self):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.filter(added_datetime__lte=datetime.datetime.now())
