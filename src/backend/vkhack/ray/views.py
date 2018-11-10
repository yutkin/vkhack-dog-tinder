from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from ray.models import Animal
from ray.serializer import AnimalSerializer
from rest_framework.decorators import api_view
from django.db.models import Q

import logging
import requests

logger = logging.getLogger(__name__)


VK_APP_KEY = "916168e8916168e8916168e89e91079bd199161916168e8ca84da8c20213fddf8ee0283"


def notify_user(user_id, msg):
    params = dict(user_ids=user_id, message=msg)
    resp = requests.get(
        f"https://api.vk.com/method/notifications.sendMessage",
        params=params,
        timeout=5,
    )
    resp.raise_for_status()


@api_view(["POST"])
def animal_like(request):

    data = JSONParser().parse(request)

    animal = Animal.objects.get(pk=data.get("id"))

    user_id = data.get("user_id")

    if not animal:
        return HttpResponse(status=404)

    if animal.liked_by_one and animal.liked_by_two:
        return HttpResponse(status=200)

    if animal.liked_by_one:
        animal.liked_by_two = user_id
    else:
        animal.liked_by_one = user_id

    animal.save()

    msg = f"У Вас новая пара! Проверьте приложение."

    try:
        notify_user(user_id, msg)
    except Exception:
        logger.error(f"Cannot send message", exc_info=True)

    return HttpResponse(status=200)


@api_view(["POST"])
def animal_reset_likes(request):
    animals = Animal.objects.all()

    for animal in animals:
        animal.liked_by_one = None
        animal.liked_by_two = None
        animal.save(update_fields=["liked_by_one", "liked_by_two"])

    return HttpResponse(status=200)


@api_view(["GET", "POST"])
def animal_list(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == "POST":
        data = JSONParser().parse(request)

        serializer = AnimalSerializer(data=data)

        if serializer.is_valid():
            serializer.save()

            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    if request.method == "GET":
        user_id = int(request.GET.get("user_id", 0))

        if user_id:
            animals = Animal.objects.filter(
                ~Q(liked_by_one=user_id) & ~Q(liked_by_two=user_id) &
                (Q(liked_by_one=None) | Q(liked_by_two=None))
            )
        else:
            animals = Animal.objects.all()

        serializer = AnimalSerializer(animals, many=True)
        return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def animal_detail(request, pk):
    """
    Retrieve, update or delete a code snippet.
    """
    try:
        snippet = Animal.objects.get(pk=pk)
    except Animal.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = AnimalSerializer(snippet)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = AnimalSerializer(snippet, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)


@api_view(["GET"])
def users_matched(request, uid):

    animals = Animal.objects.filter(
        (~Q(liked_by_one=None) & ~Q(liked_by_two=None)) &
        (Q(liked_by_one=uid) | Q(liked_by_two=uid))
    )

    serializer = AnimalSerializer(animals, many=True)

    return JsonResponse(serializer.data, safe=False)
