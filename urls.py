from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from managemouse.views import init, restStrainPost, restStrainsGet, restStrainGet, restStrainDelete, restCagePut, restCageGet, restCagesGet, restCagePost, restCageDelete, restMouseGet, restMousePost, restMouseDelete, restMousePut, tableView
admin.autodiscover()

urlpatterns = patterns('',
	('^restAPI/strain/get/$', restStrainGet),
	('^restAPI/strains/get/$', restStrainsGet),
	('^restAPI/strain/delete/$', restStrainDelete),
	('^restAPI/strain/post/$', restStrainPost),
	('^restAPI/cage/post/$', restCagePost),
	('^restAPI/cage/get/$', restCageGet),
	('^restAPI/cages/get/$', restCagesGet),
	('^restAPI/cage/put/$', restCagePut),
	('^restAPI/cage/delete/$', restCageDelete),
	('^restAPI/mouse/post/$', restMousePost),
	('^restAPI/mouse/get/$', restMouseGet),
	('^restAPI/mouse/put/$', restMousePut),
	('^restAPI/mouse/delete/$', restMouseDelete),

    # Examples:
    # Main page
	url('^gridView/(?P<strainSelected>.+)/', init),
	#url(r'^$', initTest),
	
    # Table View
	url('^tableView', tableView),
    # url(r'^mouseManage/', include('mouseManage.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
	url(r'^admin/', include(admin.site.urls)),
)
