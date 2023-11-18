from django.urls import path , include, re_path
from .consumers import ChatConsumer

# Here, "" is routing to the URL ChatConsumer which 
# will handle the chat functionality.
websocket_urlpatterns = [
	# path("" , ChatConsumer.as_asgi()) ,
    re_path(r'^ws/(?P<groupId>[^/]+)/$', ChatConsumer.as_asgi()),
]
