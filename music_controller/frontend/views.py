from django.shortcuts import render
# from django.http import HttpResponse
# from django.template import loader


def index(request, *args, **kwargs):
    # tamplate = loader.get_template('frontend/index.html')
    # return HttpResponse(tamplate.render())
    return render(request, 'frontend/index.html')