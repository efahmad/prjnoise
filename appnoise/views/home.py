# Create your views here.

from django.http import HttpResponse
from django.template import loader


# GET /
def index(request):
    context = {}
    template = loader.get_template('appnoise/layout.html')
    return HttpResponse(template.render(context, request))
