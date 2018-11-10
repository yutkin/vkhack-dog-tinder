from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from ray.models import Animal, Task
from ray.serializer import AnimalSerializer, TaskSerializer
from rest_framework.decorators import api_view
from django.db.models import Q

import logging
import requests

logger = logging.getLogger(__name__)


VK_APP_KEY = "916168e8916168e8916168e89e91079bd199161916168e8ca84da8c20213fddf8ee0283"


def notify_user(user_id, msg):
    params = dict(user_ids=user_id, message=msg, access_token=VK_APP_KEY, v=5.52)
    resp = requests.get(
        f"https://api.vk.com/method/notifications.sendMessage", params=params, timeout=5
    )
    resp.raise_for_status()
    logger.debug(f"MESSAGE SENT {resp.text}")


@api_view(["POST"])
def animal_like(request):

    data = JSONParser().parse(request)

    try:
        animal = Animal.objects.get(pk=data.get("id"))
    except Animal.DoesNotExist:
        return HttpResponse(status=404)

    user_id = data.get("user_id")

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
    except requests.HTTPError:
        logger.error(f"Cannot send notification", exc_info=True)

    return HttpResponse(status=200)


@api_view(["POST"])
def animal_reset_likes(request):
    Animal.objects.all().update(liked_by_one=None, liked_by_two=None)
    return HttpResponse(status=200)


@api_view(["POST"])
def animal_reset_likes_detail(request, pk):
    try:
        an = Animal.objects.get(pk=pk)
    except Animal.DoesNotExist:
        return HttpResponse(status=404)

    an.liked_by_one = None
    an.liked_by_two = None
    an.save()

    return HttpResponse(status=200)


@api_view(["GET", "POST"])
def animal_list(request):
    if request.method == "POST":
        data = JSONParser().parse(request)

        serializer = AnimalSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    if request.method == "GET":
        user_id = int(request.GET.get("user_id", 0))
        limit = int(request.GET.get("limit", 15))

        if user_id:
            animals = Animal.objects.filter(
                ~Q(liked_by_one=user_id)
                & ~Q(liked_by_two=user_id)
                & (Q(liked_by_one=None) | Q(liked_by_two=None))
            )[:limit]
        else:
            animals = Animal.objects.all()[:limit]

        serializer = AnimalSerializer(animals, many=True)
        return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def animal_detail(request, pk):
    try:
        snippet = Animal.objects.get(pk=pk)
    except Animal.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "GET":
        serializer = AnimalSerializer(snippet)
        return JsonResponse(serializer.data)

    elif request.method == "PUT":
        data = JSONParser().parse(request)
        serializer = AnimalSerializer(snippet, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)


@api_view(["GET"])
def users_matched(request, uid):

    animals = Animal.objects.filter(
        (~Q(liked_by_one=None) & ~Q(liked_by_two=None))
        & (Q(liked_by_one=uid) | Q(liked_by_two=uid))
    )[:15]

    serializer = AnimalSerializer(animals, many=True)

    return JsonResponse(serializer.data, safe=False)


@api_view(["GET", "POST"])
def task_list(request):
    if request.method == "POST":
        data = JSONParser().parse(request)

        serializer = TaskSerializer(data=data)

        if serializer.is_valid():
            serializer.save()

            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)

    if request.method == "GET":
        task = Task.objects.all()

        serializer = TaskSerializer(task, many=True)
        return JsonResponse(serializer.data, safe=False)


@api_view(["POST"])
def task_apply(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return HttpResponse(status=404)

    new_val = task.persons_applied + 1

    if new_val > task.persons_needed:
        return HttpResponse(status=400)

    task.persons_applied = new_val
    task.save()

    return HttpResponse(status=200)
