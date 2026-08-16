from django.conf import settings
from django.contrib import admin
from django.http import FileResponse, Http404, JsonResponse
from django.urls import include, path, re_path


def health(request):
    return JsonResponse({'status': 'ok'})


def _serve_frontend(rel):
    root = settings.FRONTEND_DIST_DIR.resolve()
    target = (root / rel).resolve()
    if (
        not root.exists()
        or not target.is_relative_to(root)
        or not target.is_file()
    ):
        raise Http404
    return FileResponse(open(target, 'rb'))


def spa(request, path):
    if path and (path.startswith('assets/') or path in ('favicon.svg', 'icons.svg')):
        return _serve_frontend(path)
    return _serve_frontend('index.html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health, name='health'),
    path('api/auth/', include('accounts.urls')),
    path('api/applications/', include('applications.urls')),
    re_path(r'^(?!(?:api/|admin/|static/))(?P<path>.*)$', spa, name='spa'),
]