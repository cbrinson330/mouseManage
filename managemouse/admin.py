from managemouse.models import cage 
from managemouse.models import mice 
from managemouse.models import strain 
from django.contrib import admin

class mouseInline(admin.StackedInline):
	model = mice 
	extra = 3

class cageAdmin(admin.ModelAdmin):
	inlines = [mouseInline]

admin.site.register(cage, cageAdmin)
admin.site.register(strain)
