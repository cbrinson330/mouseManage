from managemouse.models import cage 
from managemouse.models import mice 
from django.contrib import admin

class mouseInline(admin.StackedInline):
	model = mice 
	extra = 3

class cageAdmin(admin.ModelAdmin):
	inlines = [mouseInline]

admin.site.register(cage, cageAdmin)
