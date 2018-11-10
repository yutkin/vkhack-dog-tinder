"""vkhack URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from ray import views


urlpatterns = [
    path('api/animals', views.animal_list),
    path('api/animals/<int:pk>', views.animal_detail),
    path('api/animals/like', views.animal_like),
    path('api/matches_for/<int:uid>', views.users_matched),
    path('api/animals/like/reset', views.animal_reset_likes),

    path('api/tasks', views.task_list),
    path('api/tasks/apply/<int:pk>', views.task_apply),
]
